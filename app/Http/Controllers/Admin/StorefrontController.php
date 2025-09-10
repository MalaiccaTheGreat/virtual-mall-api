<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Storefront;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class StorefrontController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'admin']);
    }

    public function index()
    {
        $storefronts = Storefront::withCount('products')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Storefronts/Index', [
            'storefronts' => $storefronts,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Storefronts/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:storefronts,slug',
            'description' => 'nullable|string',
            'logo_url' => 'nullable|url',
            'banner_url' => 'nullable|url',
            'primary_color' => 'nullable|string',
            'secondary_color' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $storefront = Storefront::create($validated);

        return redirect()
            ->route('admin.storefronts.edit', $storefront)
            ->with('success', 'Storefront created successfully');
    }

    public function edit(Storefront $storefront)
    {
        return Inertia::render('Admin/Storefronts/Edit', [
            'storefront' => $storefront->load('products'),
        ]);
    }

    public function update(Request $request, Storefront $storefront)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:storefronts,slug,' . $storefront->id,
            'description' => 'nullable|string',
            'logo_url' => 'nullable|url',
            'banner_url' => 'nullable|url',
            'primary_color' => 'nullable|string',
            'secondary_color' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $storefront->update($validated);

        return back()->with('success', 'Storefront updated successfully');
    }

    public function destroy(Storefront $storefront)
    {
        $storefront->delete();

        return redirect()
            ->route('admin.storefronts.index')
            ->with('success', 'Storefront deleted successfully');
    }
}
