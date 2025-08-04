<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Stores/Index', [
            'stores' => Store::paginate(10)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Stores/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:1024',
        ]);

        $store = Store::create($validated);

        if ($request->hasFile('logo')) {
            // I will need to add media library support to the Store model
            // For now, I will just store the path
            $path = $request->file('logo')->store('logos', 'public');
            $store->update(['logo' => $path]);
        }

        return redirect()->route('admin.stores.index')->with('success', 'Store created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Store $store)
    {
        return Inertia::render('Stores/Show', [
            'store' => $store->load('products')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Store $store)
    {
        return Inertia::render('Admin/Stores/Edit', [
            'store' => $store
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Store $store)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:1024',
        ]);

        $store->update($validated);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            $store->update(['logo' => $path]);
        }

        return redirect()->route('admin.stores.index')->with('success', 'Store updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Store $store)
    {
        $store->delete();

        return redirect()->route('admin.stores.index')->with('success', 'Store deleted successfully.');
    }
}
