<?php
// app/Models/Property.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $table = 'properties';
    protected $primaryKey = 'pid';

    protected $fillable = [
        'title',
        'slug',
        'pcontent',
        'type',
        'stype',
        'bedroom',
        'bathroom',
        'balcony',
        'kitchen',
        'drawing_room',
        'dining_room',
        'floor',
        'totalfloor',
        'size',
        'price',
        'location',
        'city_id',
        'state_id',
        'feature',
        'pimage',
        'pimage1',
        'pimage2',
        'pimage3',
        'pimage4',
        'user_id',
        'status',
        'mapimage',
        'groundmapimage',
        'featured',
        'verified',
        'view_count',
        'date'
    ];

    protected $casts = [
        'bedroom' => 'integer',
        'bathroom' => 'integer',
        'balcony' => 'integer',
        'kitchen' => 'integer',
        'drawing_room' => 'integer',
        'dining_room' => 'integer',
        'totalfloor' => 'integer',
        'size' => 'integer',
        'price' => 'decimal:2',
        'featured' => 'boolean',
        'verified' => 'boolean',
        'view_count' => 'integer',
        'date' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function city()
    {
        return $this->belongsTo(City::class, 'city_id');
    }

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    public function rentApplications()
    {
        return $this->hasMany(Rent::class, 'pid');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'pid');
    }

    // Scopes for easier queries
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeForSale($query)
    {
        return $query->where('stype', 'sale');
    }

    public function scopeForRent($query)
    {
        return $query->where('stype', 'rent');
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeVerified($query)
    {
        return $query->where('verified', true);
    }

    public function scopeByCity($query, $cityId)
    {
        return $query->where('city_id', $cityId);
    }

    public function scopeByState($query, $stateId)
    {
        return $query->where('state_id', $stateId);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopePriceRange($query, $min, $max)
    {
        return $query->whereBetween('price', [$min, $max]);
    }

    // Helper methods
    public function incrementViewCount()
    {
        $this->view_count++;
        $this->save();
    }

    public function isAvailable()
    {
        return $this->status === 'available';
    }

    public function isForSale()
    {
        return $this->stype === 'sale';
    }

    public function isForRent()
    {
        return $this->stype === 'rent';
    }

    public function getFormattedPriceAttribute()
    {
        return '৳ ' . number_format($this->price, 2);
    }
}
