<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'file_url',
        'performance_indicators',
        'start_date',
        'end_date',
        'format',
        'user_id'
    ];

    protected $casts = [
        'date' => 'start_date',
        'date' => 'end_date',
        'performance_indicators' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
