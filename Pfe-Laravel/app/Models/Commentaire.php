<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commentaire extends Model
{
    protected $fillable = [
        'auteur_nom', 
        'pays',
        'contenu', 
        'note', 
        'date_pub', 
        'likes', 
        'user_id',
        'service_type',
        'service_id'
    ];
}
