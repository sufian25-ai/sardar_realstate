<?php
// app/Models/State.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class State extends Model
{
    use HasFactory;

    protected $table = 'states';
    protected $primaryKey = 'sid';

    protected $fillable = [
        'sname',
        'slug',
        'is_active'
    ];

    public function cities()
    {
        return $this->hasMany(City::class, 'state_id');
    }

    public function properties()
    {
        return $this->hasMany(Property::class, 'state_id');
    }

    public function activeCities()
    {
        return $this->hasMany(City::class, 'state_id')->where('is_active', true);
    }

    // Scope for active states
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
