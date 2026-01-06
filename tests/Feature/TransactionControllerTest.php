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

        $user = User::factory()->create(['balance' => 100]);
        $product = Product::factory()->create(['stock_quantity' => 10, 'price' => 20]);

        $cart = [
            [
                'product_id' => $product->id,
                'amount' => 2,
                'user_id' => $user->id
            ]
        ];

        $response = $this->actingAs($user)->postJson(self::API_ENDPOINT, ['cart' => $cart]);

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

        $this->assertEquals(60, $user->fresh()->balance);

        $this->assertDatabaseMissing('cart_items', [
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);

        Mail::assertNothingSent();
    }

    public function test_low_stock_triggers_mail()
    {
        Mail::fake();

        $user = User::factory()->create(['balance' => 100]);
        $product = Product::factory()->create(['stock_quantity' => 5, 'price' => 20]);

        $cart = [
            ['product_id' => $product->id, 'amount' => 1, 'user_id' => $user->id]
        ];

        $response = $this->actingAs($user)->postJson(self::API_ENDPOINT, ['cart' => $cart]);

        $response->assertStatus(201);

        Mail::assertSent(LowStockMail::class, function ($mail) use ($product) {
            return $mail->product->id === $product->id;
        });
    }

    public function test_purchase_fails_when_stock_insufficient()
    {
        $user = User::factory()->create(['balance' => 100]);
        $product = Product::factory()->create(['stock_quantity' => 1, 'price' => 20]);

        $cart = [
            ['product_id' => $product->id, 'amount' => 2, 'user_id' => $user->id]
        ];

        $response = $this->actingAs($user)->postJson(self::API_ENDPOINT, ['cart' => $cart]);

        $response->assertStatus(500)
            ->assertJson([
                'message' => "Not enough stock for product {$product->id}"
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock_quantity' => 1
        ]);

        $this->assertDatabaseMissing('transactions', [
            'user_id' => $user->id,
            'product_id' => $product->id
        ]);
    }

    public function test_purchase_requires_valid_cart()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->postJson(self::API_ENDPOINT, ['cart' => []]);
        $response->assertStatus(422);
    }

    public function test_purchase_fails_if_balance_is_insufficient()
    {
        Mail::fake();

        $user = User::factory()->create(['balance' => 10]);
        $product = Product::factory()->create(['price' => 20, 'stock_quantity' => 10]);

        $cart = [
            ['product_id' => $product->id, 'amount' => 1, 'user_id' => $user->id],
        ];

        $response = $this->actingAs($user)->postJson(self::API_ENDPOINT, ['cart' => $cart]);

        $response->assertStatus(500)
            ->assertJson([
                'message' => 'Insufficient user balance'
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock_quantity' => 10
        ]);

        $this->assertDatabaseMissing('transactions', [
            'user_id' => $user->id,
            'product_id' => $product->id
        ]);

        $this->assertEquals(10, $user->fresh()->balance);
    }

}
