<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HotelEmailPrixSeeder extends Seeder
{
    public function run(): void
    {
        $hotels = [
            // Casablanca
            ['nom' => 'Hyatt Regency Casablanca',   'email' => 'contact@hyatt-casablanca.ma',      'prix' => 2200],
            ['nom' => 'Gray Boutique Hotel and Spa', 'email' => 'reservations@grayboutique.ma',     'prix' => 1500],
            ['nom' => 'Ibis Casablanca City Center', 'email' => 'ibis.casablanca@accor.ma',         'prix' => 650],
            ['nom' => 'Val d\'Anfa Hotel',           'email' => 'contact@valanfahotel.ma',          'prix' => 1100],
            ['nom' => 'Kenzi Tower Hotel',            'email' => 'reservations@kenzi-tower.ma',     'prix' => 1800],
            ['nom' => 'Barcelo Casablanca',           'email' => 'casablanca@barcelo.ma',           'prix' => 980],
            // Rabat
            ['nom' => 'Sofitel Rabat Jardin des Roses', 'email' => 'H3765@sofitel.com',            'prix' => 2500],
            ['nom' => 'Hotel Mercure Rabat Sheherazade', 'email' => 'mercure.rabat@accor.ma',      'prix' => 900],
            ['nom' => 'Hilton Garden Inn Rabat',     'email' => 'rabat@hilton.ma',                 'prix' => 1300],
            ['nom' => 'Golden Tulip Farah Rabat',    'email' => 'reservations@farahrabat.ma',      'prix' => 800],
            // Marrakech
            ['nom' => 'La Mamounia',                 'email' => 'reservations@mamounia.com',       'prix' => 8000],
            ['nom' => 'Four Seasons Resort Marrakech', 'email' => 'reservations.mrk@fourseasons.com', 'prix' => 6500],
            ['nom' => 'Movenpick Hotel Mansour Eddahbi', 'email' => 'hotel.marrakech@movenpick.com', 'prix' => 1400],
            ['nom' => 'Riad Kniza',                  'email' => 'contact@riadkniza.com',            'prix' => 1800],
            ['nom' => 'Hotel Es Saadi Marrakech Resort', 'email' => 'reservations@essaadi.com',    'prix' => 3200],
            // Fès
            ['nom' => 'Palais Faraj Suites & Spa',  'email' => 'info@palaisfaraj.com',             'prix' => 2100],
            ['nom' => 'Riad Fes - Relais & Châteaux', 'email' => 'contact@riadfes.com',           'prix' => 2800],
            ['nom' => 'Hotel Menzeh Zalagh',          'email' => 'zalagh@zalagh.ma',               'prix' => 700],
            // Agadir
            ['nom' => 'Sofitel Agadir Royal Bay',    'email' => 'H9161@sofitel.com',               'prix' => 2900],
            ['nom' => 'RIU Palace Tikida Agadir',    'email' => 'riutikida@riu.com',               'prix' => 1700],
            ['nom' => 'Hotel Riu Tikida Beach',      'email' => 'tikhidabeach@riu.com',            'prix' => 1500],
            ['nom' => 'Iberostar Founty Beach',      'email' => 'agadir@iberostar.com',            'prix' => 1200],
            // Tanger
            ['nom' => 'Hilton Tanger City Center',   'email' => 'tanger@hilton.ma',               'prix' => 1100],
            ['nom' => 'Movenpick Hotel Tanger',      'email' => 'hotel.tanger@movenpick.com',      'prix' => 1300],
            ['nom' => 'El Minzah Hotel',             'email' => 'reservations@elminzah.com',       'prix' => 950],
        ];

        foreach ($hotels as $hotel) {
            DB::table('hotels')
                ->where('nom', 'LIKE', '%' . substr($hotel['nom'], 0, 12) . '%')
                ->update([
                    'email' => $hotel['email'],
                    'prix_chambre' => $hotel['prix'],
                    'updated_at' => now(),
                ]);
        }

        // Restaurants
        $restaurants = [
            ['nom' => 'Rick\'s Café',               'email' => 'info@rickscafe.ma',                'prix' => 350],
            ['nom' => 'Le Cabestan',                'email' => 'contact@lecabestan.ma',             'prix' => 280],
            ['nom' => 'La Sqala',                   'email' => 'lasqala@casablanca.ma',             'prix' => 180],
            ['nom' => 'Restaurant Al Mounia',        'email' => 'almounia@casablanca.ma',           'prix' => 220],
            ['nom' => 'L\'Annexe',                  'email' => 'contact@lannexe.ma',               'prix' => 160],
            ['nom' => 'Dar Zitoun',                 'email' => 'darzitoun@rabat.ma',               'prix' => 200],
            ['nom' => 'Le Dhow',                    'email' => 'contact@ledhow.ma',                'prix' => 300],
            ['nom' => 'Nomad Marrakech',            'email' => 'info@nomadmarrakech.com',          'prix' => 250],
            ['nom' => 'Le Jardin',                  'email' => 'contact@lejardin.ma',              'prix' => 220],
            ['nom' => 'Terrasse des Épices',        'email' => 'terrasseepices@marrakech.ma',      'prix' => 190],
        ];

        foreach ($restaurants as $restau) {
            DB::table('restaurants')
                ->where('nom', 'LIKE', '%' . substr($restau['nom'], 0, 10) . '%')
                ->update([
                    'email' => $restau['email'],
                    'prix_moyen' => $restau['prix'],
                    'updated_at' => now(),
                ]);
        }

        // Fallback: give a generic email to any hotel/restaurant that still has none
        DB::table('hotels')->whereNull('email')->orWhere('email', '')->update([
            'email' => 'reservations@morovista.ma',
            'prix_chambre' => 900,
            'updated_at' => now(),
        ]);

        DB::table('restaurants')->whereNull('email')->orWhere('email', '')->update([
            'email' => 'contact@morovista.ma',
            'prix_moyen' => 200,
            'updated_at' => now(),
        ]);
    }
}
