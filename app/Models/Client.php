<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasUuid;

    protected $guarded = [];

    protected $casts = [
        'is_published' => 'boolean',
    ];
}
