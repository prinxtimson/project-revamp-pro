<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    use HasFactory;

    protected $fillable = [
        'data',
        'comment',
        'support_type'
    ];

    protected $casts = [
        'data' => 'array',
    ];
}