<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiveCall extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'query_type',
        'left_at',
        'answered_at',
        'canceled_at',
        'session_id',
        'agent_id',
        'ended_at'
    ];

    protected $casts = [
        'left_at' => 'datetime',
        'answered_at' => 'datetime',
        'canceled_at' => 'datetime',
        'ended_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function video_room()
    {
        return $this->hasOne(VideoRoom::class, 'live_call_id');
    }
}