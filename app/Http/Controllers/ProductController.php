<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Support\Arr;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()
            ->when($request->has('in_stock'), function ($query) {
                $query->where('stock_quantity', '>', 0);
            })
            ->when($request->has('min_price'), function ($query) use ($request) {
                $query->where('price', '>=', $request->min_price);
            })
            ->when($request->has('max_price'), function ($query) use ($request) {
                $query->where('price', '<=', $request->max_price);
            })
            ->when($request->has('category'), function ($query) use ($request) {
                $query->where('category', $request->category);
            })
            ->when($request->has('price_range'), function ($query) use ($request) {
                $query->whereBetween('price', [
                    $request->price_range[0],
                    $request->price_range[1]
                ]);
            });

        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_dir', 'desc');

        $query->orderBy($sortField, $sortDirection);

        return Inertia::render('Products/Index', [
            'products' => $query->paginate(
                $request->input('per_page', 10)
            )->withQueryString(),
            'filters' => $request->only([
                'search',
                'in_stock',
                'price_range',
                'sort_by',
                'sort_dir'
            ]),
            'status' => session('status'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'sku' => 'required|string|unique:products,sku',
            'stock_quantity' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        $product = Product::create($validated);

        if ($request->hasFile('image')) {
            $product->addMediaFromRequest('image')
                    ->toMediaCollection('products');
        }

        return redirect()->back()->with('success', 'Product created successfully.');
    }

    protected function processImages($product, $images)
    {
        foreach (Arr::wrap($images) as $image) {
            try {
                $product->addMedia($image)
                    ->withResponsiveImages()
                    ->toMediaCollection('products');
            } catch (\Exception $e) {
                report($e);
                continue;
            }
        }
    }

    public function show(Product $product)
    {
        return Inertia::render('Products/Show', [
            'product' => $product
        ]);
    }

    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', [
            'product' => $product->load('media'),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,webp|max:10240',
            'images.*' => 'nullable|image|mimes:jpeg,png,webp|max:10240',
        ]);

        $product->update(Arr::except($validated, ['image', 'images']));

        if ($request->hasFile('image')) {
            $product->clearMediaCollection('products');
            $product->addMediaFromRequest('image')
                ->toMediaCollection('products');
        }

        if ($request->hasFile('images')) {
            $this->processImages($product, $request->file('images'));
        }

        return redirect()->route('products.index')
            ->with('status', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')
            ->with('status', 'Product deleted successfully.');
    }

    public function storeImages(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'images.*' => 'required|image|mimes:jpeg,png,webp|max:10240',
        ]);

        $product = Product::findOrFail($request->product_id);
        $this->processImages($product, $request->file('images'));

        return response()->json([
            'message' => 'Images uploaded successfully',
            'media' => $product->getMedia('products')
        ]);
    }

    public function destroyImage(Product $product, Media $media)
    {
        if ($media->model_id !== $product->id) {
            abort(403);
        }

        $media->delete();

        return back()->with('status', 'Image deleted successfully');
    }

    public function addToCart(Request $request, Product $product)
    {
        $cart = session()->get('cart', []);

        if (isset($cart[$product->id])) {
            $cart[$product->id]['quantity']++;
        } else {
            $cart[$product->id] = [
                "name" => $product->name,
                "quantity" => 1,
                "price_kwacha" => $product->price_kwacha,
                "price_usd" => $product->price_usd,
                "image" => $product->image_path
            ];
        }

        session()->put('cart', $cart);
        return redirect()->back()->with('success', 'Product added to cart successfully!');
    }
}