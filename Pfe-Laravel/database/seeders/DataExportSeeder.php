<?php

namespace Database\Seeders;

use App\Models\Ville;
use App\Models\Hotel;
use App\Models\Restaurant;
use App\Models\Stade;
use App\Models\LieuPlace;
use App\Models\PlanTour;
use App\Models\ServiceLocal;
use App\Models\Transport;
use App\Models\UrgencePhonen;
use App\Models\Commentaire;
use App\Models\Souvenir;
use Illuminate\Database\Seeder;

class DataExportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = database_path('data_export.json');
        $data = json_decode(file_get_contents($jsonPath), true);

        // First, create all villes
        foreach ($data['villes'] ?? [] as $ville) {
            Ville::updateOrCreate(
                ['nom' => $ville['nom']],
                [
                    'image_url' => $ville['image'] ?? $ville['image_url'] ?? null,
                ]
            );
        }

        // Hotels
        foreach ($data['hotels'] ?? [] as $hotel) {
            $ville = null;
            if (isset($hotel['ville'])) {
                $ville = Ville::firstOrCreate(['nom' => $hotel['ville']]);
            }
            Hotel::updateOrCreate(
                ['nom' => $hotel['nom']],
                [
                    'photo_url' => $hotel['photo'] ?? $hotel['photo_url'] ?? null,
                    'adresse' => $hotel['adress'] ?? $hotel['adresse'] ?? null,
                    'contact' => $hotel['contact'] ?? null,
                    'email' => $hotel['email'] ?? null,
                    'prix_chambre' => $hotel['prix_chambre'] ?? $hotel['price'] ?? null,
                    'categorie' => $hotel['categorie'] ?? null,
                    'ville_id' => $ville?->id,
                    'likes' => $hotel['likes'] ?? 0,
                ]
            );
        }

        // Restaurants
        foreach ($data['restaurants'] ?? [] as $restaurant) {
            $ville = null;
            if (isset($restaurant['ville'])) {
                $ville = Ville::firstOrCreate(['nom' => $restaurant['ville']]);
            }
            Restaurant::updateOrCreate(
                ['nom' => $restaurant['nom']],
                [
                    'photo_url' => $restaurant['photo'] ?? $restaurant['photo_url'] ?? null,
                    'adresse' => $restaurant['adress'] ?? $restaurant['adresse'] ?? null,
                    'contact' => $restaurant['contact'] ?? null,
                    'email' => $restaurant['email'] ?? null,
                    'prix_moyen' => $restaurant['prix_moyen'] ?? $restaurant['price'] ?? null,
                    'categorie' => $restaurant['categorie'] ?? $restaurant['cuisine'] ?? null,
                    'ville_id' => $ville?->id,
                    'likes' => $restaurant['likes'] ?? 0,
                ]
            );
        }

        // Stades
        foreach ($data['stades'] ?? [] as $stade) {
            $ville = null;
            if (isset($stade['ville'])) {
                $ville = Ville::firstOrCreate(['nom' => $stade['ville']]);
            }
            Stade::updateOrCreate(
                ['nom' => $stade['nom']],
                [
                    'image_url' => $stade['image'] ?? $stade['image_url'] ?? null,
                    'adresse' => $stade['adress'] ?? $stade['adresse'] ?? null,
                    'contact' => $stade['contact'] ?? null,
                    'capacite' => $stade['capacite'] ?? null,
                    'ville_id' => $ville?->id,
                    'likes' => $stade['likes'] ?? 0,
                ]
            );
        }

        // Lieux (places)
        foreach ($data['places'] ?? [] as $place) {
            $ville = null;
            if (isset($place['ville'])) {
                $ville = Ville::firstOrCreate(['nom' => $place['ville']]);
            }
            LieuPlace::updateOrCreate(
                ['nom' => $place['nom']],
                [
                    'image_url' => $place['image'] ?? $place['image_url'] ?? null,
                    'adresse' => $place['adress'] ?? $place['adresse'] ?? null,
                    'description' => $place['description'] ?? null,
                    'ville_id' => $ville?->id,
                    'likes' => $place['likes'] ?? 0,
                ]
            );
        }

        // Plans (tours)
        foreach ($data['plans'] ?? [] as $plan) {
            $ville = null;
            if (isset($plan['ville'])) {
                $ville = Ville::firstOrCreate(['nom' => $plan['ville']]);
            }
            PlanTour::updateOrCreate(
                ['titre' => $plan['titre']],
                [
                    'image_url' => $plan['image'] ?? $plan['image_url'] ?? null,
                    'prix' => $plan['prix'] ?? null,
                    'duree' => $plan['duree'] ?? null,
                    'ville_id' => $ville?->id,
                    'status' => $plan['status'] ?? 'active',
                    'addedBy' => $plan['addedBy'] ?? 'admin',
                ]
            );
        }

        // Local Services
        foreach ($data['local_services'] ?? [] as $service) {
            $ville = null;
            if (isset($service['ville'])) {
                $ville = Ville::firstOrCreate(['nom' => $service['ville']]);
            }
            ServiceLocal::updateOrCreate(
                ['nom_service' => $service['nom_service'] ?? $service['nom']],
                [
                    'type' => $service['type'] ?? null,
                    'telephone' => $service['telephone'] ?? null,
                    'adresse' => $service['adress'] ?? $service['adresse'] ?? null,
                    'ville_id' => $ville?->id,
                    'status' => $service['status'] ?? 'accepted',
                    'image_url' => $service['image'] ?? $service['image_url'] ?? null,
                ]
            );
        }

        // Transports
        foreach ($data['transports'] ?? [] as $transport) {
            Transport::updateOrCreate(
                ['type_vehicule' => $transport['type_vehicule'] ?? $transport['type']],
                [
                    'photo_url' => $transport['photo'] ?? $transport['photo_url'] ?? null,
                    'description' => $transport['description'] ?? $transport['desc'] ?? null,
                    'lien' => $transport['lien'] ?? null,
                ]
            );
        }

        // Urgence Phonens
        foreach ($data['urgence_phonens'] ?? [] as $urgence) {
            UrgencePhonen::updateOrCreate(
                ['service_nom' => $urgence['service_nom'] ?? $urgence['nom']],
                [
                    'numero' => $urgence['numero'] ?? $urgence['num'] ?? null,
                ]
            );
        }

        // Commentaires
        foreach ($data['commentaires'] ?? [] as $commentaire) {
            Commentaire::updateOrCreate(
                [
                    'auteur_nom' => $commentaire['auteur_nom'] ?? $commentaire['user'],
                    'contenu' => $commentaire['contenu'] ?? $commentaire['text'],
                ],
                [
                    'pays' => $commentaire['pays'] ?? null,
                    'note' => $commentaire['note'] ?? $commentaire['rating'] ?? 5,
                    'service_type' => $commentaire['service_type'] ?? null,
                    'service_id' => $commentaire['service_id'] ?? null,
                    'date_pub' => $commentaire['date_pub'] ?? now(),
                ]
            );
        }
    }
}
