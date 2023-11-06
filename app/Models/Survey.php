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
        'support_type',
        'user_id',
        'support_id'
    ];

    protected $casts = [
        'data' => 'array',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}