<?php
// app/Models/Feedback.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    protected $table = 'feedbacks';
    protected $primaryKey = 'fid';

    protected $fillable = [
        'user_id',
        'property_id',
        'description',
        'rating',
        'is_approved',
        'is_featured',
        'is_verified',
        'admin_notes',
        'approved_by',
        'approved_at',
        'date'
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_approved' => 'boolean',
        'is_featured' => 'boolean',
        'is_verified' => 'boolean',
        'approved_at' => 'datetime',
        'date' => 'datetime'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function property()
    {
        return $this->belongsTo(Property::class, 'property_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeByRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }

    public function scopeByProperty($query, $propertyId)
    {
        return $query->where('property_id', $propertyId);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    // Helper methods
    public function getStarRatingAttribute()
    {
        return str_repeat('⭐', $this->rating);
    }

    public function isApproved()
    {
        return $this->is_approved;
    }

    public function isFeatured()
    {
        return $this->is_featured;
    }

    public function approve()
    {
        $this->update([
            'is_approved' => true,
            'approved_at' => now()
        ]);
    }

    public function feature()
    {
        $this->update([
            'is_featured' => true
        ]);
    }

    public function unfeature()
    {
        $this->update([
            'is_featured' => false
        ]);
    }
}
