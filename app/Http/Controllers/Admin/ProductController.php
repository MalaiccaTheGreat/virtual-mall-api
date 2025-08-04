<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Products/Index', [
            'products' => Product::with('store')->paginate(10)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Products/Create', [
            'stores' => Store::all(['id', 'name'])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'price_kwacha' => 'required|numeric',
            'store_id' => 'required|exists:stores,id',
            'image' => 'nullable|image|max:1024',
        ]);

        $product = Product::create($validated);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $product->update(['image_path' => $path]);
        }

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'stores' => Store::all(['id', 'name'])
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'price_kwacha' => 'required|numeric',
            'store_id' => 'required|exists:stores,id',
            'image' => 'nullable|image|max:1024',
        ]);

        $product->update($validated);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $product->update(['image_path' => $path]);
        }

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }
}
