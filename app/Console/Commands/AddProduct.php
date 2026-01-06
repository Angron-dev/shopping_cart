<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;

class add_products extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:add_products';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Creates 10 sample products using Product factory';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Creating products...');

        Product::factory(10)->create();

        $this->info('Products have been successfully created.');

        return Command::SUCCESS;
    }
}
