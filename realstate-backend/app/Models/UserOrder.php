<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserOrder extends Model
{
    protected $fillable = [
        'user_id',
        'property_id',
        'amount',
        'status',
        'order_type',
        'notes',
        'payment_details',
        'completed_at'
    ];

    protected $casts = [
        'payment_details' => 'array',
        'completed_at' => 'datetime',
        'amount' => 'decimal:2'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class, 'property_id', 'pid');
    }
}
