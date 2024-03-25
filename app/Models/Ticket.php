<?php

namespace App\Models;

use App\Traits\UniqueID;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory, UniqueID;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'query_type',
        'description',
        'priority',
        'status',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ticket_comments()
    {
        return $this->hasMany(TicketComment::class)->with('user');
    }
}
