<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Mail\LowStockMail;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class TransactionControllerTest extends TestCase
{
    use RefreshDatabase;

    const API_ENDPOINT = '/api/transactions';

    public function test_purchase_success()
    {
        Mail::fake();

        $user = User::factory()->create();
        $product = Product::factory()->create(['stock_quantity' => 10]);

        $cart = [
            [
                'product_id' => $product->id,
                'amount' => 2,
                'user_id' => $user->id
            ]
        ];

        $response = $this->postJson(self::API_ENDPOINT, ['cart' => $cart]);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Purchase completed successfully']);

        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'product_id' => $product->id,
            'amount' => 2
        ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock_quantity' => 8
        ]);

        Mail::assertNothingSent();
    }
    public function test_low_stock_triggers_mail()
    {
        Mail::fake();

        $user = User::factory()->create();
        $product = Product::factory()->create(['stock_quantity' => 5]);

        $cart = [
            ['product_id' => $product->id, 'amount' => 1, 'user_id' => $user->id]
        ];

        $response = $this->postJson(self::API_ENDPOINT, ['cart' => $cart]);

        $response->assertStatus(201);
        Mail::assertSent(LowStockMail::class);
    }

    public function test_purchase_fails_when_stock_insufficient()
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock_quantity' => 1]);

        $cart = [
            ['product_id' => $product->id, 'amount' => 2, 'user_id' => $user->id]
        ];

        $response = $this->postJson(self::API_ENDPOINT, ['cart' => $cart]);

        $response->assertStatus(500);
    }

    public function test_purchase_requires_valid_cart()
    {
        $response = $this->postJson(self::API_ENDPOINT, ['cart' => []]);
        $response->assertStatus(422);
    }

}
