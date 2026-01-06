<?php

declare(strict_types=1);

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'api'], function (){
    Route::get('/products', [ProductController::class, 'list'])->name('api.products');
    Route::post('/transactions', [TransactionController::class, 'purchase'])->name('api.transactions');
    Route::middleware('auth')->group(function () {
        Route::group(['prefix' => 'cart'], function () {
            Route::get('/', [CartController::class, 'index'])->name('api.cart');
            Route::post('/update', [CartController::class, 'update'])->name('api.cart.update');
            Route::delete('/{product}', [CartController::class, 'remove'])->name('api.cart.remove');
        });
    });
});
