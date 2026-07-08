<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Restaurant extends Model {
    protected $fillable = ['nom', 'photo_url', 'adresse', 'contact', 'email', 'prix_moyen', 'categorie', 'likes', 'ville_id'];
    public function ville() { return $this->belongsTo(Ville::class); }
    public function commentaires() {
        return $this->hasMany(Commentaire::class, 'service_id')->where('service_type', 'restaurant');
    }
}
