<?php

namespace App\Mail;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class LowStockMail extends Mailable
{
    use Queueable, SerializesModels;

    public Product $product;

    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    public function build()
    {
        return $this->subject('Low Stock Alert')
            ->view('emails.low_stock')
            ->with([
                'productName' => $this->product->name,
                'stock'       => $this->product->stock_quantity,
            ]);
    }
}
