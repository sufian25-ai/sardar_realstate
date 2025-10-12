<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProperty extends Model
{
    protected $fillable = [
        'user_id',
        'property_id',
        'ownership_type',
        'purchase_price',
        'purchase_date',
        'lease_start_date',
        'lease_end_date',
        'monthly_rent',
        'ownership_notes',
        'documents'
    ];

    protected $casts = [
        'documents' => 'array',
        'purchase_date' => 'date',
        'lease_start_date' => 'date',
        'lease_end_date' => 'date',
        'purchase_price' => 'decimal:2',
        'monthly_rent' => 'decimal:2'
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
