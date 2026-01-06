<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Mail\LowStockMail;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpFoundation\Response;

class TransactionController extends Controller
{
    public function purchase(TransactionRequest $request): Response
    {
        $cart = $request->validated()['cart'];
        $userId = $cart[0]['user_id'];

        $user = User::lockForUpdate()->findOrFail($userId);

        DB::transaction(function () use ($cart, $user) {

            $totalCost = 0;

            foreach ($cart as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                if ($product->stock_quantity < $item['amount']) {
                    throw new \RuntimeException(
                        "Not enough stock for product {$product->id}"
                    );
                }

                $totalCost += $product->price * $item['amount'];
            }

            if ($user->balance < $totalCost) {
                throw new \RuntimeException('Insufficient user balance');
            }

            foreach ($cart as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                Transaction::create([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'amount' => $item['amount'],
                ]);

                $product->decrement('stock_quantity', $item['amount']);

                if ($product->stock_quantity < 5) {
                    $notifyEmail = config('mail.admin_mail');

                    if ($notifyEmail) {
                        Mail::to($notifyEmail)->send(new LowStockMail($product));
                    }
                }
            }

            $user->decrement('balance', $totalCost);
        });

        return response()->json([
            'message' => 'Purchase completed successfully',
            'balance' => $user->balance,
        ], Response::HTTP_CREATED);
    }
}
