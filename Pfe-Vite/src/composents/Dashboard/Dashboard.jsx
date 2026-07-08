import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api';
import {
    LuUser,
    LuSettings,
    LuHeart,
    LuHistory,
    LuTrendingUp,
    LuPhone,
    LuClock,
    LuMapPin,
    LuEye,
    LuCircleCheck,
    LuCircleX,
    LuPlus,
    LuTriangleAlert,
    LuLoader,
    LuLayoutDashboard,
    LuLogOut,
    LuChevronRight,
    LuCompass,
    LuMap,
    LuArrowLeft,
    LuBookmark,
    LuTrash2,
    LuCalendarDays,
    LuWallet,
    LuSparkles
} from 'react-icons/lu';
import MyPlanPlanner from './MyPlanPlanner';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'overview');
    const [myServices, setMyServices] = useState([]);
    const [myTours, setMyTours] = useState([]);
    const [cities, setCities] = useState([]);
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [favoriteItems, setFavoriteItems] = useState([]);
    const [savedPlans, setSavedPlans] = useState([]);
    const [selectedPlanToView, setSelectedPlanToView] = useState(null);
    const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
    const [serviceCategory, setServiceCategory] = useState('localServices');
    const [newService, setNewService] = useState({
        nom: '',
        type: '',
        ville: '',
        adresse: '',
        telephone: '',
        proprietaire: '',
        details: '',
        image: '',
        categorie: '',
        prix_chambre: '',
        prix_moyen: ''
    });
    const [newTour, setNewTour] = useState({
        titre: '',
        destination: '',
        duree: '',
        prix: '',
        details: '',
        image: ''
    });
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isCustomCityService, setIsCustomCityService] = useState(false);
    const [isCustomCityTour, setIsCustomCityTour] = useState(false);
    const [profileData, setProfileData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
            // Clean up the state so it doesn't get stuck if they click away and back without state
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            if (parsedUser.role === 'admin' || parsedUser.userType === 'admin') {
                navigate('/AdminDashboard');
            } else {
                setUser(parsedUser);
                if (parsedUser.role === 'provider' || parsedUser.userType === 'provider') {
                    fetchMyServices(parsedUser.email);
                } else if (parsedUser.role === 'guide' || parsedUser.userType === 'guide') {
                    fetchMyTours(parsedUser.email);
                } else {
                    const favCount = ['favorited_hotels', 'favorited_places', 'favorited_restaurants', 'favorited_stadiums'].reduce((acc, key) => {
                        const saved = localStorage.getItem(`${key}_${parsedUser.id}`);
                        return acc + (saved ? JSON.parse(saved).length : 0);
                    }, 0);
                    setFavoritesCount(favCount);
                    // Load saved plans from Laravel with localStorage fallback
                    const userId = parsedUser.uid || parsedUser.id || parsedUser.email || 'anonymous';
                    const localPlans = JSON.parse(localStorage.getItem(`my_plans_${userId}`) || '[]');
                    setSavedPlans(localPlans);
                    
                    const loadPlansFromBackend = async () => {
                        try {
                            const res = await api.get(`/my-plans?userId=${userId}`);
                            if (res.data && Array.isArray(res.data)) {
                                setSavedPlans(res.data);
                                localStorage.setItem(`my_plans_${userId}`, JSON.stringify(res.data));
                            }
                        } catch (err) {
                            console.warn("Failed to load plans from Laravel, using local cache", err);
                        }
                    };
                    loadPlansFromBackend();
                }
                setProfileData({ name: parsedUser.name, email: parsedUser.email, password: parsedUser.password || '' });
                fetchCities();
            }
        } else {
            navigate('/Login');
        }
        setIsLoading(false);
    }, [navigate]);

    const fetchMyTours = async (email) => {
        try {
            const snapshot = await getDocs(collection(db, 'tours'));
            const allTours = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const myOwn = allTours.filter(t => t.addedBy === email);
            setMyTours(myOwn);
        } catch (error) {
            console.error("Error fetching tours", error);
        }
    };

    const fetchCities = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'city'));
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCities(data);
            if (data.length > 0) {
                setNewService(prev => ({ ...prev, ville: data[0].nom }));
            }
        } catch (error) {
            console.error("Error fetching cities", error);
        }
    };

    const fetchMyServices = async (email) => {
        try {
            // Firestore services
            const snapshot = await getDocs(collection(db, 'localServices'));
            const firestoreServices = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data(), category: 'localServices' }))
                .filter(s => s.addedBy === email);

            // Laravel Hotels
            let laravelHotels = [];
            try {
                const res = await api.get('/hotels');
                laravelHotels = (res.data || [])
                    .filter(h => h.email === email)
                    .map(h => ({
                        id: h.id,
                        nom: h.nom,
                        type: 'Hôtel',
                        ville: h.ville_name || h.ville,
                        adresse: h.adresse,
                        telephone: h.contact,
                        status: 'accepted',
                        category: 'hotel'
                    }));
            } catch (e) {
                console.error("Error fetching my hotels", e);
            }

            // Laravel Restaurants
            let laravelRestaus = [];
            try {
                const res = await api.get('/restaurants');
                laravelRestaus = (res.data || [])
                    .filter(r => r.email === email)
                    .map(r => ({
                        id: r.id,
                        nom: r.nom,
                        type: 'Restaurant',
                        ville: r.ville_name || r.ville,
                        adresse: r.adresse,
                        telephone: r.contact,
                        status: 'accepted',
                        category: 'restaurant'
                    }));
            } catch (e) {
                console.error("Error fetching my restaurants", e);
            }

            setMyServices([...firestoreServices, ...laravelHotels, ...laravelRestaus]);
        } catch (error) {
            console.error("Error fetching services", error);
        }
    };

    const loadFavorites = async () => {
        setIsLoadingFavorites(true);
        let allFavs = [];

        const fetchCategory = async (endpoint, storageKey, label) => {
            const saved = localStorage.getItem(`${storageKey}_${user.id}`);
            if (!saved) return;
            const ids = JSON.parse(saved);
            if (ids.length === 0) return;

            try {
                const snapshot = await getDocs(collection(db, endpoint));
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Handle mixed types (int vs string depending on when originally saved and if migrated)
                const filtered = data.filter(item => ids.some(id => String(id) === String(item.id)));
                filtered.forEach(item => {
                    allFavs.push({ ...item, categoryLabel: label });
                });
            } catch (e) { console.error(e); }
        };

        await Promise.all([
            fetchCategory('hotels', 'favorited_hotels', 'Hôtel'),
            fetchCategory('place', 'favorited_places', 'Lieu'),
            fetchCategory('restaurant', 'favorited_restaurants', 'Restaurant'),
            fetchCategory('stadium', 'favorited_stadiums', 'Stade'),
        ]);

        setFavoriteItems(allFavs);
        setIsLoadingFavorites(false);
    };

    useEffect(() => {
        if (activeTab === 'favorites' && user) {
            loadFavorites();
        }
    }, [activeTab, user]);

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            if (serviceCategory === 'localServices') {
                const serviceData = {
                    nom: newService.nom,
                    type: newService.type || 'Service Local',
                    ville: newService.ville || cities[0]?.nom || '',
                    adresse: newService.adresse || '',
                    telephone: newService.telephone || '',
                    proprietaire: newService.proprietaire || '',
                    details: newService.details || '',
                    image: newService.image || '',
                    addedBy: user.email,
                    status: 'pending'
                };
                const docRef = await addDoc(collection(db, 'localServices'), serviceData);
                setMyServices([...myServices, { id: docRef.id, ...serviceData, category: 'localServices' }]);
                alert('Service Local soumis avec succès! En attente de validation.');
            } else if (serviceCategory === 'hotel') {
                const payload = {
                    nom: newService.nom,
                    photo_url: newService.image,
                    adresse: newService.adresse,
                    contact: newService.telephone,
                    categorie: newService.categorie || 'Standard',
                    prix_chambre: newService.prix_chambre || '1000',
                    ville: newService.ville || cities[0]?.nom || '',
                    email: user.email
                };
                const res = await api.post('/hotels', payload);
                setMyServices([...myServices, {
                    id: res.data.id,
                    nom: res.data.nom,
                    type: 'Hôtel',
                    ville: res.data.ville_name || res.data.ville || payload.ville,
                    adresse: res.data.adresse,
                    telephone: res.data.contact,
                    status: 'accepted',
                    category: 'hotel'
                }]);
                alert('Hôtel ajouté avec succès!');
            } else if (serviceCategory === 'restaurant') {
                const payload = {
                    nom: newService.nom,
                    photo_url: newService.image,
                    adresse: newService.adresse,
                    contact: newService.telephone,
                    categorie: newService.categorie || 'General',
                    prix_moyen: newService.prix_moyen || '150',
                    ville: newService.ville || cities[0]?.nom || '',
                    email: user.email
                };
                const res = await api.post('/restaurants', payload);
                setMyServices([...myServices, {
                    id: res.data.id,
                    nom: res.data.nom,
                    type: 'Restaurant',
                    ville: res.data.ville_name || res.data.ville || payload.ville,
                    adresse: res.data.adresse,
                    telephone: res.data.contact,
                    status: 'accepted',
                    category: 'restaurant'
                }]);
                alert('Restaurant ajouté avec succès!');
            } else if (serviceCategory === 'place') {
                const payload = {
                    nom: newService.nom,
                    image_url: newService.image,
                    description: newService.details,
                    ville: newService.ville || cities[0]?.nom || '',
                    adresse: newService.adresse || ''
                };
                await api.post('/lieu-places', payload);
                alert('Lieu / Place ajouté avec succès!');
            }

            setNewService({
                nom: '', type: '', ville: cities[0]?.nom || '',
                adresse: '', telephone: '', proprietaire: '',
                details: '', image: '', categorie: '',
                prix_chambre: '', prix_moyen: ''
            });
            setIsCustomCityService(false);
            setActiveTab('services');
        } catch (error) {
            console.error("Error adding service", error);
            alert("Erreur lors de l'ajout du service.");
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const userRef = doc(db, 'utilisateurs', String(user.id));
            await updateDoc(userRef, { ...profileData });
            const updatedUser = { ...user, ...profileData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setIsEditingProfile(false);
            alert('Profil mis à jour avec succès!');
        } catch (error) {
            console.error("Error updating profile", error);
            alert('Erreur lors de la mise à jour du profil.');
        }
    };

    const handleLogout = () => {
        // Just return home, keep session
        navigate('/');
    };

    if (isLoading || !user) {
        return <div className="loading-state">Chargement du Dashboard...</div>;
    }

    const providerNavItems = [
        { id: 'overview', name: "Vue d'ensemble", icon: <LuLayoutDashboard /> },
        { id: 'services', name: 'Mes Services', icon: <LuSettings /> },
        { id: 'add-service', name: 'Nouveau Service', icon: <LuPlus /> },
        { id: 'favorites', name: 'Favoris', icon: <LuHeart /> },
        { id: 'profile', name: 'Mon Profil', icon: <LuUser /> }
    ];

    const guideNavItems = [
        { id: 'overview', name: "Vue d'ensemble", icon: <LuLayoutDashboard /> },
        { id: 'tours', name: 'Mes Plans/Tours', icon: <LuMap /> },
        { id: 'add-tour', name: 'Nouveau Plan', icon: <LuPlus /> },
        { id: 'favorites', name: 'Favoris', icon: <LuHeart /> },
        { id: 'profile', name: 'Mon Profil', icon: <LuUser /> }
    ];

    const visitorNavItems = [
        { id: 'overview', name: 'Mon Voyage', icon: <LuCompass /> },
        { id: 'myPlan', name: 'Créer un Plan', icon: <LuMap /> },
        { id: 'savedPlans', name: 'Mes Plans', icon: <LuBookmark />, badge: savedPlans.length || null },
        { id: 'favorites', name: 'Favoris', icon: <LuHeart /> },
        { id: 'history', name: 'Historique', icon: <LuHistory /> },
        { id: 'profile', name: 'Mon Profil', icon: <LuUser /> }
    ];

    const isRestricted = ['provider', 'guide'].includes(user.userType) && ['pending', 'rejected'].includes(user.status);

    let navItems = visitorNavItems;
    if (user.userType === 'provider') navItems = isRestricted ? [{ id: 'overview', name: 'Statut du Compte', icon: <LuTriangleAlert /> }] : providerNavItems;
    else if (user.userType === 'guide') navItems = isRestricted ? [{ id: 'overview', name: 'Statut du Compte', icon: <LuTriangleAlert /> }] : guideNavItems;
    const themeClass = user.userType === 'provider' ? 'provider-theme-layout' : 'visitor-theme-layout';

    // --- RENDER CONTENT SECTIONS ---

    const renderOverview = () => {
        if (isRestricted) {
            return (
                <div className="admin-scroll-content animate-fade-in">
                    <div className="admin-table-wrapper" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                        {user.status === 'pending' ? (
                            <>
                                <LuLoader className="spin" size={60} color="#f59e0b" style={{ marginBottom: '1rem' }} />
                                <h2>Compte en Cours de Validation</h2>
                                <p style={{ color: '#64748b', marginTop: '1rem', fontSize: '1.1rem', maxWidth: '600px', margin: '1rem auto' }}>
                                    Merci de votre inscription. Votre profil de professionnel est actuellement en attente de validation par notre administration. Vous recevrez un accès complet à votre tableau de bord une fois approuvé.
                                </p>
                            </>
                        ) : (
                            <>
                                <LuCircleX size={60} color="#ef4444" style={{ marginBottom: '1rem' }} />
                                <h2 style={{ color: '#ef4444' }}>Candidature Refusée</h2>
                                <p style={{ color: '#64748b', marginTop: '1rem', fontSize: '1.1rem', maxWidth: '600px', margin: '1rem auto' }}>
                                    Malheureusement, votre demande d'inscription en tant que professionnel a été refusée par notre équipe.
                                </p>
                            </>
                        )}
                        <button className="btn-cancel" style={{ marginTop: '2rem' }} onClick={handleLogout}>Retour à l'accueil</button>
                    </div>
                </div>
            );
        }

        return (
        <div className="admin-scroll-content animate-fade-in">
            <div className="welcome-card-user">
                <div className="welcome-text">
                    <h1>Slt, {user.name} 👋</h1>
                    <p>
                        {user.userType === 'provider' && 'Gérez vos services et suivez leur statut.'}
                        {user.userType === 'guide' && 'Gérez vos tours et vos plans de voyage.'}
                        {['user', 'visitor'].includes(user.userType) && 'Prêt pour votre prochaine aventure marocaine ?'}
                    </p>
                </div>
                <div className="user-badge">
                    {user.userType === 'provider' && <><LuSettings /> Service Owner</>}
                    {user.userType === 'guide' && <><LuCompass /> Official Guide</>}
                    {['user', 'visitor'].includes(user.userType) && <><LuUser /> Traveler Member</>}
                </div>
            </div>

            {user.userType === 'provider' && (
                <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                        <div className="stat-header">
                            <div className="stat-icon blue-glow"><LuEye /></div>
                            <div className="stat-content">
                                <h3>{myServices.length}</h3>
                                <p>Services Totaux</p>
                            </div>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-header">
                            <div className="stat-icon green-glow"><LuCircleCheck /></div>
                            <div className="stat-content">
                                <h3>{myServices.filter(s => s.status === 'accepted').length}</h3>
                                <p>Actifs / Validés</p>
                            </div>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-header">
                            <div className="stat-icon gold-glow"><LuClock /></div>
                            <div className="stat-content">
                                <h3>{myServices.filter(s => s.status === 'pending').length}</h3>
                                <p>En Attente</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {user.userType === 'guide' && (
                <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                        <div className="stat-header">
                            <div className="stat-icon blue-glow"><LuMap /></div>
                            <div className="stat-content">
                                <h3>{myTours.length}</h3>
                                <p>Plans Créés</p>
                            </div>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-header">
                            <div className="stat-icon green-glow"><LuCompass /></div>
                            <div className="stat-content">
                                <h3>{user.ville || 'Maroc'}</h3>
                                <p>Ville d'Activité</p>
                            </div>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-header">
                            <div className="stat-icon gold-glow"><LuTrendingUp /></div>
                            <div className="stat-content">
                                <h3>Elite</h3>
                                <p>Statut Guide</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {['user', 'visitor'].includes(user.userType) && (
                <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                        <div className="stat-header">
                            <div className="stat-icon blue-glow"><LuMap /></div>
                            <div className="stat-content">
                                <h3>0</h3>
                                <p>Lieux visités</p>
                            </div>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-header">
                            <div className="stat-icon red-glow"><LuHeart /></div>
                            <div className="stat-content">
                                <h3>{favoritesCount}</h3>
                                <p>Favoris</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        );
    };

    const renderServicesList = () => (
        <div className="admin-scroll-content animate-fade-in">
            <div className="admin-table-wrapper">
                <div className="management-header" style={{ padding: '1.5rem' }}>
                    <div className="header-title">
                        <h2><LuSettings /> Mes Services</h2>
                    </div>
                    <div className="header-actions">
                        <button className="add-btn" onClick={() => setActiveTab('add-service')}><LuPlus /> Ajouter</button>
                        <button className="action-btn" onClick={() => fetchMyServices(user.email)}><LuHistory /></button>
                    </div>
                </div>

                {myServices.length === 0 ? (
                    <div className="empty-state-container" style={{ padding: '3rem' }}>
                        <LuTriangleAlert className="empty-icon" />
                        <p>Vous n'avez soumis aucun service pour le moment.</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Service</th>
                                <th>Type</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myServices.map(service => (
                                <tr key={service.id}>
                                    <td>
                                        <span className="main-name">{service.nom}</span>
                                    </td>
                                    <td>{service.type}</td>
                                    <td>
                                        <span className={`status-badge ${service.status}`}>
                                            {service.status === 'accepted' && 'Validé'}
                                            {service.status === 'pending' && 'En cours'}
                                            {service.status === 'rejected' && 'Refusé'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );

    const renderAddService = () => (
        <div className="admin-scroll-content animate-fade-in">
            <div className="admin-table-wrapper" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div className="management-header" style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                    <div className="header-title">
                        <h2><LuPlus /> Nouveau Service / Établissement</h2>
                        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Remplissez les détails pour soumettre votre service ou établissement.</p>
                    </div>
                </div>
                <form className="modal-form" onSubmit={handleAddService} style={{ padding: '2rem' }}>
                    <div className="form-grid">
                        <div className="form-group full">
                            <label>Catégorie de Service / Établissement</label>
                            <select
                                value={serviceCategory}
                                onChange={e => {
                                    setServiceCategory(e.target.value);
                                    setNewService({
                                        nom: '', type: '', ville: cities[0]?.nom || '',
                                        adresse: '', telephone: '', proprietaire: '',
                                        details: '', image: '', categorie: '',
                                        prix_chambre: '', prix_moyen: ''
                                    });
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '1rem',
                                    background: '#fff'
                                }}
                            >
                                <option value="localServices">Service Local (Plomberie, Taxi, Guide...)</option>
                                <option value="hotel">Hôtel</option>
                                <option value="restaurant">Restaurant</option>
                                <option value="place">Lieu / Place Touristique</option>
                            </select>
                        </div>

                        {/* Nom (All) */}
                        <div className="form-group full">
                            <label>
                                {serviceCategory === 'hotel' ? "Nom de l'Hôtel" :
                                 serviceCategory === 'restaurant' ? "Nom du Restaurant" :
                                 serviceCategory === 'place' ? "Nom du Lieu / Place" :
                                 "Nom du Service Local"}
                            </label>
                            <input
                                type="text"
                                placeholder={
                                    serviceCategory === 'hotel' ? "Ex: Hotel Sofitel..." :
                                    serviceCategory === 'restaurant' ? "Ex: Chez Ali..." :
                                    serviceCategory === 'place' ? "Ex: Jardin Majorelle..." :
                                    "Ex: Taxi Ahmed, Plomberie Moderne..."
                                }
                                value={newService.nom}
                                onChange={e => setNewService({ ...newService, nom: e.target.value })}
                                required
                            />
                        </div>

                        {/* Conditionally rendered type / subcategory */}
                        {serviceCategory === 'localServices' && (
                            <div className="form-group">
                                <label>Type de Service</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Plomberie, Electricité, Taxi..."
                                    value={newService.type}
                                    onChange={e => setNewService({ ...newService, type: e.target.value })}
                                    required
                                />
                            </div>
                        )}

                        {serviceCategory === 'hotel' && (
                            <>
                                <div className="form-group">
                                    <label>Catégorie (Étoiles)</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: 5 étoiles, Luxury, Standard"
                                        value={newService.categorie}
                                        onChange={e => setNewService({ ...newService, categorie: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Prix de la Chambre (MAD/nuit)</label>
                                    <input
                                        type="number"
                                        placeholder="Ex: 1200"
                                        value={newService.prix_chambre}
                                        onChange={e => setNewService({ ...newService, prix_chambre: e.target.value })}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {serviceCategory === 'restaurant' && (
                            <>
                                <div className="form-group">
                                    <label>Type de cuisine</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Marocain, Italien, Poisson"
                                        value={newService.categorie}
                                        onChange={e => setNewService({ ...newService, categorie: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Prix moyen (MAD)</label>
                                    <input
                                        type="number"
                                        placeholder="Ex: 150"
                                        value={newService.prix_moyen}
                                        onChange={e => setNewService({ ...newService, prix_moyen: e.target.value })}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {/* Ville (All) */}
                        <div className="form-group">
                            <label>Ville</label>
                            {!isCustomCityService ? (
                                <select
                                    value={newService.ville}
                                    onChange={e => {
                                        if (e.target.value === 'other') {
                                            setIsCustomCityService(true);
                                            setNewService({ ...newService, ville: '' });
                                        } else {
                                            setNewService({ ...newService, ville: e.target.value });
                                        }
                                    }}
                                    required
                                >
                                    <option value="">Choisir une ville</option>
                                    {cities.map(c => <option key={c.nom} value={c.nom}>{c.nom}</option>)}
                                    <option value="other">Saisir une autre ville...</option>
                                </select>
                            ) : (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Saisir la ville"
                                        value={newService.ville}
                                        onChange={e => setNewService({ ...newService, ville: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsCustomCityService(false)}
                                        style={{ padding: '0 10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
                                        title="Retour à la liste"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Téléphone / Contact (Except Place) */}
                        {serviceCategory !== 'place' && (
                            <div className="form-group">
                                <label>Téléphone / Contact</label>
                                <input
                                    type="text"
                                    placeholder="+212 XXX-XXX-XXX"
                                    value={newService.telephone}
                                    onChange={e => setNewService({ ...newService, telephone: e.target.value })}
                                    required
                                />
                            </div>
                        )}

                        {/* Propriétaire (Only LocalServices) */}
                        {serviceCategory === 'localServices' && (
                            <div className="form-group">
                                <label>Propriétaire</label>
                                <input
                                    type="text"
                                    placeholder="Nom complet"
                                    value={newService.proprietaire}
                                    onChange={e => setNewService({ ...newService, proprietaire: e.target.value })}
                                    required
                                />
                            </div>
                        )}

                        {/* Adresse (Except Place, or optional for Place) */}
                        <div className="form-group full">
                            <label>Adresse complète {serviceCategory === 'place' && '(Optionnel)'}</label>
                            <input
                                type="text"
                                placeholder="Rue, Quartier, Code postal..."
                                value={newService.adresse}
                                onChange={e => setNewService({ ...newService, adresse: e.target.value })}
                                required={serviceCategory !== 'place'}
                            />
                        </div>

                        {/* Image URL (All) */}
                        <div className="form-group">
                            <label>Image URL (Optionnel)</label>
                            <input
                                type="text"
                                placeholder="Lien vers une image (Unsplash, etc.)"
                                value={newService.image}
                                onChange={e => setNewService({ ...newService, image: e.target.value })}
                            />
                        </div>

                        {/* Details / Description (Only localServices and place) */}
                        {(serviceCategory === 'localServices' || serviceCategory === 'place') && (
                            <div className="form-group full">
                                <label>Détails / Description</label>
                                <textarea
                                    rows="4"
                                    placeholder="Décrivez l'activité, horaires, services..."
                                    value={newService.details}
                                    onChange={e => setNewService({ ...newService, details: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer" style={{ background: 'transparent', borderTop: 'none', padding: '0', marginTop: '2rem' }}>
                        <button className="btn-save" style={{ width: '100%', height: '55px', fontSize: '1.1rem' }}>
                            Soumettre pour validation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    const renderProfile = () => (
        <div className="admin-scroll-content animate-fade-in">
            <div className="admin-table-wrapper" style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div className="management-header" style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                    <div className="header-title">
                        <h2><LuUser /> Mon Profil</h2>
                        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Gérez vos informations personnelles.</p>
                    </div>
                    {!isEditingProfile && (
                        <button className="add-btn" onClick={() => setIsEditingProfile(true)}>
                            Modifier le Profil
                        </button>
                    )}
                </div>

                <div style={{ padding: '2rem' }}>
                    {isEditingProfile ? (
                        <form className="modal-form" onSubmit={handleUpdateProfile}>
                            <div className="form-group">
                                <label>Nom Complet</label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Mot de passe</label>
                                <input
                                    type="password"
                                    value={profileData.password}
                                    onChange={e => setProfileData({ ...profileData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="modal-footer" style={{ background: 'transparent', borderTop: 'none', padding: '0', marginTop: '1.5rem', gap: '1rem' }}>
                                <button type="button" className="btn-cancel" onClick={() => setIsEditingProfile(false)}>Annuler</button>
                                <button type="submit" className="btn-save">Enregistrer</button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-details-view" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <div className="profile-img btn-save" style={{ width: '100px', height: '100px', fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {user.name.charAt(0)}
                                </div>
                                <div className="profile-main-info">
                                    <h3 style={{ fontSize: '1.8rem', color: '#1e293b' }}>{user.name}</h3>
                                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>{user.email}</p>
                                    <span className={`status-badge accepted`} style={{ marginTop: '0.5rem', display: 'inline-block' }}>
                                        {user.userType === 'provider' ? 'Prestataire vérifié' : 'Membre voyageur'}
                                    </span>
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '1rem 0' }} />

                            <div className="profile-grid-info" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div className="info-block">
                                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.4rem' }}>Type de compte</label>
                                    <p style={{ fontWeight: '600', color: '#475569' }}>{user.userType === 'provider' ? 'Service Provider' : 'Traveler Member'}</p>
                                </div>
                                <div className="info-block">
                                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.4rem' }}>ID Utilisateur</label>
                                    <p style={{ fontWeight: '600', color: '#475569' }}>#000{user.id}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderVisitorPlaceholder = (title) => (
        <div className="admin-scroll-content animate-fade-in">
            <div className="admin-table-wrapper" style={{ padding: '3rem', textAlign: 'center' }}>
                <h2>{title}</h2>
                <p style={{ color: '#94a3b8', marginTop: '1rem' }}>Cette fonctionnalité sera bientôt disponible ! 🚀</p>
            </div>
        </div>
    );

    const renderFavorites = () => (
        <div className="admin-scroll-content animate-fade-in">
            <div className="admin-table-wrapper">
                <div className="management-header" style={{ padding: '1.5rem' }}>
                    <div className="header-title">
                        <h2><LuHeart color="red" /> Mes Favoris</h2>
                        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Retrouvez tous les lieux, hôtels et restaurants que vous avez aimés.</p>
                    </div>
                </div>

                {isLoadingFavorites ? (
                    <div style={{ padding: '3rem', textAlign: 'center' }}>
                        <LuLoader className="spin" size={30} color="#94a3b8" />
                        <p>Chargement de vos favoris...</p>
                    </div>
                ) : favoriteItems.length === 0 ? (
                    <div className="empty-state-container" style={{ padding: '3rem' }}>
                        <LuHeart size={40} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                        <p>Vous n'avez aucun favori pour le moment.</p>
                        <button className="btn-save" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>Explorer le site</button>
                    </div>
                ) : (
                    <div style={{ padding: '1.5rem' }}>
                        <div className="data-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            {favoriteItems.map((item, idx) => (
                                <div className="data-card" key={`${item.categoryLabel}-${item.id}-${idx}`} style={{ margin: 0 }}>
                                    {item.photo && <img src={item.photo} alt={item.nom} style={{ height: '180px', objectFit: 'cover' }} />}
                                    {item.image && !item.photo && <img src={item.image} alt={item.nom} style={{ height: '180px', objectFit: 'cover' }} />}
                                    <div className="card-content">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <span className="card-tag">{item.categoryLabel}</span>
                                            <span style={{ color: 'red', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <LuHeart fill="red" /> {item.likes || 0}
                                            </span>
                                        </div>
                                        <h4 style={{ margin: '0.5rem 0' }}>{item.nom}</h4>
                                        <p style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <LuMapPin size={14} /> {item.ville}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const handleAddTour = async (e) => {
        e.preventDefault();
        const tourData = {
            ...newTour,
            addedBy: user.email,
            status: 'accepted'
        };

        try {
            const docRef = await addDoc(collection(db, 'tours'), tourData);
            setMyTours([...myTours, { id: docRef.id, ...tourData }]);
            setNewTour({ titre: '', destination: '', duree: '', prix: '', details: '', image: '' });
            setIsCustomCityTour(false);
            alert('Plan de voyage créé avec succès !');
            setActiveTab('tours');
        } catch (error) {
            console.error("Error adding tour", error);
        }
    };

    const renderToursList = () => (
        <div className="admin-scroll-content animate-fade-in">
            <div className="admin-table-wrapper">
                <div className="management-header" style={{ padding: '1.5rem' }}>
                    <div className="header-title">
                        <h2><LuMap /> Mes Plans de Voyage</h2>
                    </div>
                    <div className="header-actions">
                        <button className="add-btn" onClick={() => setActiveTab('add-tour')}><LuPlus /> Créer</button>
                    </div>
                </div>

                {myTours.length === 0 ? (
                    <div className="empty-state-container" style={{ padding: '3rem' }}>
                        <LuTriangleAlert className="empty-icon" />
                        <p>Vous n'avez créé aucun plan de voyage pour le moment.</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Plan / Circuit</th>
                                <th>Destination</th>
                                <th>Durée</th>
                                <th>Prix</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myTours.map(tour => (
                                <tr key={tour.id}>
                                    <td><span className="main-name">{tour.titre}</span></td>
                                    <td>{tour.destination}</td>
                                    <td>{tour.duree}</td>
                                    <td><span style={{ color: '#10b981', fontWeight: '700' }}>{tour.prix} DH</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );

    const renderAddTour = () => (
        <div className="admin-scroll-content animate-fade-in">
            <div className="admin-table-wrapper" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div className="management-header" style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                    <div className="header-title">
                        <h2><LuPlus /> Nouveau Plan de Voyage</h2>
                        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Proposez un nouveau circuit ou itinéraire à vos clients.</p>
                    </div>
                </div>
                <form className="modal-form" onSubmit={handleAddTour} style={{ padding: '2rem' }}>
                    <div className="form-grid">
                        <div className="form-group full">
                            <label>Titre du Plan</label>
                            <input
                                type="text"
                                placeholder="Ex: Journée Magique dans la Médina..."
                                value={newTour.titre}
                                onChange={e => setNewTour({ ...newTour, titre: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Destination / Ville</label>
                            {!isCustomCityTour ? (
                                <select
                                    value={newTour.destination}
                                    onChange={e => {
                                        if (e.target.value === 'other') {
                                            setIsCustomCityTour(true);
                                            setNewTour({ ...newTour, destination: '' });
                                        } else {
                                            setNewTour({ ...newTour, destination: e.target.value });
                                        }
                                    }}
                                    required
                                >
                                    <option value="">Choisir la destination</option>
                                    {cities.map(c => <option key={c.nom} value={c.nom}>{c.nom}</option>)}
                                    <option value="other">Autre (Saisir manuellement)...</option>
                                </select>
                            ) : (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Saisir la ville"
                                        value={newTour.destination}
                                        onChange={e => setNewTour({ ...newTour, destination: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsCustomCityTour(false)}
                                        style={{ padding: '0 10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
                                        title="Retour à la liste"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Durée</label>
                            <input
                                type="text"
                                placeholder="Ex: 4 heures, 2 jours..."
                                value={newTour.duree}
                                onChange={e => setNewTour({ ...newTour, duree: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Prix (DH)</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={newTour.prix}
                                onChange={e => setNewTour({ ...newTour, prix: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input
                                type="text"
                                placeholder="https://..."
                                value={newTour.image}
                                onChange={e => setNewTour({ ...newTour, image: e.target.value })}
                            />
                        </div>
                        <div className="form-group full">
                            <label>Détails de l'itinéraire</label>
                            <textarea
                                rows="4"
                                placeholder="Décrivez les lieux visités, les services inclus..."
                                value={newTour.details}
                                onChange={e => setNewTour({ ...newTour, details: e.target.value })}
                                required
                            ></textarea>
                        </div>
                    </div>
                    <div className="modal-footer" style={{ background: 'transparent', borderTop: 'none', padding: '0', marginTop: '2rem' }}>
                        <button className="btn-save" style={{ width: '100%', height: '55px', fontSize: '1.1rem' }}>
                            Publier le Plan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    const handleDeletePlan = async (planId) => {
        const userId = user.uid || user.id || user.email || 'anonymous';
        const storageKey = `my_plans_${userId}`;
        const updated = savedPlans.filter(p => p.id !== planId);
        setSavedPlans(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        try {
            await api.delete(`/my-plans/${planId}`);
        } catch (err) {
            console.warn("Failed to delete plan from Laravel backend:", err);
        }
    };

    const VIBE_LABELS = {
        cultural: { label: 'Culturel', emoji: '🏛️', color: '#c0241a' },
        luxury:   { label: 'Luxe',     emoji: '👑', color: '#b8860b' },
        adventure:{ label: 'Aventure', emoji: '🏔️', color: '#16a34a' },
        foodie:   { label: 'Gastronomie', emoji: '🍽️', color: '#ea580c' },
    };

    const renderSavedPlans = () => (
        <div className="admin-scroll-content animate-fade-in">
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #c0241a 0%, #8b0000 100%)',
                borderRadius: '16px',
                padding: '32px 36px',
                marginBottom: '28px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 8px 32px rgba(192,36,26,0.25)'
            }}>
                <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.8, marginBottom: '8px' }}>
                        📋 MES PLANS SAUVEGARDÉS
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.9rem', fontWeight: 900 }}>Mes Itinéraires</h2>
                    <p style={{ margin: '6px 0 0', opacity: 0.85, fontSize: '0.95rem' }}>
                        {savedPlans.length === 0
                            ? 'Aucun plan sauvegardé pour le moment.'
                            : `${savedPlans.length} plan${savedPlans.length > 1 ? 's' : ''} sauvegardé${savedPlans.length > 1 ? 's' : ''}`
                        }
                    </p>
                </div>
                <LuBookmark size={52} style={{ opacity: 0.25 }} />
            </div>

            {savedPlans.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '64px 24px',
                    background: '#fff', borderRadius: '16px',
                    border: '2px dashed #e5e7eb',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🗺️</div>
                    <h3 style={{ color: '#374151', marginBottom: '8px' }}>Aucun plan sauvegardé</h3>
                    <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
                        Créez votre premier itinéraire marocain personnalisé
                    </p>
                    <button
                        onClick={() => setActiveTab('myPlan')}
                        style={{
                            background: 'linear-gradient(135deg, #c0241a, #8b0000)',
                            color: '#fff', border: 'none', padding: '12px 28px',
                            borderRadius: '30px', fontWeight: 700, cursor: 'pointer',
                            fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(192,36,26,0.35)'
                        }}
                    >
                        ✨ Créer mon premier plan
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {savedPlans.map((plan, idx) => {
                        const vibe = VIBE_LABELS[plan.vibe] || { label: plan.vibe, emoji: '✈️', color: '#c0241a' };
                        const dateStr = plan.createdAt
                            ? new Date(plan.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                            : '';
                        return (
                            <div key={plan.id || idx} style={{
                                background: '#fff',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                                border: '1px solid #f3f4f6',
                                transition: 'transform 0.25s, box-shadow 0.25s',
                                position: 'relative'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(192,36,26,0.15)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'; }}
                            >
                                {/* City image banner */}
                                <div style={{
                                    height: '140px',
                                    background: plan.image
                                        ? `url(${plan.image}) center/cover no-repeat`
                                        : 'linear-gradient(135deg, #c0241a, #8b0000)',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)'
                                    }} />
                                    <div style={{
                                        position: 'absolute', bottom: '12px', left: '16px',
                                        color: '#fff', fontWeight: 900, fontSize: '1.3rem',
                                        textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                                    }}>
                                        📍 {plan.city}
                                    </div>
                                    {/* Delete button */}
                                    <button
                                        onClick={() => handleDeletePlan(plan.id)}
                                        title="Supprimer ce plan"
                                        style={{
                                            position: 'absolute', top: '10px', right: '10px',
                                            background: 'rgba(255,255,255,0.9)', border: 'none',
                                            borderRadius: '50%', width: '32px', height: '32px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', color: '#c0241a',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
                                    >
                                        <LuTrash2 size={15} />
                                    </button>
                                </div>

                                {/* Card body */}
                                <div style={{ padding: '16px 20px 20px' }}>
                                    {/* Vibe badge */}
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                                        background: `${vibe.color}15`, color: vibe.color,
                                        padding: '3px 10px', borderRadius: '20px',
                                        fontSize: '0.72rem', fontWeight: 800,
                                        letterSpacing: '0.5px', marginBottom: '12px'
                                    }}>
                                        {vibe.emoji} {vibe.label.toUpperCase()}
                                    </span>

                                    {/* Stats row */}
                                    <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
                                            <LuCalendarDays size={14} style={{ color: '#c0241a' }} />
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{plan.duration} jour{plan.duration > 1 ? 's' : ''}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
                                            <LuWallet size={14} style={{ color: '#c0241a' }} />
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{plan.totalBudget?.toLocaleString('fr-MA')} DH</span>
                                        </div>
                                    </div>

                                    {/* Days preview */}
                                    {plan.dayPlans && plan.dayPlans.length > 0 && (
                                        <div style={{
                                            background: '#fef2f2', borderRadius: '10px',
                                            padding: '10px 14px', marginBottom: '14px',
                                            borderLeft: '3px solid #c0241a'
                                        }}>
                                            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#c0241a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                                                Aperçu Jour 1
                                            </div>
                                            {[...plan.dayPlans[0].morning || [], ...plan.dayPlans[0].afternoon || []].slice(0, 2).map((item, i) => (
                                                <div key={i} style={{ fontSize: '0.8rem', color: '#374151', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    • {item.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>🗓️ {dateStr}</span>
                                        <button
                                            onClick={() => {
                                                setSelectedPlanToView(plan);
                                                setActiveTab('myPlan');
                                            }}
                                            style={{
                                                background: 'linear-gradient(135deg, #c0241a, #8b0000)',
                                                color: '#fff', border: 'none',
                                                padding: '7px 16px', borderRadius: '20px',
                                                fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer'
                                            }}
                                        >
                                            Visualiser
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );

    const renderContent = () => {
        if (activeTab === 'overview') return renderOverview();
        if (activeTab === 'services') return renderServicesList();
        if (activeTab === 'add-service') return renderAddService();
        if (activeTab === 'tours') return renderToursList();
        if (activeTab === 'add-tour') return renderAddTour();
        if (activeTab === 'profile') return renderProfile();
        if (activeTab === 'favorites') return renderFavorites();
        if (activeTab === 'myPlan') return <MyPlanPlanner user={user} initialPlan={selectedPlanToView} onPlanSaved={(plan) => setSavedPlans(prev => [plan, ...prev])} />;
        if (activeTab === 'savedPlans') return renderSavedPlans();
        if (activeTab === 'history') return renderVisitorPlaceholder('Mon Historique');
        return renderOverview();
    };

    return (
        <div className={`admin-dashboard-page ${user.userType === 'provider' ? 'provider-theme' : 'visitor-theme'}`}>
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <img src="/logo-pfe1.webp" alt="Logo" />
                        <div className="logo-text">
                            <span>MoroVista</span>
                            <small>
                                {user.userType === 'provider' && 'PARTNER'}
                                {user.userType === 'guide' && 'OFFICIAL GUIDE'}
                                {user.userType === 'user' && 'TRAVELER'}
                            </small>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => {
                                if (item.id === 'myPlan') {
                                    setSelectedPlanToView(null);
                                }
                                setActiveTab(item.id);
                            }}
                            style={{ position: 'relative' }}
                        >
                            <span className="link-icon">{item.icon}</span>
                            <span className="link-name">{item.name}</span>
                            {item.badge > 0 && (
                                <span style={{
                                    marginLeft: 'auto',
                                    background: '#c0241a',
                                    color: '#fff',
                                    borderRadius: '12px',
                                    padding: '1px 8px',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    minWidth: '20px',
                                    textAlign: 'center'
                                }}>{item.badge}</span>
                            )}
                            {activeTab === item.id && <LuChevronRight className="active-arrow" />}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="sidebar-logout" onClick={handleLogout}>
                        <LuArrowLeft /> Retour à l'accueil
                    </button>
                    <div className="admin-profile">
                        <div className="profile-img btn-save" style={{ width: '40px', height: '40px', padding: 0 }}>{user.name.charAt(0)}</div>
                        <div className="profile-info">
                            <span>{user.name}</span>
                            <small>{user.email}</small>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="admin-main">
                <div className="top-bar">
                    <div className="breadcrumb">
                        <span>Dashboard</span>
                        <LuChevronRight />
                        <span className="current">{navItems.find(n => n.id === activeTab)?.name}</span>
                    </div>
                    <div className="current-date">
                        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
                {renderContent()}
            </main>
        </div>
    );
}

export default Dashboard;
