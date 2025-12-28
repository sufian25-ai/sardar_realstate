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
        'user_id',
        'property_id',
        'rent_id',
        'amount_paid',
        'remaining_amount',
        'property_price',
        'installment_amount',
        'interest_rate',
        'amount_with_interest',
        'discount',
        'payment_method',
        'transaction_id',
        'payment_details',
        'payment_date',
        'status',
        'installment_number',
        'notes',
        'admin_notes',
        'approved_by'
    ];

    protected $casts = [
        'amount_paid' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
        'property_price' => 'decimal:2',
        'installment_amount' => 'decimal:2',
        'amount_with_interest' => 'decimal:2',
        'discount' => 'decimal:2',
        'payment_date' => 'datetime'
    ];

    // Relationships
    public function property()
    {
        return $this->belongsTo(Property::class, 'property_id', 'pid');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function rent()
    {
        return $this->belongsTo(Rent::class, 'rent_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeProcessing($query)
    {
        return $query->where('status', 'processing');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
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

    public function isCompleted()
    {
        return $this->status === 'completed';
    }

    public function isProcessing()
    {
        return $this->status === 'processing';
    }

    public function markAsProcessing()
    {
        $this->update([
            'status' => 'processing'
        ]);
    }

    public function markAsCompleted()
    {
        $this->update(['status' => 'completed']);
        return $this;
    }

    public function markAsApproved()
    {
        $this->update(['status' => 'completed']);
        return $this;
    }

    /**
     * Calculate total paid amount for this property by this user
     */
    public function getTotalPaidForProperty()
    {
        return static::where('property_id', $this->property_id)
            ->where('user_id', $this->user_id)
            ->where('status', 'completed')
            ->sum('amount_paid');
    }

    /**
     * Calculate remaining amount for this property
     */
    public function calculateRemainingAmount()
    {
        $totalPaid = $this->getTotalPaidForProperty();
        return max(0, $this->property_price - $totalPaid);
    }

    /**
     * Get payment progress percentage
     */
    public function getPaymentProgressAttribute()
    {
        if ($this->property_price <= 0) return 0;
        
        $totalPaid = $this->getTotalPaidForProperty();
        return min(100, ($totalPaid / $this->property_price) * 100);
    }

    /**
     * Check if property is fully paid
     */
    public function isFullyPaid()
    {
        return $this->calculateRemainingAmount() <= 0;
    }

    /**
     * Get payment status text
     */
    public function getPaymentStatusTextAttribute()
    {
        if ($this->isFullyPaid()) {
            return 'Fully Paid';
        }
        
        $progress = $this->payment_progress;
        if ($progress == 0) return 'Not Started';
        if ($progress < 25) return 'Just Started';
        if ($progress < 50) return 'In Progress';
        if ($progress < 75) return 'More than Half';
        if ($progress < 100) return 'Almost Complete';
        
        return 'Completed';
    }
}
