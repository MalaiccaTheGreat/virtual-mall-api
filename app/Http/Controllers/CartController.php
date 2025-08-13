<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\CartItem;
use Illuminate\Http\JsonResponse;

class CartController extends Controller
{
    public function addToCart(Product $product)
    {
        $cart = Cart::firstOrCreate([
            'session_id' => session()->getId()
        ]);

        $cart->items()->updateOrCreate(
            ['product_id' => $product->id],
            ['quantity' => DB::raw('quantity + 1')]
        );

        return back()->with('success', 'Item added to cart!');
    }

    public function viewCart()
    {
        $cart = Cart::with('items.product')
            ->where('session_id', session()->getId())
            ->first();

        return Inertia::render('Cart', [
            'cart' => $cart
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $cart = $request->user()->cart;
        
        if (!$cart) {
            $cart = Cart::create(['user_id' => $request->user()->id]);
        }

        return response()->json($cart->load('items'));
    }

    public function add(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|string',
            'name' => 'required|string',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'attributes' => 'nullable|array',
        ]);

        $cart = $request->user()->cart;
        
        if (!$cart) {
            $cart = Cart::create(['user_id' => $request->user()->id]);
        }

        $existingItem = $cart->items()
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingItem) {
            $existingItem->update([
                'quantity' => $existingItem->quantity + $request->quantity,
            ]);
        } else {
            $cart->items()->create($request->all());
        }

        return response()->json($cart->load('items'));
    }

    public function remove(Request $request, $itemId): JsonResponse
    {
        $cart = $request->user()->cart;
        
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }

        $item = $cart->items()->find($itemId);
        
        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $item->delete();

        return response()->json($cart->load('items'));
    }

    public function clear(Request $request): JsonResponse
    {
        $cart = $request->user()->cart;
        
        if ($cart) {
            $cart->items()->delete();
        }

        return response()->json(['message' => 'Cart cleared successfully']);
    }

    public function updateQuantity(Request $request, $itemId): JsonResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $request->user()->cart;
        
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }

        $item = $cart->items()->find($itemId);
        
        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $item->update([
            'quantity' => $request->quantity,
        ]);

        return response()->json($cart->load('items'));
    }
<<<<<<< HEAD

    public function addMultiple(Request $request): JsonResponse
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $cart = $request->user()->cart;

        if (!$cart) {
            $cart = Cart::create(['user_id' => $request->user()->id]);
        }

        foreach ($request->items as $item) {
            $existingItem = $cart->items()
                ->where('product_id', $item['id'])
                ->first();

            if ($existingItem) {
                $existingItem->update([
                    'quantity' => $existingItem->quantity + $item['quantity'],
                ]);
            } else {
                $cart->items()->create([
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'name' => $item['name'],
                    'price' => $item['price'],
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'items_added' => count($request->items),
            'cart' => $cart->load('items')
        ]);
    }
=======
>>>>>>> 45a42bb6b8f003179c57eadf18b2f7ae496b5430
}
