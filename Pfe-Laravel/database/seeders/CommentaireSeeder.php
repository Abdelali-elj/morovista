<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Commentaire;
use App\Models\Hotel;
use App\Models\Restaurant;
use Illuminate\Support\Facades\DB;

class CommentaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear old comments so we only have realistic ones
        DB::table('commentaires')->truncate();

        $hotels = Hotel::all();
        $restaurants = Restaurant::all();

        // Realistic combinations of names and countries
        $profiles = [
            ['nom' => 'Youssef', 'pays' => 'Maroc'],
            ['nom' => 'Amine', 'pays' => 'Maroc'],
            ['nom' => 'Fatima', 'pays' => 'Maroc'],
            ['nom' => 'Salma', 'pays' => 'Maroc'],
            ['nom' => 'Marc', 'pays' => 'France'],
            ['nom' => 'Sophie', 'pays' => 'France'],
            ['nom' => 'Carlos', 'pays' => 'Espagne'],
            ['nom' => 'Elena', 'pays' => 'Espagne'],
            ['nom' => 'John', 'pays' => 'USA'],
            ['nom' => 'Emma', 'pays' => 'USA'],
            ['nom' => 'Amadou', 'pays' => 'Sénégal'],
            ['nom' => 'Sarah', 'pays' => 'Canada']
        ];
        
        $hotelComments = [
            "Un séjour incroyable ! Le service est impeccable et les chambres sont très propres. Je recommande vivement.",
            "L'emplacement est parfait, juste au centre. Le petit-déjeuner était délicieux, mais le wifi était un peu lent.",
            "Expérience exceptionnelle. Le personnel est très accueillant et toujours souriant. Magnifique vue depuis la chambre.",
            "Très bon rapport qualité-prix. Idéal pour un voyage d'affaires. J'y retournerai sans hésiter.",
            "La piscine et le spa sont magnifiques. C'est l'endroit parfait pour se détendre le week-end.",
            "Chambre spacieuse et lit très confortable. L'accueil à la réception était chaleureux."
        ];

        $restaurantComments = [
            "La nourriture est absolument délicieuse ! Mention spéciale pour le plat signature qui était parfaitement épicé.",
            "L'ambiance est très sympa et le service rapide. Les prix sont un peu élevés mais la qualité est là.",
            "Meilleur restaurant de la ville ! Les plats sont copieux et le personnel est au petit soin.",
            "Décoration magnifique et ambiance chaleureuse. Parfait pour un dîner romantique ou entre amis.",
            "Très belle découverte. Les ingrédients sont frais et les desserts sont à tomber par terre !",
            "Service impeccable. La présentation des plats est digne d'un grand chef étoilé."
        ];

        // Seed Hotels
        foreach ($hotels as $hotel) {
            $numComments = rand(2, 5);
            for ($i = 0; $i < $numComments; $i++) {
                $profile = $profiles[array_rand($profiles)];
                Commentaire::create([
                    'auteur_nom' => $profile['nom'] . ' ' . strtoupper(substr(md5(rand()), 0, 1)) . '.',
                    'pays' => $profile['pays'],
                    'contenu' => $hotelComments[array_rand($hotelComments)],
                    'note' => rand(4, 5),
                    'service_type' => 'hotel',
                    'service_id' => $hotel->id,
                    'date_pub' => now()->subDays(rand(1, 30)),
                    'likes' => rand(0, 15)
                ]);
            }
        }

        // Seed Restaurants
        foreach ($restaurants as $restaurant) {
            $numComments = rand(2, 5);
            for ($i = 0; $i < $numComments; $i++) {
                $profile = $profiles[array_rand($profiles)];
                Commentaire::create([
                    'auteur_nom' => $profile['nom'] . ' ' . strtoupper(substr(md5(rand()), 0, 1)) . '.',
                    'pays' => $profile['pays'],
                    'contenu' => $restaurantComments[array_rand($restaurantComments)],
                    'note' => rand(4, 5),
                    'service_type' => 'restaurant',
                    'service_id' => $restaurant->id,
                    'date_pub' => now()->subDays(rand(1, 30)),
                    'likes' => rand(0, 15)
                ]);
            }
        }
    }
}
