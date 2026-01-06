<?php

declare(strict_types=1);

use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'api'], function (){
    Route::get('/products', [ProductController::class, 'list'])->name('api.products');
    Route::post('/transactions', [TransactionController::class, 'purchase'])->name('api.transactions');
});
