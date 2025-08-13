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
<<<<<<< HEAD
        return Inertia::render('Admin/Products/Index', [
            'products' => Product::with('store')->paginate(10)
        ]);
=======
        //
>>>>>>> 45a42bb6b8f003179c57eadf18b2f7ae496b5430
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
<<<<<<< HEAD
        return Inertia::render('Admin/Products/Create', [
            'stores' => Store::all(['id', 'name'])
        ]);
=======
        //
>>>>>>> 45a42bb6b8f003179c57eadf18b2f7ae496b5430
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
<<<<<<< HEAD
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
=======
        //
>>>>>>> 45a42bb6b8f003179c57eadf18b2f7ae496b5430
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
<<<<<<< HEAD
    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'stores' => Store::all(['id', 'name'])
        ]);
=======
    public function edit(string $id)
    {
        //
>>>>>>> 45a42bb6b8f003179c57eadf18b2f7ae496b5430
    }

    /**
     * Update the specified resource in storage.
     */
<<<<<<< HEAD
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
=======
    public function update(Request $request, string $id)
    {
        //
>>>>>>> 45a42bb6b8f003179c57eadf18b2f7ae496b5430
    }

    /**
     * Remove the specified resource from storage.
     */
<<<<<<< HEAD
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
=======
    public function destroy(string $id)
    {
        //
>>>>>>> 45a42bb6b8f003179c57eadf18b2f7ae496b5430
    }
}
