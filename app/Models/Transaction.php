<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
        'amount',
    ];

    public function user()
    {
        return $this->belongsTo(User::class)
            ->select('id', 'name', 'email');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
