<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanTour extends Model
{
    protected $fillable = ['titre', 'image_url', 'prix', 'duree', 'status', 'addedBy', 'ville_id', 'user_id'];

    public function ville()
    {
        return $this->belongsTo(Ville::class);
    }
}
