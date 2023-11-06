<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PerformanceTracking extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'method',
        'target_value'
    ];
}
