<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('HomePage', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('cart', function () {
        return Inertia::render('Cart');
    })->name('cart');
});

require __DIR__.'/settings.php';
require __DIR__.'/site_api.php';
