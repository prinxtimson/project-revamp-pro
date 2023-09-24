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
        'status' 
    ];
}
