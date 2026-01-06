<?php

namespace App\Providers;

use App\Repository\EloquentProductReadRepository;
use App\Repository\ProductReadRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public $singletons = [
        ProductReadRepository::class => EloquentProductReadRepository::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
