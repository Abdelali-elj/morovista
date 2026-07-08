<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transport extends Model
{
    protected $fillable = ['type_vehicule', 'photo_url', 'description', 'lien'];
}
