// PROJET MOROVISTA - EXTRAITS DE CODE (FRONTEND & BACKEND APPARIES)
// ============================================================

// 1. Section Authentification (Front-end)
const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
        if (isLogin) {
            const response = await api.post('/login', {
                email: formData.email, password: formData.password
            });
            const { user: userData, access_token } = response.data;
            setUser(userData);
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
            navigate(userData.role === 'admin' ? '/AdminDashboard' : '/');
        } else {
            const response = await api.post('/register', {
                name: formData.name, email: formData.email,
                password: formData.password, role: formData.userType
            });
            const { user: userData, access_token } = response.data;
            setUser(userData);
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
            navigate('/');
        }
    } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors de la connexion');
    }
};

// 1. Section Authentification (Back-end)
public function register(Request $request)
{
    $request->validate([
        'name' => 'required|string',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:6',
    ]);

    $role = $request->role ?? 'visitor';
    $status = in_array($role, ['provider', 'guide']) ? 'pending' : 'accepted';

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => $role,
        'status' => $status,
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;
    return response()->json([
        'user' => $user,
        'access_token' => $token,
        'token_type' => 'Bearer'
    ]);
}

// 2. Section Chatbot IA (Front-end)
const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: dynamicPrompt },
                    ...messages.slice(-10).map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.text })),
                    { role: "user", content: input }
                ],
                temperature: 0.7, max_tokens: 1024
            })
        });
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'model', text: data.choices[0].message.content, timestamp: new Date().toISOString() }]);
    } catch (error) {
        console.error("Chatbot Error:", error);
    } finally {
        setIsTyping(false);
    }
};

// 2. Section Chatbot IA (Back-end)
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


// 3. Section MyPlan - Plan de Voyage Personnalisé (Front-end)
export default function MyPlanPage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
            navigate('/Login');
        }
    }, [navigate]);

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ flexGrow: 1, paddingTop: '120px' }}>
                {user ? <MyPlanPlanner user={user} /> : <div>Chargement...</div>}
            </div>
        </div>
    );
}

// 3. Section MyPlan - Plan de Voyage Personnalisé (Back-end)
public function getMyPlans(Request $request) {
    $query = MyPlan::query();
    if ($request->has('userId')) {
        $query->where('userId', $request->userId);
    }
    return response()->json($query->orderBy('created_at', 'desc')->get());
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
    $plan = MyPlan::updateOrCreate(['id' => $validated['id']], $validated);
    return response()->json($plan, 201);
}

public function deleteMyPlan($id) {
    $plan = MyPlan::find($id);
    if ($plan) {
        $plan->delete();
        return response()->json(['success' => true]);
    }
    return response()->json(['success' => false], 404);
}

// 4. Section Réservations (Front-end)
const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
        const payload = {
            hotel_id: item.id,
            service_type: type,
            client_nom: bookingData.name,
            client_email: bookingData.email,
            client_tel: bookingData.phone,
            date_arrivee: bookingData.dateArrivee,
            date_depart: type === 'hotel' ? bookingData.dateDepart : bookingData.timeBooking,
            nb_personnes: bookingData.guests,
            message: bookingData.notes
        };
        const response = await api.post('/reservation', payload);
        if (response.data.success) {
            alert(t('booking.success_message') || "Réservation effectuée !");
            onClose();
        }
    } catch (err) {
        console.error("Booking submission error", err);
    } finally {
        setSubmitting(false);
    }
};

// 4. Section Réservations (Back-end)
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
    ];
    if ($request->input('service_type') === 'hotel') {
        $rules['date_depart'] = 'required|date|after:date_arrivee';
    } else {
        $rules['date_depart'] = 'required|string';
    }
    $validated = $request->validate($rules);
    $service = ($validated['service_type'] === 'hotel')
        ? Hotel::with('ville')->find($validated['hotel_id'])
        : Restaurant::with('ville')->find($validated['hotel_id']);
    
    Mail::to(env('MAIL_FROM_ADDRESS'))->send(new ReservationMail($validated));
    return response()->json(['success' => true, 'message' => 'Réservation envoyée !']);
}

// 5. Section Hôtels (Front-end)
useEffect(() => {
    const fetchHotels = async () => {
        setLoading(true);
        try {
            const url = selectedCity ? `/hotels?ville=${selectedCity}` : '/hotels';
            const response = await api.get(url);
            setHotels(response.data);
        } catch (err) {
            console.error("Error fetching hotels", err);
        } finally {
            setLoading(false);
        }
    };
    fetchHotels();
}, [selectedCity]);

// 5. Section Hôtels (Back-end)
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

// 6. Section Restaurants (Front-end)
useEffect(() => {
    const fetchRestaurants = async () => {
        setLoading(true);
        try {
            const url = selectedCity ? `/restaurants?ville=${selectedCity}` : '/restaurants';
            const response = await api.get(url);
            setRestaurants(response.data);
        } catch (err) {
            console.error("Error fetching restaurants", err);
        } finally {
            setLoading(false);
        }
    };
    fetchRestaurants();
}, [selectedCity]);

// 6. Section Restaurants (Back-end)
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

// 7. Section Stades (Front-end)
useEffect(() => {
    const loadStadiums = async () => {
        setLoading(true);
        try {
            const url = selectedCity ? `/stades?ville=${selectedCity}` : '/stades';
            const res = await api.get(url);
            setStadiums(res.data);
        } catch (err) {
            console.error("Error loading stadiums", err);
        } finally {
            setLoading(false);
        }
    };
    loadStadiums();
}, [selectedCity]);

// 7. Section Stades (Back-end)
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

// 8. Section Lieux Touristiques (Front-end)
useEffect(() => {
    const fetchPlaces = async () => {
        setLoading(true);
        try {
            const url = selectedCity ? `/lieu-places?ville=${selectedCity}` : '/lieu-places';
            const res = await api.get(url);
            setPlaces(res.data);
        } catch (err) {
            console.error("Error loading places", err);
        } finally {
            setLoading(false);
        }
    };
    fetchPlaces();
}, [selectedCity]);

// 8. Section Lieux Touristiques (Back-end)
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

// 9. Section Plans de Voyage (Front-end)
useEffect(() => {
    const fetchPlans = async () => {
        setLoading(true);
        try {
            const url = selectedCity ? `/plan-tours?ville=${selectedCity}` : '/plan-tours';
            const res = await api.get(url);
            setPlans(res.data);
        } catch (err) {
            console.error("Error loading travel plans", err);
        } finally {
            setLoading(false);
        }
    };
    fetchPlans();
}, [selectedCity]);

// 9. Section Plans de Voyage (Back-end)
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

// 10. Section Services Locaux (Front-end)
useEffect(() => {
    const fetchServices = async () => {
        setLoading(true);
        try {
            const url = selectedCity ? `/service-locals?ville=${selectedCity}` : '/service-locals';
            const res = await api.get(url);
            setServices(res.data);
        } catch (err) {
            console.error("Error loading local services", err);
        } finally {
            setLoading(false);
        }
    };
    fetchServices();
}, [selectedCity]);

// 10. Section Services Locaux (Back-end)
public function getServiceLocals(Request $request) {
    $query = ServiceLocal::with('ville');
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

// 11. Section Commentaires et Avis (Front-end)
const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
        const payload = {
            auteur_nom: newComment.author,
            pays: newComment.country,
            contenu: newComment.content,
            note: newComment.rating,
            service_type: serviceType,
            service_id: serviceId
        };
        const response = await api.post('/commentaires', payload);
        setComments(prev => [response.data, ...prev]);
        setNewComment({ author: '', country: '', content: '', rating: 5 });
    } catch (err) {
        console.error("Error publishing comment", err);
    }
};

// 11. Section Commentaires et Avis (Back-end)
public function storeCommentaire(Request $request) {
    $request->validate([
        'auteur_nom' => 'required|string',
        'pays' => 'required|string',
        'contenu' => 'required|string',
        'service_type' => 'required|string',
        'service_id' => 'required|integer'
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

// 12. Section Login / Signin (Front-end)
const [isLogin, setIsLogin] = useState(true);
const [formData, setFormData] = useState({ name: '', email: '', password: '', userType: 'visitor' });

const toggleAuthMode = () => {
    setIsLogin(prev => !prev);
    setError('');
    setFormData({ name: '', email: '', password: '', userType: 'visitor' });
};

return (
    <div className="auth-container">
        <div className="auth-tabs">
            <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Connexion</button>
            <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Inscription</button>
        </div>
        {!isLogin && (
            <input placeholder="Nom complet" value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })} />
        )}
        <input type="email" placeholder="Email" value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })} />
        <input type="password" placeholder="Mot de passe" value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })} />
        <button onClick={handleSubmit}>{isLogin ? 'Se connecter' : "S'inscrire"}</button>
        {error && <p className="error-msg">{error}</p>}
    </div>
);

// 13. Section Dashboard Admin (Front-end)
const fetchAllData = async () => {
    setIsLoading(true);
    try {
        const endpointsMap = {
            hotels: '/hotels',        restaurant: '/restaurants',
            stadium: '/stades',       place: '/lieu-places',
            city: '/villes',          utilisateurs: '/users',
            localServices: '/service-locals',  tours: '/plan-tours',
            siteComments: '/commentaires',     souvenirs: '/souvenirs'
        };
        const results = await Promise.all(
            Object.entries(endpointsMap).map(async ([key, path]) => {
                const res = await api.get(path);
                return { key, data: Array.isArray(res.data) ? res.data : [] };
            })
        );
        const newData = {};
        results.forEach(r => { newData[r.key] = r.data; });
        setData(newData);
    } finally { setIsLoading(false); }
};

const handleDelete = async (type, id) => {
    if (window.confirm('Supprimer cet élément ?')) {
        await api.delete(`/${type}/${id}`);
        setData(prev => ({ ...prev, [type]: prev[type].filter(i => i.id !== id) }));
    }
};

const handleStatusUpdate = async (id, newStatus, type = 'utilisateurs') => {
    const res = await api.put(`/${type}/${id}`, { status: newStatus });
    setData(prev => ({ ...prev, [type]: prev[type].map(i => i.id === id ? { ...i, status: newStatus } : i) }));
};

// 13. Section Dashboard Admin (Back-end)
public function updateUserStatus(Request $request, $id)
{
    $user = User::findOrFail($id);
    $request->validate(['status' => 'required|in:pending,accepted,rejected']);
    $user->update(['status' => $request->status]);
    return response()->json($user);
}

public function destroy($id)
{
    $model = Hotel::findOrFail($id);
    $model->delete();
    return response()->json(['message' => 'Supprimé avec succès']);
}

// 14. Section Favoris & Likes (Front-end)
const toggleLike = (item, type) => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
        alert('Veuillez vous connecter pour ajouter aux favoris.');
        return;
    }
    const user = JSON.parse(savedUser);
    const storageKey = `favorited_${type}_${user.id}`;
    const isLiked = likedItems.includes(item.id);

    const updatedLiked = isLiked
        ? likedItems.filter(id => id !== item.id)
        : [...likedItems, item.id];

    setLikedItems(updatedLiked);
    localStorage.setItem(storageKey, JSON.stringify(updatedLiked));

    const newLikes = (item.likes || 0) + (isLiked ? -1 : 1);
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, likes: newLikes } : i));
};

const favoritedItems = items.filter(i => likedItems.includes(i.id));

// 14. Section Favoris & Likes (Back-end)
public function toggleLike(Request $request)
{
    $request->validate([
        'service_type' => 'required|string',
        'service_id'   => 'required|integer',
    ]);

    $modelMap = [
        'hotel'      => Hotel::class,
        'restaurant' => Restaurant::class,
        'stade'      => Stade::class,
        'place'      => LieuPlace::class,
    ];

    $model = $modelMap[$request->service_type] ?? null;
    if (!$model) return response()->json(['error' => 'Type invalide'], 422);

    $item = $model::findOrFail($request->service_id);
    $item->increment('likes');
    return response()->json(['likes' => $item->likes]);
}

    useEffect(() => {
        window.scrollTo(0, 0);
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
            navigate('/Login');
        }
    }, [navigate]);

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ flexGrow: 1, paddingTop: '120px' }}>
                {user ? <MyPlanPlanner user={user} /> : <div>Chargement...</div>}
            </div>
        </div>
    );
}

// 16. Section Contact (Front-end)
const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
const [submitted, setSubmitted] = useState(false);
const [sending, setSending] = useState(false);

const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
        setSending(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1800);
};

const infoCards = [
    { label: 'Adresse', value: 'Casablanca, Maroc' },
    { label: 'Téléphone', value: '+212 5XX XX XX XX' },
    { label: 'Email', value: 'support@morovista.ma' },
    { label: 'Heures', value: 'Lun–Ven: 9h–18h' }
];

// 16. Section Contact (Back-end)
// (formulaire traité côté client avec timeout simulé — pas d'API dédiée)
// Le contact peut être étendu avec : Route::post('/contact', [ContactController::class, 'send']);
// Mail::to('support@morovista.ma')->send(new ContactMail($validated));

// 17. Section Carte Interactive Maroc (Front-end)
const cities = [
    { name: "Rabat",       coordinates: [-6.8416, 34.0209] },
    { name: "Casablanca",  coordinates: [-7.6192, 33.5731] },
    { name: "Marrakech",   coordinates: [-7.9811, 31.6295] },
    { name: "Tanger",      coordinates: [-5.8097, 35.7595] },
    { name: "Agadir",      coordinates: [-9.5982, 30.4278] },
    { name: "Fès",         coordinates: [-5.0003, 34.0331] }
];

const MoroccoMap = ({ onCityHover }) => (
    <ComposableMap projection="geoMercator"
        projectionConfig={{ scale: 1600, center: [-6, 28] }}>
        <Geographies geography={geoUrl}>
            {({ geographies }) => geographies.map(geo => (
                <Geography key={geo.rsmKey} geography={geo}
                    fill="rgba(255,255,255,0.9)" stroke="rgba(0,0,0,0.2)" strokeWidth={0.7} />
            ))}
        </Geographies>
        {cities.map(({ name, coordinates }) => (
            <Marker key={name} coordinates={coordinates}
                onMouseEnter={() => onCityHover?.(name)}
                onMouseLeave={() => onCityHover?.(null)}>
                <g data-tooltip-id="map-tooltip" data-tooltip-content={name}>
                    <circle r={5} fill="#2E611E" stroke="#fff" strokeWidth={2} />
                </g>
            </Marker>
        ))}
    </ComposableMap>
);

// 18. Section NavBar & Recherche Globale (Front-end)
const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setScrolled(currentScrollY > 50);
    if (currentScrollY > lastScrollY && currentScrollY > 150) {
        gsap.to(".modern-nav", { y: "-100%", duration: 0.4, ease: "power2.out" });
    } else {
        gsap.to(".modern-nav", { y: "0%", duration: 0.4, ease: "power2.out" });
    }
    lastScrollY = currentScrollY;
};

// Recherche globale multi-sources (Hôtels, Restaurants, Services, Urgences, Tours)
useEffect(() => {
    if (searchQuery.trim().length > 1) {
        const query = searchQuery.toLowerCase();
        const results = [];
        localData.hotels.forEach(item => {
            if (item.nom?.toLowerCase().includes(query) || item.ville?.toLowerCase().includes(query))
                results.push({ ...item, typeLabel: 'Hotel', linkPrefix: '/Hotels' });
        });
        localData.restaurant.forEach(item => {
            if (item.nom?.toLowerCase().includes(query) || item.ville?.toLowerCase().includes(query))
                results.push({ ...item, typeLabel: 'Restaurant', linkPrefix: '/Restaurant' });
        });
        setSearchResults(results.slice(0, 8));
    } else {
        setSearchResults([]);
    }
}, [searchQuery, localData]);

// Changement de langue (i18n) & menu profil utilisateur
const languages = [
    { code: "fr", name: "Français" }, { code: "en", name: "English" },
    { code: "ar", name: "العربية" },  { code: "es", name: "Español" }
];

const handleLogout = () => { logout(); navigate('/'); };

