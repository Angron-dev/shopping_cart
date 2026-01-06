<?php

declare(strict_types=1);

namespace App\Repository;

use App\Models\Product;
use Illuminate\Support\Collection;

class EloquentProductReadRepository implements ProductReadRepository
{
    public function getAllProducts(): Collection
    {
        return Product::where('stock_quantity', '>', 0)->get();
    }
}
