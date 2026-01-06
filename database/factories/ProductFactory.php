<?php

declare(strict_types=1);

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'price' => $this->faker->numberBetween(1, 50),
        ];
    }
}
