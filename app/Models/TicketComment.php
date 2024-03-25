<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'comment',
        'name',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class)->withDefault(function ($user, $ticketComment) {
            $user->name = 'Guest Author';
        });
    }

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }
}
