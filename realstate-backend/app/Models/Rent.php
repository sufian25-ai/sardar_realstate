<?php
// app/Models/Rent.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rent extends Model
{
    use HasFactory;

    protected $table = 'rents';
    protected $primaryKey = 'rid';

    protected $fillable = [
        'applicant_name',
        'applicant_email',
        'applicant_phone',
        'applicant_message',
        'property_id',
        'property_type',
        'property_title',
        'property_price',
        'installment_amount',
        'user_id',
        'applicant_user_id',
        'agent_name',
        'agent_email',
        'duration_months',
        'status',
        'admin_notes',
        'application_date',
        'approved_at',
        'completed_at'
    ];

    protected $casts = [
        'property_price' => 'decimal:2',
        'installment_amount' => 'decimal:2',
        'application_date' => 'datetime',
        'approved_at' => 'datetime',
        'completed_at' => 'datetime'
    ];

    // Relationships
    public function property()
    {
        return $this->belongsTo(Property::class, 'property_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id'); // Property owner/agent
    }

    public function applicant()
    {
        return $this->belongsTo(User::class, 'applicant_user_id'); // Applicant
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'rent_id');
    }

    public function rentPayments()
    {
        return $this->hasMany(RentPayment::class, 'rent_id');
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

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeByApplicant($query, $userId)
    {
        return $query->where('applicant_user_id', $userId);
    }

    public function scopeByAgent($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForSale($query)
    {
        return $query->where('property_type', 'sale');
    }

    public function scopeForRent($query)
    {
        return $query->where('property_type', 'rent');
    }

    // Helper methods
    public function getFormattedPropertyPriceAttribute()
    {
        return '৳ ' . number_format($this->property_price, 2);
    }

    public function getFormattedInstallmentAmountAttribute()
    {
        return '৳ ' . number_format($this->installment_amount, 2);
    }

    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isApproved()
    {
        return $this->status === 'approved';
    }

    public function approve()
    {
        $this->update([
            'status' => 'approved',
            'approved_at' => now()
        ]);
    }

    public function reject()
    {
        $this->update([
            'status' => 'rejected'
        ]);
    }

    public function complete()
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now()
        ]);
    }
}
