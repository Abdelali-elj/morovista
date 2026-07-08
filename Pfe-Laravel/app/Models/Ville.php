<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ville extends Model
{
    protected $fillable = ['nom', 'image_url'];

    public function hotels() { return $this->hasMany(Hotel::class); }
    public function restaurants() { return $this->hasMany(Restaurant::class); }
    public function stades() { return $this->hasMany(Stade::class); }
    public function lieu_places() { return $this->hasMany(LieuPlace::class); }
    public function plan_tours() { return $this->hasMany(PlanTour::class); }
    public function service_locals() { return $this->hasMany(ServiceLocal::class); }
}
