<?php
// app/Models/Payment.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payments';

    protected $fillable = [
        'property_id',
        'user_id',
        'rent_id',
        'amount_paid',
        'remaining_amount',
        'property_price',
        'installment_amount',
        'interest_rate',
        'amount_with_interest',
        'discount',
        'transaction_id',
        'payment_method',
        'payment_details',
        'status',
        'payment_date',
        'approved_at'
    ];

    protected $casts = [
        'amount_paid' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
        'property_price' => 'decimal:2',
        'installment_amount' => 'decimal:2',
        'amount_with_interest' => 'decimal:2',
        'discount' => 'decimal:2',
        'payment_date' => 'datetime',
        'approved_at' => 'datetime'
    ];

    // Relationships
    public function property()
    {
        return $this->belongsTo(Property::class, 'property_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function rent()
    {
        return $this->belongsTo(Rent::class, 'rent_id');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByProperty($query, $propertyId)
    {
        return $query->where('property_id', $propertyId);
    }

    // Helper methods
    public function getFormattedAmountPaidAttribute()
    {
        return '৳ ' . number_format($this->amount_paid, 2);
    }

    public function getFormattedRemainingAmountAttribute()
    {
        return '৳ ' . number_format($this->remaining_amount, 2);
    }

    public function isApproved()
    {
        return $this->status === 'approved';
    }

    public function markAsApproved()
    {
        $this->update([
            'status' => 'approved',
            'approved_at' => now()
        ]);
    }
}
