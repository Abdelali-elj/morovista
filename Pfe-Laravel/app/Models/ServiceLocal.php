<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceLocal extends Model
{
    protected $fillable = ['nom', 'type', 'ville_id', 'adresse', 'telephone', 'proprietaire', 'details', 'image_url', 'addedBy', 'status'];

    public function ville()
    {
        return $this->belongsTo(Ville::class);
    }
}
