<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\TryOnSession;
use App\Models\TryOnItem;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class VirtualTryOnController extends Controller
{
    public function index()
    {
        $tryOnProducts = Product::where('is_try_on_enabled', true)
            ->with(['images', 'features'])
            ->get();

        return Inertia::render('VirtualTryOn', [
            'products' => $tryOnProducts
        ]);
    }

    public function createSession(Request $request)
    {
        $request->validate([
            'model_type' => 'required|in:3d_model,user_photo',
            'user_photo' => 'nullable|image|max:10240',
            'body_measurements' => 'nullable|array',
            'body_measurements.height' => 'nullable|numeric',
            'body_measurements.weight' => 'nullable|numeric',
            'body_measurements.chest' => 'nullable|numeric',
            'body_measurements.waist' => 'nullable|numeric',
            'body_measurements.hips' => 'nullable|numeric',
            'body_measurements.shoe_size' => 'nullable|numeric',
        ]);

        $sessionData = [
            'user_id' => Auth::id(),
            'session_id' => $request->session()->getId(),
            'model_type' => $request->model_type,
            'body_measurements' => $request->body_measurements,
            'is_active' => true
        ];

        if ($request->hasFile('user_photo')) {
            $path = $request->file('user_photo')->store('try-on-photos', 'public');
            $sessionData['user_photo_path'] = $path;
        }

        $session = TryOnSession::create($sessionData);

        return response()->json([
            'success' => true,
            'session_id' => $session->id,
            'message' => 'Try-on session created successfully'
        ]);
    }

    public function addItem(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:try_on_sessions,id',
            'product_id' => 'required|exists:products,id',
            'clothing_category' => 'required|string',
            'size' => 'nullable|string',
            'color_variant' => 'nullable|string',
            'position_data' => 'nullable|array'
        ]);

        $session = TryOnSession::findOrFail($request->session_id);
        $product = Product::findOrFail($request->product_id);

        // Remove existing item of same category if replacing
        if ($request->clothing_category !== 'accessories') {
            $session->tryOnItems()
                ->where('clothing_category', $request->clothing_category)
                ->delete();
        }

        $tryOnItem = TryOnItem::create([
            'try_on_session_id' => $session->id,
            'product_id' => $product->id,
            'clothing_category' => $request->clothing_category,
            'size' => $request->size,
            'color_variant' => $request->color_variant,
            'position_data' => $request->position_data
        ]);

        return response()->json([
            'success' => true,
            'item' => $tryOnItem->load('product'),
            'message' => 'Item added to try-on session'
        ]);
    }

    public function removeItem(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:try_on_sessions,id',
            'item_id' => 'required|exists:try_on_items,id'
        ]);

        $session = TryOnSession::findOrFail($request->session_id);
        $item = $session->tryOnItems()->findOrFail($request->item_id);
        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item removed from try-on session'
        ]);
    }

    public function addAllToCart(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:try_on_sessions,id'
        ]);

        $session = TryOnSession::with('tryOnItems.product')->findOrFail($request->session_id);

        // Get or create cart
        $cart = Cart::firstOrCreate([
            'user_id' => Auth::id() ?? null,
            'session_id' => $request->session()->getId()
        ]);

        $addedItems = [];
        foreach ($session->tryOnItems as $tryOnItem) {
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $tryOnItem->product_id,
                'name' => $tryOnItem->product->name,
                'price' => $tryOnItem->product->price,
                'quantity' => 1,
                'attributes' => [
                    'size' => $tryOnItem->size,
                    'color_variant' => $tryOnItem->color_variant,
                    'from_try_on' => true
                ]
            ]);
            $addedItems[] = $cartItem;
        }

        return response()->json([
            'success' => true,
            'items_added' => count($addedItems),
            'message' => 'All try-on items added to cart successfully'
        ]);
    }

    public function getSession(Request $request, $sessionId)
    {
        $session = TryOnSession::with(['tryOnItems.product.images'])
            ->findOrFail($sessionId);

        return response()->json([
            'session' => $session
        ]);
    }
}