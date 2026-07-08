<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MyPlan extends Model
{
    protected $table = 'my_plans';
    
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'userId',
        'userName',
        'city',
        'duration',
        'totalBudget',
        'tier',
        'tagline',
        'image',
        'dayPlans',
        'vibe'
    ];

    protected $casts = [
        'dayPlans' => 'array',
    ];
}
