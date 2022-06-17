<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuids;

class BreakoutRoom extends Model
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
        'participants'
    ];

    protected $casts = [
        'participants' => 'array',
    ];

    public function video_room()
    {
        return $this->belongsTo(VideoRoom::class);
    }
}