<?php

declare(strict_types=1);

namespace App\Repository;

use Illuminate\Support\Collection;

interface ProductReadRepository
{
    public function getAllProducts(): Collection;
}
