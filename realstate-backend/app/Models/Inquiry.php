<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'inquiries';

    /**
     * The primary key associated with the table.
     */
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'property_id',
        'message',
        'status',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Default values for attributes.
     */
    protected $attributes = [
        'status' => 'new',
    ];

    /**
     * Get the property that owns the inquiry.
     */
    public function property()
    {
        return $this->belongsTo(Property::class, 'property_id', 'pid');
    }

    /**
     * Scope a query to only include new inquiries.
     */
    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    /**
     * Scope a query to only include reviewed inquiries.
     */
    public function scopeReviewed($query)
    {
        return $query->where('status', 'reviewed');
    }

    /**
     * Scope a query to only include converted inquiries.
     */
    public function scopeConverted($query)
    {
        return $query->where('status', 'converted');
    }
}
