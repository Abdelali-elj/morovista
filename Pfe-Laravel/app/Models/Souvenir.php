<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Souvenir extends Model
{
    protected $fillable = ['name', 'tag', 'category', 'origin', 'price', 'badge', 'description', 'image', 'likes'];
}
