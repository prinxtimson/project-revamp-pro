<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiveCall extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'query_type',
        'left_at',
        'answered_at',
    ];

    protected $casts = [
        'left_at' => 'datetime',
        'answered_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }
}