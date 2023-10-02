<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuids;

class VideoRoom extends Model
{
    use HasFactory, Uuids;

        /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id',
        'name',
        'host',
        'co_host',
        'password',
        'live_call_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'co_host' => 'array',
    ];

    public function breakouts()
    {
        return $this->hasMany(BreakoutRoom::class);
    }

    public function livecall()
    {
        return $this->belongsTo(LiveCall::class, 'live_call_id');
    }
}