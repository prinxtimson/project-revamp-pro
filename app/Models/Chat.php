<?php

namespace App\Models;

use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Chat extends Model
{
    use HasFactory, Uuids, SoftDeletes;

    protected $fillable = [
        'name',
        'status',
        'last_message',
        'last_message_at'
    ];

    protected $casts = [
        'last_message_at' => 'datetime'
    ];

    public function messages()
    {
        return $this->hasMany(ChatMessage::class)->with('user');
    }
}
