<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Storefront;
use App\Models\ProductVariation;
use App\Models\PriceHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'admin']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $products = Product::with(['storefront', 'defaultVariation'])
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            })
            ->when($request->input('storefront_id'), function ($query, $storefrontId) {
                $query->where('storefront_id', $storefrontId);
            })
            ->when($request->input('category'), function ($query, $category) {
                $query->where('category', $category);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'storefronts' => Storefront::all(['id', 'name']),
            'filters' => $request->only(['search', 'storefront_id', 'category']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Products/Create', [
            'storefronts' => Storefront::active()->get(['id', 'name']),
            'categories' => $this->getProductCategories(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'storefront_id' => 'required|exists:storefronts,id',
            'description' => 'nullable|string',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'sku' => 'nullable|string|max:100|unique:products,sku',
            'barcode' => 'nullable|string|max:100|unique:products,barcode',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'variations' => 'nullable|array',
            'variations.*.color' => 'required_with:variations|string|max:50',
            'variations.*.size' => 'required_with:variations|string|max:20',
            'variations.*.price' => 'required_with:variations|numeric|min:0',
            'variations.*.sale_price' => 'nullable|numeric|min:0',
            'variations.*.stock_quantity' => 'required_with:variations|integer|min:0',
            'variations.*.sku' => 'nullable|string|max:100',
        ]);

        return DB::transaction(function () use ($validated) {
            // Generate SKU if not provided
            if (empty($validated['sku'])) {
                $validated['sku'] = 'PROD-' . strtoupper(Str::random(8));
            }

            // Create the product
            $product = Product::create([
                'name' => $validated['name'],
                'storefront_id' => $validated['storefront_id'],
                'description' => $validated['description'] ?? null,
                'category' => $validated['category'],
                'price' => $validated['price'],
                'sale_price' => $validated['sale_price'] ?? null,
                'sku' => $validated['sku'],
                'barcode' => $validated['barcode'] ?? null,
                'is_featured' => $validated['is_featured'] ?? false,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            // Create variations if provided
            if (!empty($validated['variations'])) {
                foreach ($validated['variations'] as $variation) {
                    $product->variations()->create([
                        'color' => $variation['color'],
                        'size' => $variation['size'],
                        'price' => $variation['price'],
                        'sale_price' => $variation['sale_price'] ?? null,
                        'stock_quantity' => $variation['stock_quantity'],
                        'sku' => $variation['sku'] ?? $this->generateVariationSku($product->sku, $variation),
                        'is_default' => false, // First variation will be default
                    ]);
                }
                
                // Set first variation as default
                $product->variations()->first()->update(['is_default' => true]);
            } else {
                // Create a default variation if no variations provided
                $product->variations()->create([
                    'price' => $product->price,
                    'sale_price' => $product->sale_price,
                    'stock_quantity' => 0,
                    'sku' => $product->sku . '-DEFAULT',
                    'is_default' => true,
                ]);
            }

            // Log price history
            PriceHistory::logPriceChange(
                $product,
                $product->price,
                $product->price,
                auth()->id(),
                'Initial product creation'
            );

            return redirect()
                ->route('admin.products.edit', $product)
                ->with('success', 'Product created successfully');
        });
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
        $product->load(['storefront', 'variations']);

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'storefronts' => Storefront::active()->get(['id', 'name']),
            'categories' => $this->getProductCategories(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'storefront_id' => 'required|exists:storefronts,id',
            'description' => 'nullable|string',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'sku' => 'required|string|max:100|unique:products,sku,' . $product->id,
            'barcode' => 'nullable|string|max:100|unique:products,barcode,' . $product->id,
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:500',
            'seo_keywords' => 'nullable|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug,' . $product->id,
            'variations' => 'nullable|array',
            'variations.*.id' => 'nullable|exists:product_variations,id',
            'variations.*.color' => 'required_with:variations|string|max:50',
            'variations.*.size' => 'required_with:variations|string|max:20',
            'variations.*.material' => 'nullable|string|max:100',
            'variations.*.style' => 'nullable|string|max:100',
            'variations.*.price' => 'required_with:variations|numeric|min:0',
            'variations.*.sale_price' => 'nullable|numeric|min:0',
            'variations.*.stock_quantity' => 'required_with:variations|integer|min:0',
            'variations.*.sku' => 'required_with:variations|string|max:100',
            'variations.*.barcode' => 'nullable|string|max:100',
            'variations.*.is_default' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max per file
            'deleted_images' => 'nullable|array',
            'deleted_images.*' => 'exists:media,id',
        ]);

        return DB::transaction(function () use ($product, $validated) {
            // Check if price has changed
            if ($product->price != $validated['price'] || $product->sale_price != $validated['sale_price']) {
                // Log price change
                PriceHistory::logPriceChange(
                    $product,
                    $product->price,
                    $validated['price'],
                    auth()->id(),
                    'Product price updated'
                );
            }

            // Update product attributes
            $product->update([
                'name' => $validated['name'],
                'storefront_id' => $validated['storefront_id'],
                'description' => $validated['description'] ?? null,
                'category' => $validated['category'],
                'price' => $validated['price'],
                'sale_price' => $validated['sale_price'] ?? null,
                'sku' => $validated['sku'],
                'barcode' => $validated['barcode'] ?? null,
                'is_featured' => $validated['is_featured'] ?? false,
                'is_active' => $validated['is_active'] ?? true,
                'seo_title' => $validated['seo_title'] ?? null,
                'seo_description' => $validated['seo_description'] ?? null,
                'seo_keywords' => $validated['seo_keywords'] ?? null,
                'slug' => $validated['slug'],
            ]);

            // Handle images
            if (isset($validated['images'])) {
                foreach ($validated['images'] as $image) {
                    $path = $image->store('products/' . $product->id, 'public');
                    $product->addMedia(storage_path('app/public/' . $path))
                        ->toMediaCollection('products');
                }
            }

            // Delete removed images
            if (isset($validated['deleted_images'])) {
                $product->media()
                    ->whereIn('id', $validated['deleted_images'])
                    ->delete();
            }

            // Update or create variations
            if (isset($validated['variations'])) {
                $existingVariationIds = $product->variations->pluck('id')->toArray();
                $updatedVariationIds = [];

                foreach ($validated['variations'] as $variationData) {
                    $variationData['is_default'] = $variationData['is_default'] ?? false;
                    
                    // If this is the new default, unset default from others
                    if ($variationData['is_default']) {
                        $product->variations()->update(['is_default' => false]);
                    }

                    if (isset($variationData['id'])) {
                        // Update existing variation
                        $variation = $product->variations()->find($variationData['id']);
                        if ($variation) {
                            // Log price change if it's different
                            if ($variation->price != $variationData['price']) {
                                PriceHistory::logPriceChange(
                                    $variation,
                                    $variation->price,
                                    $variationData['price'],
                                    auth()->id(),
                                    'Variation price updated'
                                );
                            }
                            
                            $variation->update([
                                'color' => $variationData['color'],
                                'size' => $variationData['size'],
                                'material' => $variationData['material'] ?? null,
                                'style' => $variationData['style'] ?? null,
                                'price' => $variationData['price'],
                                'sale_price' => $variationData['sale_price'] ?? null,
                                'stock_quantity' => $variationData['stock_quantity'],
                                'sku' => $variationData['sku'],
                                'barcode' => $variationData['barcode'] ?? null,
                                'is_default' => $variationData['is_default'],
                            ]);
                            $updatedVariationIds[] = $variation->id;
                        }
                    } else {
                        // Create new variation
                        $variation = $product->variations()->create([
                            'color' => $variationData['color'],
                            'size' => $variationData['size'],
                            'material' => $variationData['material'] ?? null,
                            'style' => $variationData['style'] ?? null,
                            'price' => $variationData['price'],
                            'sale_price' => $variationData['sale_price'] ?? null,
                            'stock_quantity' => $variationData['stock_quantity'],
                            'sku' => $variationData['sku'],
                            'barcode' => $variationData['barcode'] ?? null,
                            'is_default' => $variationData['is_default'],
                        ]);
                        $updatedVariationIds[] = $variation->id;
                    }
                }

                // Delete variations that were removed
                $variationsToDelete = array_diff($existingVariationIds, $updatedVariationIds);
                if (!empty($variationsToDelete)) {
                    $product->variations()->whereIn('id', $variationsToDelete)->delete();
                }
            }

            return redirect()
                ->route('admin.products.edit', $product)
                ->with('success', 'Product updated successfully');
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        DB::transaction(function () use ($product) {
            // Delete associated media
            $product->media()->delete();
            
            // Delete variations and their price history
            $product->variations()->each(function ($variation) {
                $variation->priceHistory()->delete();
                $variation->delete();
            });
            
            // Delete product price history
            $product->priceHistory()->delete();
            
            // Delete the product
            $product->delete();
        });

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product deleted successfully');
    }

    /**
     * Get the list of product categories.
     *
     * @return array
     */
    protected function getProductCategories()
    {
        // This should be replaced with actual categories from your database or configuration
        return [
            'Clothing',
            'Electronics',
            'Home & Garden',
            'Sports & Outdoors',
            'Beauty & Personal Care',
            'Books & Media',
            'Toys & Games',
            'Health & Wellness',
        ];
    }

    /**
     * Generate a variation SKU based on product SKU and variation attributes.
     *
     * @param string $productSku
     * @param array $variation
     * @return string
     */
    protected function generateVariationSku($productSku, $variation)
    {
        $color = substr(preg_replace('/[^A-Z0-9]/', '', strtoupper($variation['color'] ?? '')), 0, 3);
        $size = strtoupper($variation['size'] ?? '');
        
        return sprintf('%s-%s-%s', $productSku, $color, $size);
    }

    /**
     * Get all variations for a product.
     */
    public function variationsIndex(Product $product)
    {
        return response()->json([
            'data' => $product->variations()->get()
        ]);
    }

    /**
     * Store a new variation for a product.
     */
    public function storeVariation(Request $request, Product $product)
    {
        $validated = $request->validate([
            'color' => 'required|string|max:50',
            'size' => 'required|string|max:20',
            'material' => 'nullable|string|max:100',
            'style' => 'nullable|string|max:100',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'sku' => 'required|string|max:100|unique:product_variations,sku',
            'barcode' => 'nullable|string|max:100',
            'is_default' => 'boolean',
        ]);

        if ($validated['is_default'] ?? false) {
            $product->variations()->update(['is_default' => false]);
        }

        $variation = $product->variations()->create($validated);

        return response()->json([
            'message' => 'Variation created successfully',
            'data' => $variation
        ], 201);
    }

    /**
     * Update a product variation.
     */
    public function updateVariation(Request $request, Product $product, ProductVariation $variation)
    {
        $validated = $request->validate([
            'color' => 'sometimes|required|string|max:50',
            'size' => 'sometimes|required|string|max:20',
            'material' => 'nullable|string|max:100',
            'style' => 'nullable|string|max:100',
            'price' => 'sometimes|required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'sometimes|required|integer|min:0',
            'sku' => 'sometimes|required|string|max:100|unique:product_variations,sku,' . $variation->id,
            'barcode' => 'nullable|string|max:100',
            'is_default' => 'boolean',
        ]);

        if (isset($validated['is_default']) && $validated['is_default']) {
            $product->variations()->where('id', '!=', $variation->id)->update(['is_default' => false]);
        }

        $variation->update($validated);

        return response()->json([
            'message' => 'Variation updated successfully',
            'data' => $variation->fresh()
        ]);
    }

    /**
     * Delete a product variation.
     */
    public function destroyVariation(Product $product, ProductVariation $variation)
    {
        if ($variation->is_default && $product->variations()->count() > 1) {
            return response()->json([
                'message' => 'Cannot delete default variation. Please set another variation as default first.'
            ], 422);
        }

        $variation->delete();

        return response()->json([
            'message' => 'Variation deleted successfully'
        ]);
    }

    /**
     * Set a variation as default.
     */
    public function setDefaultVariation(Product $product, ProductVariation $variation)
    {
        $product->variations()->update(['is_default' => false]);
        $variation->update(['is_default' => true]);

        return response()->json([
            'message' => 'Default variation updated successfully',
            'data' => $variation->fresh()
        ]);
    }

    /**
     * Get price history for a product or variation.
     */
    public function priceHistory(Request $request, string $type, string $id)
    {
        $model = $type === 'product' ? Product::findOrFail($id) : ProductVariation::findOrFail($id);
        
        $history = $model->priceHistory()
            ->latest()
            ->paginate(10);

        return response()->json([
            'data' => $history,
            'type' => $type,
            'id' => $id
        ]);
    }
}
