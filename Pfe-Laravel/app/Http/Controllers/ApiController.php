<?php

namespace App\Http\Controllers;

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
use App\Models\User;
use App\Models\Souvenir;
use App\Models\MyPlan;

use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    public function getVilles() { return response()->json(Ville::all()); }
    
    public function getHotels(Request $request) {
        $query = Hotel::with('ville')->withCount('commentaires');
        if ($request->has('ville')) {
            $query->whereHas('ville', function($q) use ($request) {
                $q->where('nom', $request->ville);
            });
        }
        $data = $query->get()->map(function($item) {
            $item->ville_name = $item->ville->nom ?? null;
            return $item;
        });
        return response()->json($data);
    }

    public function getRestaurants(Request $request) {
        $query = Restaurant::with('ville')->withCount('commentaires');
        if ($request->has('ville')) {
            $query->whereHas('ville', function($q) use ($request) {
                $q->where('nom', $request->ville);
            });
        }
        $data = $query->get()->map(function($item) {
            $item->ville_name = $item->ville->nom ?? null;
            return $item;
        });
        return response()->json($data);
    }

    public function getStades(Request $request) {
        $query = Stade::with('ville');
        if ($request->has('ville')) {
            $query->whereHas('ville', function($q) use ($request) {
                $q->where('nom', $request->ville);
            });
        }
        $data = $query->get()->map(function($item) {
            $item->ville_name = $item->ville->nom ?? null;
            return $item;
        });
        return response()->json($data);
    }

    public function getLieuPlaces(Request $request) {
        $query = LieuPlace::with('ville');
        if ($request->has('ville')) {
            $query->whereHas('ville', function($q) use ($request) {
                $q->where('nom', $request->ville);
            });
        }
        $data = $query->get()->map(function($item) {
            $item->ville_name = $item->ville->nom ?? null;
            return $item;
        });
        return response()->json($data);
    }

    public function getPlanTours(Request $request) {
        $query = PlanTour::with('ville');
        if ($request->has('ville')) {
            $query->whereHas('ville', function($q) use ($request) {
                $q->where('nom', $request->ville);
            });
        }
        $data = $query->get()->map(function($item) {
            $item->ville_name = $item->ville->nom ?? null;
            return $item;
        });
        return response()->json($data);
    }

    public function showPlanTour($id) {
        $tour = PlanTour::with('ville')->find($id);
        if (!$tour) return response()->json(['message' => 'Tour not found'], 404);
        $tour->ville_name = $tour->ville->nom ?? null;
        return response()->json($tour);
    }

    public function getServiceLocals(Request $request) {
        $query = ServiceLocal::query();
        if ($request->has('ville')) {
            $query->whereHas('ville', function($q) use ($request) {
                $q->where('nom', $request->ville);
            });
        }
        return response()->json($query->get());
    }

    public function getTransports() { return response()->json(Transport::all()); }
    public function getUrgencePhonens() { return response()->json(UrgencePhonen::all()); }
    public function getSouvenirs() { return response()->json(Souvenir::all()); }

    // CRUD for Souvenirs
    public function storeSouvenir(Request $request) {
        $request->validate(['name' => 'required']);
        $souvenir = Souvenir::create([
            'name' => $request->name,
            'tag' => $request->tag,
            'category' => $request->category,
            'origin' => $request->origin,
            'price' => $request->price ?? 0,
            'badge' => $request->badge,
            'description' => $request->description,
            'image' => $request->image,
            'likes' => 0
        ]);
        return response()->json($souvenir, 201);
    }
    public function updateSouvenir(Request $request, $id) {
        $souvenir = Souvenir::findOrFail($id);
        $data = [
            'name' => $request->name ?? $souvenir->name,
            'tag' => $request->tag ?? $souvenir->tag,
            'category' => $request->category ?? $souvenir->category,
            'origin' => $request->origin ?? $souvenir->origin,
            'price' => $request->price ?? $souvenir->price,
            'badge' => $request->badge ?? $souvenir->badge,
            'description' => $request->description ?? $souvenir->description,
            'image' => $request->image ?? $souvenir->image,
            'likes' => $request->likes ?? $souvenir->likes
        ];
        $souvenir->update($data);
        return response()->json($souvenir);
    }
    public function deleteSouvenir($id) {
        Souvenir::destroy($id);
        return response()->json(['message' => 'Souvenir deleted']);
    }
    public function getCommentaires(Request $request) { 
        $query = Commentaire::orderBy('created_at', 'desc');
        if ($request->has('service_type') && $request->has('service_id')) {
            $query->where('service_type', $request->service_type)
                  ->where('service_id', $request->service_id);
        }
        return response()->json($query->get()); 
    }

    public function storeCommentaire(Request $request) {
        $request->validate([
            'auteur_nom' => 'required',
            'pays' => 'required',
            'contenu' => 'required',
            'service_type' => 'required',
            'service_id' => 'required'
        ]);

        $commentaire = Commentaire::create([
            'auteur_nom' => $request->auteur_nom,
            'pays' => $request->pays,
            'contenu' => $request->contenu,
            'note' => $request->note ?? 5,
            'service_type' => $request->service_type,
            'service_id' => $request->service_id,
            'date_pub' => now(),
        ]);

        return response()->json($commentaire, 201);
    }

    // CRUD for Hotels
    public function storeHotel(Request $request) {
        $request->validate(['nom' => 'required', 'ville' => 'required']);
        $ville = Ville::firstOrCreate(['nom' => $request->ville]);
        
        $hotel = Hotel::create([
            'nom' => $request->nom,
            'photo_url' => $request->photo_url,
            'adresse' => $request->adresse,
            'contact' => $request->contact,
            'email' => $request->email,
            'prix_chambre' => $request->prix_chambre,
            'categorie' => $request->categorie,
            'ville_id' => $ville->id,
            'likes' => 0
        ]);
        return response()->json($hotel, 201);
    }

    public function deleteHotel($id) {
        Hotel::destroy($id);
        return response()->json(['message' => 'Hotel deleted']);
    }

    // CRUD for Restaurants
    public function storeRestaurant(Request $request) {
        $request->validate(['nom' => 'required', 'ville' => 'required']);
        $ville = Ville::firstOrCreate(['nom' => $request->ville]);
        $res = Restaurant::create([
            'nom' => $request->nom,
            'photo_url' => $request->photo_url,
            'adresse' => $request->adresse,
            'contact' => $request->contact,
            'email' => $request->email,
            'prix_moyen' => $request->prix_moyen,
            'categorie' => $request->categorie,
            'ville_id' => $ville->id,
        ]);
        return response()->json($res, 201);
    }

    public function deleteRestaurant($id) {
        Restaurant::destroy($id);
        return response()->json(['message' => 'Restaurant deleted']);
    }

    // Update Hotel
    public function updateHotel(Request $request, $id) {
        $hotel = Hotel::findOrFail($id);
        $request->validate(['nom' => 'required']);
        $data = $request->only(['nom', 'photo_url', 'adresse', 'contact', 'categorie', 'email', 'prix_chambre', 'likes']);
        if ($request->has('ville')) {
            $ville = Ville::firstOrCreate(['nom' => $request->ville]);
            $data['ville_id'] = $ville->id;
        }
        $hotel->update($data);
        return response()->json($hotel);
    }

    // Update Restaurant
    public function updateRestaurant(Request $request, $id) {
        $res = Restaurant::findOrFail($id);
        $request->validate(['nom' => 'required']);
        $data = $request->only(['nom', 'photo_url', 'adresse', 'contact', 'categorie', 'email', 'prix_moyen', 'likes']);
        if ($request->has('ville')) {
            $ville = Ville::firstOrCreate(['nom' => $request->ville]);
            $data['ville_id'] = $ville->id;
        }
        $res->update($data);
        return response()->json($res);
    }

    // CRUD for Villes
    public function storeVille(Request $request) {
        $request->validate(['nom' => 'required|unique:villes']);
        $ville = Ville::create($request->only(['nom', 'image_url']));
        return response()->json($ville, 201);
    }
    public function updateVille(Request $request, $id) {
        $ville = Ville::findOrFail($id);
        $ville->update($request->only(['nom', 'image_url']));
        return response()->json($ville);
    }
    public function deleteVille($id) {
        Ville::destroy($id);
        return response()->json(['message' => 'Ville deleted']);
    }

    // CRUD for Stades
    public function storeStade(Request $request) {
        $request->validate(['nom' => 'required']);
        $villeId = null;
        if ($request->filled('ville')) {
            $villeId = Ville::firstOrCreate(['nom' => $request->ville])->id;
        }
        $stade = Stade::create([
            'nom' => $request->nom,
            'image_url' => $request->image_url ?? $request->image,
            'adresse' => $request->adresse,
            'contact' => $request->contact,
            'capacite' => $request->capacite,
            'ville_id' => $villeId,
            'likes' => 0
        ]);
        return response()->json($stade, 201);
    }
    public function updateStade(Request $request, $id) {
        $stade = Stade::findOrFail($id);
        $data = [
            'nom' => $request->nom ?? $stade->nom,
            'image_url' => $request->has('image_url') ? $request->image_url : ($request->image ?? $stade->image_url),
            'adresse' => $request->adresse ?? $stade->adresse,
            'contact' => $request->contact ?? $stade->contact,
            'capacite' => $request->capacite ?? $stade->capacite,
            'likes' => $request->likes ?? $stade->likes
        ];
        if ($request->has('ville')) {
            $data['ville_id'] = Ville::firstOrCreate(['nom' => $request->ville])->id;
        }
        $stade->update($data);
        return response()->json($stade);
    }
    public function deleteStade($id) {
        Stade::destroy($id);
        return response()->json(['message' => 'Stade deleted']);
    }

    // CRUD for LieuPlaces
    public function storeLieuPlace(Request $request) {
        $request->validate(['nom' => 'required']);
        $villeId = null;
        if ($request->filled('ville')) {
            $villeId = Ville::firstOrCreate(['nom' => $request->ville])->id;
        }
        $place = LieuPlace::create([
            'nom' => $request->nom,
            'image_url' => $request->image_url ?? $request->image,
            'adresse' => $request->adresse,
            'description' => $request->description,
            'ville_id' => $villeId,
            'likes' => 0
        ]);
        return response()->json($place, 201);
    }
    public function updateLieuPlace(Request $request, $id) {
        $place = LieuPlace::findOrFail($id);
        $data = [
            'nom' => $request->nom ?? $place->nom,
            'image_url' => $request->has('image_url') ? $request->image_url : ($request->image ?? $place->image_url),
            'description' => $request->description ?? $place->description,
            'likes' => $request->likes ?? $place->likes
        ];
        if ($request->has('ville')) {
            $data['ville_id'] = Ville::firstOrCreate(['nom' => $request->ville])->id;
        }
        $place->update($data);
        return response()->json($place);
    }
    public function deleteLieuPlace($id) {
        LieuPlace::destroy($id);
        return response()->json(['message' => 'LieuPlace deleted']);
    }

    // CRUD for PlanTours
    public function storePlanTour(Request $request) {
        $request->validate(['titre' => 'required']);
        $villeId = null;
        if ($request->filled('ville')) {
            $villeId = Ville::firstOrCreate(['nom' => $request->ville])->id;
        }
        $tour = PlanTour::create([
            'titre' => $request->titre,
            'image_url' => $request->image_url ?? $request->image,
            'prix' => $request->prix,
            'duree' => $request->duree,
            'status' => $request->status ?? 'active',
            'addedBy' => $request->addedBy ?? 'admin',
            'ville_id' => $villeId
        ]);
        return response()->json($tour, 201);
    }
    public function updatePlanTour(Request $request, $id) {
        $tour = PlanTour::findOrFail($id);
        $data = [
            'titre' => $request->titre ?? $tour->titre,
            'image_url' => $request->has('image_url') ? $request->image_url : ($request->image ?? $tour->image_url),
            'prix' => $request->prix ?? $tour->prix,
            'duree' => $request->duree ?? $tour->duree,
            'status' => $request->status ?? $tour->status,
            'addedBy' => $request->addedBy ?? $tour->addedBy
        ];
        if ($request->has('ville')) {
            $data['ville_id'] = Ville::firstOrCreate(['nom' => $request->ville])->id;
        }
        $tour->update($data);
        return response()->json($tour);
    }
    public function deletePlanTour($id) {
        PlanTour::destroy($id);
        return response()->json(['message' => 'PlanTour deleted']);
    }

    // CRUD for ServiceLocals
    public function storeServiceLocal(Request $request) {
        $request->validate(['nom' => 'required']);
        $villeId = null;
        if ($request->filled('ville')) {
            $villeId = Ville::firstOrCreate(['nom' => $request->ville])->id;
        }
        $service = ServiceLocal::create([
            'nom' => $request->nom,
            'type' => $request->type,
            'adresse' => $request->adresse,
            'telephone' => $request->telephone,
            'proprietaire' => $request->proprietaire,
            'details' => $request->details,
            'image_url' => $request->image_url ?? $request->image,
            'addedBy' => $request->addedBy ?? 'admin',
            'status' => $request->status ?? 'pending',
            'ville_id' => $villeId
        ]);
        return response()->json($service, 201);
    }
    public function updateServiceLocal(Request $request, $id) {
        $service = ServiceLocal::findOrFail($id);
        $data = [
            'nom' => $request->nom ?? $service->nom,
            'type' => $request->type ?? $service->type,
            'adresse' => $request->adresse ?? $service->adresse,
            'telephone' => $request->telephone ?? $service->telephone,
            'proprietaire' => $request->proprietaire ?? $service->proprietaire,
            'details' => $request->details ?? $service->details,
            'image_url' => $request->has('image_url') ? $request->image_url : ($request->image ?? $service->image_url),
            'addedBy' => $request->addedBy ?? $service->addedBy,
            'status' => $request->status ?? $service->status
        ];
        if ($request->has('ville')) {
            $data['ville_id'] = Ville::firstOrCreate(['nom' => $request->ville])->id;
        }
        $service->update($data);
        return response()->json($service);
    }
    public function deleteServiceLocal($id) {
        ServiceLocal::destroy($id);
        return response()->json(['message' => 'ServiceLocal deleted']);
    }

    // CRUD for Transports
    public function storeTransport(Request $request) {
        $request->validate(['type_vehicule' => 'required']);
        $transport = Transport::create([
            'type_vehicule' => $request->type_vehicule,
            'photo_url' => $request->photo_url,
            'description' => $request->description,
            'lien' => $request->lien
        ]);
        return response()->json($transport, 201);
    }
    public function updateTransport(Request $request, $id) {
        $transport = Transport::findOrFail($id);
        $transport->update($request->only(['type_vehicule', 'photo_url', 'description', 'lien']));
        return response()->json($transport);
    }
    public function deleteTransport($id) {
        Transport::destroy($id);
        return response()->json(['message' => 'Transport deleted']);
    }

    // CRUD for UrgencePhonens
    public function storeUrgencePhonen(Request $request) {
        $request->validate(['service_nom' => 'required', 'numero' => 'required']);
        $urgence = UrgencePhonen::create($request->only(['service_nom', 'numero']));
        return response()->json($urgence, 201);
    }
    public function updateUrgencePhonen(Request $request, $id) {
        $urgence = UrgencePhonen::findOrFail($id);
        $urgence->update($request->only(['service_nom', 'numero']));
        return response()->json($urgence);
    }
    public function deleteUrgencePhonen($id) {
        UrgencePhonen::destroy($id);
        return response()->json(['message' => 'UrgencePhonen deleted']);
    }



    public function getChatContext() {
        $villes = Ville::all()->pluck('nom')->toArray();
        $hotels = Hotel::with('ville')->get()->map(function($h) {
            return $h->nom . " (" . ($h->ville->nom ?? 'Maroc') . ")";
        })->toArray();
        $restaurants = Restaurant::with('ville')->get()->map(function($r) {
            return $r->nom . " (" . ($r->ville->nom ?? 'Maroc') . ")";
        })->toArray();
        $tours = PlanTour::where('status', 'active')->orWhere('status', 'accepted')->get()->pluck('titre')->toArray();

        return response()->json([
            'villes' => $villes,
            'hotels' => array_slice($hotels, 0, 20),
            'restaurants' => array_slice($restaurants, 0, 20),
            'tours' => $tours
        ]);
    }

    public function sendReservation(Request $request)
    {
        $rules = [
            'hotel_id'      => 'required|integer',
            'service_type'  => 'required|in:hotel,restaurant',
            'client_nom'    => 'required|string|max:100',
            'client_email'  => 'required|email',
            'client_tel'    => 'required|string|max:20',
            'date_arrivee'  => 'required|date',
            'nb_personnes'  => 'required|integer|min:1|max:20',
            'message'       => 'nullable|string|max:500',
        ];

        if ($request->input('service_type') === 'hotel') {
            $rules['date_depart'] = 'required|date|after:date_arrivee';
        } else {
            // For restaurant, date_depart represents booking time (e.g. "19:30")
            $rules['date_depart'] = 'required|string';
        }

        $validated = $request->validate($rules);

        // Get hotel or restaurant
        if ($validated['service_type'] === 'hotel') {
            $service = Hotel::with('ville')->find($validated['hotel_id']);
            $prix = $service->prix_chambre ?? null;
        } else {
            $service = Restaurant::with('ville')->find($validated['hotel_id']);
            $prix = $service->prix_moyen ?? null;
        }

        if (!$service) {
            return response()->json(['error' => 'Service non trouvé'], 404);
        }

        $hotelEmail = $service->email ?? env('MAIL_FROM_ADDRESS');

        $data = [
            'hotel_nom'    => $service->nom,
            'hotel_ville'  => $service->ville->nom ?? '',
            'hotel_email'  => $hotelEmail,
            'service_type' => $validated['service_type'],
            'client_nom'   => $validated['client_nom'],
            'client_email' => $validated['client_email'],
            'client_tel'   => $validated['client_tel'],
            'date_arrivee' => $validated['date_arrivee'],
            'date_depart'  => $validated['date_depart'],
            'nb_personnes' => $validated['nb_personnes'],
            'message'      => $validated['message'] ?? '',
            'prix_chambre' => $prix,
        ];

        try {
            // Always send to platform owner — hotel emails may be unverified
            \Illuminate\Support\Facades\Mail::to(env('MAIL_FROM_ADDRESS'))
                ->send(new \App\Mail\ReservationMail($data));

            return response()->json(['success' => true, 'message' => 'Réservation envoyée avec succès !']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur envoi email: ' . $e->getMessage()], 500);
        }
    }

    // ─── Users CRUD ──────────────────────────────────────────────
    public function getUsers() {
        return response()->json(User::select('id','name','email','role','status','created_at')->get());
    }

    public function storeUser(Request $request) {
        $validated = $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => 'nullable|string|in:admin,user,provider,guide',
            'status'   => 'nullable|string|in:pending,accepted,rejected',
        ]);
        $validated['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
        $user = User::create($validated);
        return response()->json($user, 201);
    }

    public function updateUser(Request $request, $id) {
        $user = User::findOrFail($id);
        $data = $request->only(['name', 'email', 'role', 'status']);
        if ($request->filled('password')) {
            $data['password'] = \Illuminate\Support\Facades\Hash::make($request->input('password'));
        }
        $user->update($data);
        return response()->json($user);
    }

    public function deleteUser($id) {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'Utilisateur supprimé']);
    }

    // ─── Commentaires ─────────────────────────────────────────────
    public function deleteCommentaire($id) {
        Commentaire::findOrFail($id)->delete();
        return response()->json(['message' => 'Commentaire supprimé']);
    }

    // ─── MyPlans (Personal Travel Plans) ───────────────────────────
    public function getMyPlans(Request $request) {
        $query = MyPlan::query();
        if ($request->has('userId')) {
            $query->where('userId', $request->userId);
        }
        $plans = $query->orderBy('created_at', 'desc')->get();
        return response()->json($plans);
    }

    public function storeMyPlan(Request $request) {
        $validated = $request->validate([
            'id' => 'required|string',
            'userId' => 'nullable|string',
            'userName' => 'nullable|string',
            'city' => 'nullable|string',
            'duration' => 'nullable|integer',
            'totalBudget' => 'nullable|integer',
            'tier' => 'nullable|string',
            'tagline' => 'nullable|string',
            'image' => 'nullable|string',
            'dayPlans' => 'nullable|array',
            'vibe' => 'nullable|string'
        ]);

        $plan = MyPlan::updateOrCreate(
            ['id' => $validated['id']],
            $validated
        );

        return response()->json($plan, 201);
    }

    public function deleteMyPlan($id) {
        $plan = MyPlan::find($id);
        if ($plan) {
            $plan->delete();
            return response()->json(['success' => true, 'message' => 'Plan supprimé']);
        }
        return response()->json(['success' => false, 'message' => 'Plan non trouvé'], 404);
    }
}

