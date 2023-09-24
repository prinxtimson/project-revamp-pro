<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait UniqueID
{   /**
     * Boot function from Laravel.
     */
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->ticket_id)) {
                $model->ticket_id = strtoupper(uniqid('TS-'));
            }
        });
    }  
}