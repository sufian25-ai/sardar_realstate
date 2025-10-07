<?php
// app/Models/RentPayment.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RentPayment extends Model
{
    use HasFactory;

    protected $table = 'rent_payments';

    protected $fillable = [
        'rent_id',
        'property_id',
        'user_id',
        'amount_paid',
        'cumulative_amount',
        'due_amount',
        'transaction_id',
        'payment_method',
        'payment_notes',
        'installment_number',
        'due_date',
        'payment_date',
        'status',
        'type'
    ];

    protected $casts = [
        'amount_paid' => 'decimal:2',
        'cumulative_amount' => 'decimal:2',
        'due_amount' => 'decimal:2',
        'due_date' => 'date',
        'payment_date' => 'date'
    ];

    // Relationships
    public function rent()
    {
        return $this->belongsTo(Rent::class, 'rent_id');
    }

    public function property()
    {
        return $this->belongsTo(Property::class, 'property_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Scopes
    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'overdue');
    }

    public function scopeByRent($query, $rentId)
    {
        return $query->where('rent_id', $rentId);
    }

    public function scopeByInstallmentNumber($query, $number)
    {
        return $query->where('installment_number', $number);
    }

    // Helper methods
    public function getFormattedAmountPaidAttribute()
    {
        return '৳ ' . number_format($this->amount_paid, 2);
    }

    public function getFormattedCumulativeAmountAttribute()
    {
        return '৳ ' . number_format($this->cumulative_amount, 2);
    }

    public function isPaid()
    {
        return $this->status === 'paid';
    }

    public function isOverdue()
    {
        return $this->status === 'overdue' || ($this->due_date < now() && $this->status === 'pending');
    }

    public function markAsPaid()
    {
        $this->update([
            'status' => 'paid',
            'payment_date' => now()
        ]);
    }

    public function markAsOverdue()
    {
        $this->update([
            'status' => 'overdue'
        ]);
    }
}
