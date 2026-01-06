<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Mail\LowStockMail;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpFoundation\Response;

class TransactionController extends Controller
{
    public function purchase(TransactionRequest $request): Response
    {
        DB::transaction(function () use ($request) {
            foreach ($request['cart'] as $item) {
                $product = Product::lockForUpdate()->find($item['product_id']);

                if ($product->stock_quantity < $item['amount']) {
                    throw new \RuntimeException(
                        "Not enough stock for product {$product->id}"
                    );
                }

                Transaction::create([
                    'user_id'    => $item['user_id'],
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
        });

        return response()->json([
            'message' => 'Purchase completed successfully',
        ], Response::HTTP_CREATED);
    }
}
