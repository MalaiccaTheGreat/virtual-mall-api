<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;

class SearchController extends Controller
{
    /**
     * Handle the search query.
     */
    public function __invoke(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:1',
        ]);

        $results = Product::search($request->input('query'))
            ->query(fn ($query) => $query->where('price', '>', 50))
            ->paginate(10); // Paginate results for better performance

        return ProductResource::collection($results);
    }
}
