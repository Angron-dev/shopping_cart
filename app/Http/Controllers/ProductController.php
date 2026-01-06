<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Repository\ProductReadRepository;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    private ProductReadRepository $productReadRepository;

    public function __construct(ProductReadRepository $productReadRepository)
    {
        $this->productReadRepository = $productReadRepository;
    }

    public function list(): JsonResponse
    {
       return response()->json($this->productReadRepository->getAllProducts());
    }
}
