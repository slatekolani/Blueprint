<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Service extends Model
{
    use HasUuid;

    protected $guarded = [];

    protected $appends = [
        'price',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function servicePrice(): HasOne
    {
        return $this->hasOne(ServicePrice::class);
    }

    public function getPriceAttribute(): string
    {
        if ($this->relationLoaded('servicePrice')) {
            return $this->servicePrice?->price ?: 'Price on request';
        }

        return $this->servicePrice()->value('price') ?: 'Price on request';
    }
}
