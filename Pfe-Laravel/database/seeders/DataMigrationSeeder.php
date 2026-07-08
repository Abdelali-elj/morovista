<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class DataMigrationSeeder extends Seeder
{
    public function run(): void
    {
        $json = File::get(database_path('data_export.json'));
        $data = json_decode($json, true);

        // 1. Users
        foreach ($data['utilisateurs'] ?? [] as $user) {
            DB::table('users')->updateOrInsert(
                ['firebase_uid' => $user['id']],
                [
                    'name' => $user['name'] ?? $user['email'],
                    'email' => $user['email'],
                    'role' => $user['userType'] ?? 'visitor',
                    'password' => bcrypt('password123'), // Placeholder
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        // 2. Villes (City)
        $villeMap = [];
        foreach ($data['city'] ?? [] as $city) {
            $id = DB::table('villes')->insertGetId([
                'nom' => $city['nom'],
                'image_url' => $city['image'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $villeMap[$city['nom']] = $id;
        }

        // Helper to get ville_id (creates on the fly if missing)
        $getVilleId = function($name) use (&$villeMap) {
            if (!$name) return null;
            if (!isset($villeMap[$name])) {
                $id = DB::table('villes')->insertGetId([
                    'nom' => $name,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $villeMap[$name] = $id;
            }
            return $villeMap[$name];
        };

        // 3. Hotels
        foreach ($data['hotels'] ?? [] as $item) {
            DB::table('hotels')->insert([
                'nom' => $item['nom'],
                'photo_url' => $item['photo'] ?? null,
                'adresse' => $item['adress'] ?? null,
                'contact' => $item['contact'] ?? null,
                'categorie' => $item['categorie'] ?? null,
                'likes' => $item['likes'] ?? 0,
                'ville_id' => $getVilleId($item['ville'] ?? null),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 4. Restaurant
        foreach ($data['restaurant'] ?? [] as $item) {
            DB::table('restaurants')->insert([
                'nom' => $item['nom'],
                'photo_url' => $item['photo'] ?? null,
                'adresse' => $item['adress'] ?? null,
                'contact' => $item['contact'] ?? null,
                'categorie' => $item['categorie'] ?? null,
                'likes' => $item['likes'] ?? 0,
                'ville_id' => $getVilleId($item['ville'] ?? null),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 5. Stadium (stadium)
        foreach ($data['stadium'] ?? [] as $item) {
            DB::table('stades')->insert([
                'nom' => $item['nom'],
                'image_url' => $item['image'] ?? null,
                'adresse' => $item['adresse'] ?? null,
                'capacite' => $item['capacite'] ?? null,
                'ville_id' => $getVilleId($item['ville'] ?? null),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 6. Places (place)
        foreach ($data['place'] ?? [] as $item) {
            DB::table('lieu_places')->insert([
                'nom' => $item['nom'],
                'image_url' => $item['image'] ?? null,
                'adresse' => $item['adresse'] ?? null,
                'description' => $item['description'] ?? null,
                'ville_id' => $getVilleId($item['ville'] ?? null),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 7. Tours (tours)
        foreach ($data['tours'] ?? [] as $item) {
            DB::table('plan_tours')->insert([
                'titre' => $item['titre'],
                'image_url' => $item['image'] ?? null,
                'prix' => $item['prix'] ?? null,
                'duree' => $item['duree'] ?? null,
                'status' => $item['status'] ?? 'active',
                'addedBy' => $item['addedBy'] ?? null,
                'ville_id' => $getVilleId($item['destination'] ?? ($item['ville'] ?? null)),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 8. localServices
        foreach ($data['localServices'] ?? [] as $item) {
            DB::table('service_locals')->insert([
                'nom_service' => $item['nom'] ?? ($item['nom_service'] ?? 'Sans Nom'),
                'type' => $item['type'] ?? null,
                'telephone' => $item['telephone'] ?? null,
                'adresse' => $item['adresse'] ?? null,
                'status' => $item['status'] ?? 'pending',
                'ville_id' => $getVilleId($item['ville'] ?? null),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 9. transport
        foreach ($data['transport'] ?? [] as $item) {
            DB::table('transports')->insert([
                'type_vehicule' => $item['nom'] ?? ($item['type'] ?? 'Transport'),
                'photo_url' => $item['photo'] ?? null,
                'description' => $item['desc'] ?? ($item['description'] ?? null),
                'lien' => $item['lien'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 10. PhoneN
        foreach ($data['PhoneN'] ?? [] as $item) {
            DB::table('urgence_phonens')->insert([
                'service_nom' => $item['nom'] ?? ($item['service_nom'] ?? 'Urgence'),
                'numero' => $item['num'] ?? ($item['numero'] ?? '0'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 11. siteComments
        foreach ($data['siteComments'] ?? [] as $item) {
            DB::table('commentaires')->insert([
                'auteur_nom' => $item['user'] ?? ($item['auteur_nom'] ?? 'Anonyme'),
                'contenu' => $item['text'] ?? ($item['contenu'] ?? ''),
                'note' => $item['rating'] ?? ($item['note'] ?? 5),
                'likes' => $item['likes'] ?? 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
