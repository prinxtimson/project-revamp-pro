<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    use HasFactory;

    protected $fillable = [
        'data',
    ];

    protected $casts = [
        'data' => 'array',
    ];

    public function livecall()
    {
        return $this->belongsTo(LiveCall::class);
    }
}