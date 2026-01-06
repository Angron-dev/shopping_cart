<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $cart = CartItem::with('product')
            ->where('user_id', Auth::id())
            ->get();

        return response()->json($cart);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'amount' => 'required|integer|min:1',
        ]);

        $cartItem = CartItem::updateOrCreate(
            ['user_id' => Auth::id(), 'product_id' => $data['product_id']],
            ['amount' => $data['amount']]
        );

        return response()->json($cartItem);
    }

    public function remove($productId)
    {
        CartItem::where('user_id', auth()->id())
            ->where('product_id', $productId)
            ->delete();

        return response()->json(['message' => 'Removed']);
    }
}

