<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CallBack extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'query_type',
        'time',
        'date',
        'called_at',
        'status',
        'agent_id'
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }
}