<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stade extends Model
{
    protected $fillable = ['nom', 'image_url', 'adresse', 'contact', 'capacite', 'likes', 'ville_id'];

    public function ville()
    {
        return $this->belongsTo(Ville::class);
    }
}
