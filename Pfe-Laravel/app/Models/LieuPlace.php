<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LieuPlace extends Model
{
    protected $fillable = ['nom', 'image_url', 'description', 'likes', 'ville_id'];

    public function ville()
    {
        return $this->belongsTo(Ville::class);
    }
}
