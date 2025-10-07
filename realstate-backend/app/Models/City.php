<?php
// app/Models/City.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

    protected $table = 'cities';
    protected $primaryKey = 'cid';

    protected $fillable = [
        'cname',
        'slug',
        'state_id',
        'is_active'
    ];

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    public function properties()
    {
        return $this->hasMany(Property::class, 'city_id');
    }

    // Scope for active cities
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByState($query, $stateId)
    {
        return $query->where('state_id', $stateId);
    }
}
