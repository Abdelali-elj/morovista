import '../../css/dashboard.css';
import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import {
    LuLayoutDashboard,
    LuHotel,
    LuCar,
    LuUtensils,
    LuUsers,
    LuUser,
    LuPlus,
    LuTrash2,
    LuPenLine,
    LuSearch,
    LuMapPin,
    LuLogOut,
    LuTrendingUp,
    LuActivity,
    LuGlobe,
    LuBuilding2,
    LuTrees,
    LuTrophy,
    LuChevronRight,
    LuX,
    LuSave,
    LuImage,
    LuPhone,
    LuInfo,
    LuStar,
    LuPhoneCall,
    LuCheck,
    LuBan,
    LuCompass,
    LuClock,
    LuMessageSquare,
    LuBriefcase,
    LuMail,
    LuShoppingBag,
    LuTag,
} from 'react-icons/lu';

import { db } from '../../firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc, setDoc, addDoc } from 'firebase/firestore';

// Removed constant

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [data, setData] = useState({
        hotels: [],
        restaurant: [],
        transport: [],
        stadium: [],
        place: [],
        city: [],
        utilisateurs: [],
        PhoneN: [],
        localServices: [],
        tours: [],
        siteComments: [],
        souvenirs: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
            navigate('/Login');
            return;
        }

        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.role !== 'admin' && parsedUser.userType !== 'admin') {
            navigate('/Login');
        } else {
            setUser(parsedUser);
            fetchAllData();
        }
    }, [navigate]);

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            const endpointsMap = {
                hotels: '/hotels',
                restaurant: '/restaurants',
                transport: '/transports',
                stadium: '/stades',
                place: '/lieu-places',
                city: '/villes',
                utilisateurs: '/users',
                PhoneN: '/urgence-phonens',
                localServices: '/service-locals',
                tours: '/plan-tours',
                siteComments: '/commentaires',
                souvenirs: '/souvenirs'
            };

            console.log('Fetching data from endpoints:', endpointsMap);

            const results = await Promise.all(
                Object.entries(endpointsMap).map(async ([key, path]) => {
                    try {
                        console.log(`Fetching ${key} from ${path}...`);
                        const res = await api.get(path);
                        console.log(`Success fetching ${key}:`, res.data);
                        return { key, data: Array.isArray(res.data) ? res.data : [] };
                    } catch (e) {
                        console.error(`Error fetching ${key}:`, e);
                        return { key, data: [] };
                    }
                })
            );

            const newData = {};
            results.forEach(r => {
                newData[r.key] = r.data;
                console.log(`${r.key} loaded with ${r.data.length} items`);
            });

            console.log('Final data structure:', newData);
            setData(newData);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const navItems = [
        { id: 'overview', name: 'Aperçu', icon: <LuLayoutDashboard /> },
        { id: 'hotels', name: 'Hotels', icon: <LuHotel /> },
        { id: 'restaurant', name: 'Restaurants', icon: <LuUtensils /> },
        { id: 'place', name: 'Places / Lieux', icon: <LuTrees /> },
        { id: 'stadium', name: 'Stades', icon: <LuTrophy /> },
        { id: 'tours', name: 'Tours / Plans', icon: <LuCompass /> },
        { id: 'transport', name: 'Transport', icon: <LuCar /> },
        { id: 'localServices', name: 'Services Locaux', icon: <LuBriefcase /> },
        { id: 'PhoneN', name: 'Urgences', icon: <LuPhoneCall /> },
        { id: 'souvenirs', name: 'Souvenirs', icon: <LuShoppingBag /> },
        { id: 'siteComments', name: 'Commentaires', icon: <LuMessageSquare /> },
        { id: 'utilisateurs', name: 'Users', icon: <LuUsers /> }
    ];

    const handleDelete = async (type, id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
            try {
                const endpointsMap = {
                    hotels: '/hotels',
                    restaurant: '/restaurants',
                    transport: '/transports',
                    stadium: '/stades',
                    place: '/lieu-places',
                    city: '/villes',
                    utilisateurs: '/users',
                    PhoneN: '/urgence-phonens',
                    localServices: '/service-locals',
                    tours: '/plan-tours',
                    siteComments: '/commentaires',
                    souvenirs: '/souvenirs'
                };
                const endpoint = endpointsMap[type] || `/${type}`;
                await api.delete(`${endpoint}/${id}`);

                setData(prev => ({
                    ...prev,
                    [type]: prev[type].filter(item => item.id !== id)
                }));
            } catch (error) {
                console.error('Delete error:', error);
                alert("Erreur lors de la suppression. Vérifiez la console.");
            }
        }
    };

    const handleStatusUpdate = async (id, newStatus, currentType = 'localServices') => {
        try {
            const endpointsMap = {
                localServices: '/service-locals',
                utilisateurs: '/users'
            };
            const endpoint = endpointsMap[currentType] || `/${currentType}`;
            const res = await api.put(`${endpoint}/${id}`, { status: newStatus });

            setData(prev => ({
                ...prev,
                [currentType]: prev[currentType].map(i => i.id === id ? { ...i, ...res.data, status: newStatus } : i)
            }));
        } catch (error) {
            console.error('Status update error:', error);
            alert("Erreur lors de la mise à jour du statut.");
        }
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        if (item) {
            setFormData({ ...item });
        } else {
            // Smart defaults based on type
            const defaults = { nom: '', photo: '' };
            if (activeTab === 'localServices') defaults.status = 'pending';
            if (activeTab === 'souvenirs') {
                defaults.name = '';
                defaults.category = '';
                defaults.origin = '';
                defaults.price = '';
                defaults.badge = '';
                defaults.description = '';
                defaults.image = '';
                defaults.tag = '';
            }
            if (activeTab === 'city') {
                defaults.nom = '';
                defaults.photo = '';
            } else if (data.city && data.city[0]) {
                defaults.ville = data.city[0].nom;
            }

            setFormData(defaults);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const type = activeTab;

        let finalData = { ...formData };

        if (type === 'souvenirs') {
            try {
                finalData.price = Number(finalData.price) || 0;
                if (editingItem) {
                    const res = await api.put(`/souvenirs/${editingItem.id}`, finalData);
                    setData(prev => ({
                        ...prev,
                        souvenirs: prev.souvenirs.map(item => item.id === editingItem.id ? { ...item, ...res.data } : item)
                    }));
                } else {
                    const res = await api.post('/souvenirs', finalData);
                    setData(prev => ({
                        ...prev,
                        souvenirs: [...prev.souvenirs, res.data]
                    }));
                }
                setIsModalOpen(false);
                return;
            } catch (error) {
                console.error('Souvenirs submit error:', error);
                alert("Erreur d'enregistrement des souvenirs. Vérifiez la console.");
                return;
            }
        }

        // Map fields for Laravel compatibility
        if (type === 'hotels' || type === 'restaurant') {
            finalData.photo_url = formData.photo || formData.photo_url;
            finalData.adresse = formData.adress || formData.adresse;
        } else if (type === 'stadium') {
            finalData.image_url = formData.image || formData.image_url;
            finalData.adresse = formData.adress || formData.adresse;
        } else if (type === 'place') {
            finalData.image_url = formData.image || formData.image_url;
            finalData.description = formData.description;
        } else if (type === 'tours') {
            finalData.image_url = formData.image || formData.image_url;
            finalData.details = formData.details;
        } else if (type === 'transport') {
            finalData.type_vehicule = formData.type;
            finalData.photo_url = formData.photo || formData.photo_url;
            finalData.description = formData.desc;
        } else if (type === 'localServices') {
            finalData.image_url = formData.photo || formData.image || formData.image_url;
        } else if (type === 'PhoneN') {
            finalData.service_nom = formData.nom;
            finalData.numero = formData.num;
        } else if (type === 'city') {
            finalData.image_url = formData.photo || formData.image || formData.image_url;
        } else if (type === 'utilisateurs') {
            finalData.role = formData.userType;
        } else if (type === 'siteComments') {
            finalData.auteur_nom = formData.user;
            finalData.note = formData.rating;
            finalData.contenu = formData.text;
        }

        try {
            const endpointsMap = {
                hotels: '/hotels',
                restaurant: '/restaurants',
                transport: '/transports',
                stadium: '/stades',
                place: '/lieu-places',
                city: '/villes',
                utilisateurs: '/users',
                PhoneN: '/urgence-phonens',
                localServices: '/service-locals',
                tours: '/plan-tours',
                siteComments: '/commentaires'
            };
            const endpoint = endpointsMap[type] || `/${type}`;

            if (editingItem) {
                const res = await api.put(`${endpoint}/${editingItem.id}`, finalData);
                setData(prev => ({
                    ...prev,
                    [type]: prev[type].map(item => item.id === editingItem.id ? { ...item, ...res.data } : item)
                }));
            } else {
                const res = await api.post(endpoint, finalData);
                setData(prev => ({
                    ...prev,
                    [type]: [...prev[type], res.data]
                }));
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Submit error:', error);
            alert('Erreur lors de l\'enregistrement. Vérifiez la console.');
        }
    };

    const renderOverview = () => {
        const allStats = [
            { id: 'hotels', title: 'Hôtels', icon: <LuHotel />, color: '#ef4444', bg: '#fef2f2', desc: 'Hébergements' },
            { id: 'restaurant', title: 'Restaurants', icon: <LuUtensils />, color: '#22c55e', bg: '#f0fdf4', desc: 'Restauration' },
            { id: 'utilisateurs', title: 'Utilisateurs', icon: <LuUsers />, color: '#3b82f6', bg: '#eff6ff', desc: 'Comptes inscrits' },
            { id: 'tours', title: 'Plans / Tours', icon: <LuCompass />, color: '#f59e0b', bg: '#fffbeb', desc: 'Circuits touristiques' },
            { id: 'place', title: 'Lieux', icon: <LuTrees />, color: '#8b5cf6', bg: '#f5f3ff', desc: 'Points d\'intérêt' },
            { id: 'stadium', title: 'Stades', icon: <LuTrophy />, color: '#ec4899', bg: '#fdf2f8', desc: 'Infrastructures' },
            { id: 'transport', title: 'Transports', icon: <LuCar />, color: '#0ea5e9', bg: '#f0f9ff', desc: 'Véhicules' },
            { id: 'localServices', title: 'Services Locaux', icon: <LuBriefcase />, color: '#10b981', bg: '#ecfdf5', desc: 'Prestataires' },
            { id: 'PhoneN', title: 'Urgences', icon: <LuPhoneCall />, color: '#f43f5e', bg: '#fff1f2', desc: 'Numéros d\'urgence' },
            { id: 'city', title: 'Villes', icon: <LuGlobe />, color: '#6366f1', bg: '#eef2ff', desc: 'Destinations' },
            { id: 'siteComments', title: 'Commentaires', icon: <LuMessageSquare />, color: '#64748b', bg: '#f8fafc', desc: 'Avis visiteurs' },
            { id: 'souvenirs', title: 'Souvenirs', icon: <LuShoppingBag />, color: '#d97706', bg: '#fefce8', desc: 'Boutique' },
        ];

        const totalCount = allStats.reduce((acc, s) => acc + (data[s.id]?.length || 0), 0) || 1;
        const latestComments = (data.siteComments || []).slice(0, 4);
        const pendingServices = (data.localServices || []).filter(s => s.status === 'pending');
        const pendingUsers = (data.utilisateurs || []).filter(u => u.status === 'pending');

        // City enriched stats
        const cityRows = (data.city || []).map(c => ({
            nom: c.nom,
            hotels: data.hotels.filter(h => (h.ville_name || h.ville) === c.nom).length,
            restau: data.restaurant.filter(r => (r.ville_name || r.ville) === c.nom).length,
            places: data.place.filter(p => (p.ville_name || p.ville) === c.nom).length,
            stades: data.stadium.filter(s => (s.ville_name || s.ville) === c.nom).length,
        }));
        const maxCityTotal = Math.max(...cityRows.map(r => r.hotels + r.restau + r.places + r.stades), 1);

        // User role breakdown
        const roleMap = {};
        (data.utilisateurs || []).forEach(u => {
            const r = u.role || u.userType || 'user';
            roleMap[r] = (roleMap[r] || 0) + 1;
        });

        return (
            <div className="admin-overview animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* ── Row 1: 12 KPI cards ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                    {allStats.map(stat => {
                        const count = data[stat.id]?.length || 0;
                        const pct = Math.round((count / totalCount) * 100);
                        return (
                            <div
                                key={stat.id}
                                className="stat-card-glass"
                                onClick={() => setActiveTab(stat.id)}
                                style={{
                                    background: stat.bg,
                                    border: `1.5px solid ${stat.color}22`,
                                    borderRadius: '18px',
                                    padding: '1.4rem 1.2rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.7rem',
                                    transition: 'all 0.25s ease',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '42px', height: '42px', borderRadius: '12px',
                                        background: `${stat.color}18`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.2rem', color: stat.color, flexShrink: 0
                                    }}>
                                        {stat.icon}
                                    </div>
                                    <span style={{
                                        fontSize: '0.7rem', fontWeight: '800', color: stat.color,
                                        background: `${stat.color}15`, padding: '0.15rem 0.5rem',
                                        borderRadius: '50px', letterSpacing: '0.5px'
                                    }}>{pct}%</span>
                                </div>
                                <div>
                                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a', lineHeight: 1, fontFamily: 'Outfit,sans-serif', letterSpacing: '-1px' }}>{count}</div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', marginTop: '0.15rem' }}>{stat.title}</div>
                                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{stat.desc}</div>
                                </div>
                                <div style={{ height: '4px', background: `${stat.color}20`, borderRadius: '50px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${pct}%`, background: stat.color, borderRadius: '50px', transition: 'width 1s ease' }}></div>
                                </div>
                                {/* Decorative glow */}
                                <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '70px', height: '70px', borderRadius: '50%', background: `${stat.color}12`, pointerEvents: 'none' }}></div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Row 2: City table + Right panels ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>

                    {/* Left: City-by-city breakdown table */}
                    <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                        <div style={{ padding: '1.5rem 1.8rem 1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>Répartition par Ville</h3>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>Hôtels · Restaus · Lieux · Stades par destination</p>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#c0241a', background: '#fee2e2', padding: '0.3rem 0.7rem', borderRadius: '50px' }}>
                                {data.city.length} villes
                            </span>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.87rem' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc' }}>
                                        {['Ville', 'Hôtels', 'Restaus', 'Lieux', 'Stades', 'Score'].map(h => (
                                            <th key={h} style={{ padding: '0.8rem 1.2rem', textAlign: 'left', fontWeight: '700', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {cityRows.length === 0 ? (
                                        <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>Aucune ville disponible</td></tr>
                                    ) : cityRows.map((row, i) => {
                                        const total = row.hotels + row.restau + row.places + row.stades;
                                        const barW = Math.round((total / maxCityTotal) * 100);
                                        return (
                                            <tr key={row.nom} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafbff' }}>
                                                <td style={{ padding: '0.9rem 1.2rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <LuMapPin size={13} color="#c0241a" /> {row.nom}
                                                </td>
                                                <td style={{ padding: '0.9rem 1.2rem', fontWeight: '700', color: '#ef4444' }}>{row.hotels}</td>
                                                <td style={{ padding: '0.9rem 1.2rem', fontWeight: '700', color: '#22c55e' }}>{row.restau}</td>
                                                <td style={{ padding: '0.9rem 1.2rem', fontWeight: '700', color: '#8b5cf6' }}>{row.places}</td>
                                                <td style={{ padding: '0.9rem 1.2rem', fontWeight: '700', color: '#ec4899' }}>{row.stades}</td>
                                                <td style={{ padding: '0.9rem 1.2rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                        <div style={{ flex: 1, height: '6px', background: '#f1f5f9', borderRadius: '50px', overflow: 'hidden', minWidth: '60px' }}>
                                                            <div style={{ height: '100%', width: `${barW}%`, background: 'linear-gradient(90deg,#c0241a,#f43f5e)', borderRadius: '50px', transition: 'width 0.8s ease' }}></div>
                                                        </div>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#c0241a', minWidth: '20px' }}>{total}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                        {/* User roles doughnut-style breakdown */}
                        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1.4rem', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                            <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>Profils Utilisateurs</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {[{ role: 'admin', label: 'Admins', color: '#ef4444' }, { role: 'user', label: 'Visiteurs', color: '#3b82f6' }, { role: 'provider', label: 'Prestataires', color: '#22c55e' }, { role: 'guide', label: 'Guides', color: '#f59e0b' }].map(r => {
                                    const cnt = roleMap[r.role] || 0;
                                    const total = data.utilisateurs?.length || 1;
                                    const pct = Math.round((cnt / total) * 100);
                                    return (
                                        <div key={r.role} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                                            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', width: '75px', flexShrink: 0 }}>{r.label}</span>
                                            <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '50px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${pct}%`, background: r.color, borderRadius: '50px', transition: 'width 0.8s ease' }}></div>
                                            </div>
                                            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: r.color, width: '28px', textAlign: 'right' }}>{cnt}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Approvals pending */}
                        {(pendingServices.length > 0 || pendingUsers.length > 0) && (
                            <div style={{ background: '#fffbeb', borderRadius: '20px', border: '1px solid #fde68a', padding: '1.3rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                                <h3 style={{ margin: '0 0 0.8rem', fontSize: '0.9rem', fontWeight: '800', color: '#92400e' }}>⏳ En attente d'approbation</h3>
                                <div style={{ display: 'flex', gap: '0.7rem' }}>
                                    <div style={{ flex: 1, textAlign: 'center', padding: '0.8rem', background: 'white', borderRadius: '12px', border: '1px solid #fde68a' }}>
                                        <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#d97706', fontFamily: 'Outfit,sans-serif' }}>{pendingServices.length}</div>
                                        <div style={{ fontSize: '0.72rem', color: '#92400e', fontWeight: '700' }}>Services</div>
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'center', padding: '0.8rem', background: 'white', borderRadius: '12px', border: '1px solid #fde68a' }}>
                                        <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#d97706', fontFamily: 'Outfit,sans-serif' }}>{pendingUsers.length}</div>
                                        <div style={{ fontSize: '0.72rem', color: '#92400e', fontWeight: '700' }}>Comptes</div>
                                    </div>
                                </div>
                                <button onClick={() => setActiveTab('localServices')} style={{ marginTop: '0.8rem', width: '100%', padding: '0.6rem', borderRadius: '10px', border: 'none', background: '#f59e0b', color: 'white', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>
                                    Gérer les approbations
                                </button>
                            </div>
                        )}

                        {/* Quick actions */}
                        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1.4rem', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                            <h3 style={{ margin: '0 0 0.9rem', fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>Ajouts Rapides</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                                {[
                                    { tab: 'hotels', label: 'Hôtel', icon: <LuHotel />, color: '#ef4444' },
                                    { tab: 'restaurant', label: 'Restau', icon: <LuUtensils />, color: '#22c55e' },
                                    { tab: 'place', label: 'Lieu', icon: <LuTrees />, color: '#8b5cf6' },
                                    { tab: 'tours', label: 'Tour', icon: <LuCompass />, color: '#f59e0b' },
                                    { tab: 'transport', label: 'Transport', icon: <LuCar />, color: '#0ea5e9' },
                                    { tab: 'city', label: 'Ville', icon: <LuGlobe />, color: '#6366f1' },
                                ].map(btn => (
                                    <button key={btn.tab} onClick={() => { setActiveTab(btn.tab); openModal(); }} style={{
                                        padding: '0.65rem 0.5rem', borderRadius: '10px',
                                        border: `1.5px solid ${btn.color}22`,
                                        background: `${btn.color}08`, cursor: 'pointer',
                                        fontWeight: '700', fontSize: '0.78rem',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        gap: '0.35rem', color: btn.color,
                                        transition: 'all 0.2s ease'
                                    }}>
                                        {btn.icon} {btn.label}
                                    </button>
                                ))}
                            </div>
                            <button onClick={fetchAllData} style={{
                                marginTop: '0.8rem', width: '100%', padding: '0.65rem',
                                borderRadius: '10px', border: 'none',
                                background: 'linear-gradient(135deg,#c0241a,#e53e3e)',
                                color: 'white', fontWeight: '700', fontSize: '0.82rem',
                                cursor: 'pointer', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: '0.5rem',
                                boxShadow: '0 4px 12px rgba(192,36,26,0.25)'
                            }}>
                                🔄 Actualiser les données
                            </button>
                        </div>

                        {/* Recent comments */}
                        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1.4rem', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                            <h3 style={{ margin: '0 0 0.9rem', fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>Derniers Avis</h3>
                            {latestComments.length === 0 ? (
                                <p style={{ color: '#94a3b8', fontSize: '0.82rem', fontStyle: 'italic', margin: 0 }}>Aucun commentaire.</p>
                            ) : latestComments.map((com, idx) => (
                                <div key={com.id || idx} style={{ padding: '0.7rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9', marginBottom: idx < latestComments.length - 1 ? '0.5rem' : 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                                        <span style={{ fontWeight: '700', fontSize: '0.78rem', color: '#1e293b' }}>{com.auteur_nom || com.user || 'Voyageur'}</span>
                                        <span style={{ fontSize: '0.72rem', color: '#eab308', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                            <LuStar fill="#eab308" size={10} /> {com.note || com.rating || 5}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        "{com.contenu || com.text || ''}"
                                    </p>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        );
    };

    const renderManagementView = (type) => {
        const items = data[type] || [];
        const filteredItems = items.filter(item =>
            item && (
                (item.nom || item.name || item.email || item.type || item.titre || item.user || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.ville || item.destination || item.origin || item.type_vehicule || item.service_nom || '').toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        const safeRender = (value) => {
            if (typeof value === 'object' && value !== null) return '-';
            return value || '-';
        };

        const renderStars = (rating) => {
            const count = Math.min(5, Math.max(1, Number(rating) || 5));
            return (
                <div style={{ display: 'flex', gap: '2px', color: '#eab308' }}>
                    {Array.from({ length: count }).map((_, i) => (
                        <LuStar key={i} fill="#eab308" size={14} />
                    ))}
                </div>
            );
        };

        return (
            <div className="admin-management animate-fade-in" style={{ padding: '2rem' }}>
                <div className="management-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div className="header-title">
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                            Gestion des {navItems.find(n => n.id === type)?.name}
                        </h2>
                        <span className="count-badge" style={{ background: '#e2e8f0', padding: '0.2rem 0.8rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginTop: '0.3rem', display: 'inline-block' }}>
                            {filteredItems.length} total
                        </span>
                    </div>
                    <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="search-box" style={{ position: 'relative' }}>
                            <LuSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                            <input
                                type="text"
                                placeholder={`Rechercher...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ padding: '0.8rem 1rem 0.8rem 3rem', borderRadius: '12px', border: '1px solid #cbd5e1', width: '280px', fontSize: '0.9rem', outline: 'none' }}
                            />
                        </div>
                        {type !== 'siteComments' && (
                            <button className="add-btn" onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#c0241a', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(192, 36, 26, 0.2)' }}>
                                <LuPlus /> Ajouter
                            </button>
                        )}
                    </div>
                </div>

                <div className="content-card glass-morph no-padding" style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                    <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
                        {isLoading ? (
                            <div className="loading-table" style={{ padding: '4rem', textAlign: 'center', color: '#64748b', fontSize: '1.1rem', fontWeight: '600' }}>Chargement...</div>
                        ) : (
                            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                        {type === 'city' && (
                                            <>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Ville</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Lien Image</th>
                                            </>
                                        )}
                                        {type === 'hotels' && (
                                            <>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Hôtel</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Ville</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Adresse</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Contact / Email</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Tarif</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Catégorie</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Likes</th>
                                            </>
                                        )}
                                        {type === 'restaurant' && (
                                            <>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Restaurant</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Ville</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Adresse</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Contact / Email</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Spécialité</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Budget Moyen</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Likes</th>
                                            </>
                                        )}
                                        {type === 'place' && (
                                            <>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Lieu</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Ville</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Description</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Likes</th>
                                            </>
                                        )}
                                        {type === 'stadium' && (
                                            <>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Stade</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Ville</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Adresse</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Capacité</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Contact</th>
                                            </>
                                        )}
                                        {type === 'tours' && (
                                            <>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Plan / Tour</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Destination</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Durée</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Prix</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Créé par</th>
                                            </>
                                        )}
                                        {type === 'transport' && (
                                            <>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Véhicule</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Description</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Lien de réservation</th>
                                            </>
                                        )}
                                        {type === 'localServices' && (
                                            <>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Service</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Ville</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Adresse</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Propriétaire</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Contact</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Statut</th>
                                            </>
                                        )}
                                        {type === 'PhoneN' && (
                                            <>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Service Urgence</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Numéro de téléphone</th>
                                            </>
                                        )}
                                        {type === 'souvenirs' && (
                                            <>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Produit</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Provenance</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Boutique / Catégorie</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Prix</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Tag / Badge</th>
                                            </>
                                        )}
                                        {type === 'siteComments' && (
                                            <>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Utilisateur</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Évaluation</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Message / Commentaire</th>
                                            </>
                                        )}
                                        {type === 'utilisateurs' && (
                                            <>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Utilisateur</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Email</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Rôle</th>
                                                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Statut Approbation</th>
                                            </>
                                        )}
                                        <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', color: '#475569', width: '120px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.map((item, idx) => {
                                        if (!item) return null;
                                        const uniqueKey = item.id || item._id || `${type}-${idx}-${item.nom || item.name || ''}`;

                                        return (
                                            <tr key={uniqueKey} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                                                {type === 'city' && (
                                                    <>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                <img src={item.image_url || 'https://via.placeholder.com/45'} alt={item.nom} style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                                                                <span style={{ fontWeight: '700', color: '#0f172a' }}>{safeRender(item.nom)}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', color: '#64748b', fontSize: '0.85rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {safeRender(item.image_url)}
                                                        </td>
                                                    </>
                                                )}
                                                {type === 'hotels' && (
                                                    <>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                <img src={item.photo_url || 'https://via.placeholder.com/45'} alt={item.nom} style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                                                                <span style={{ fontWeight: '700', color: '#0f172a' }}>{safeRender(item.nom)}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', color: '#1e293b' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                                                                <LuMapPin size={12} color="#c0241a" /> {safeRender(item.ville_name || item.ville)}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', color: '#64748b', fontSize: '0.85rem' }}>{safeRender(item.adresse)}</td>
                                                        <td style={{ padding: '1.2rem', fontSize: '0.85rem' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span style={{ fontWeight: '600' }}><LuPhone size={12} /> {safeRender(item.contact)}</span>
                                                                <span style={{ color: '#64748b' }}>{safeRender(item.email)}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <span style={{ background: '#dcfce7', color: '#15803d', padding: '0.3rem 0.6rem', borderRadius: '8px', fontWeight: '800', fontSize: '0.85rem' }}>
                                                                {item.prix_chambre ? `${item.prix_chambre} DH` : 'N/A'}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <span style={{ background: '#fef3c7', color: '#b45309', padding: '0.3rem 0.6rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.8rem' }}>
                                                                {safeRender(item.categorie)}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', fontWeight: '700', color: '#ef4444' }}>
                                                            ❤️ {item.likes || 0}
                                                        </td>
                                                    </>
                                                )}
                                                {type === 'restaurant' && (
                                                    <>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                <img src={item.photo_url || 'https://via.placeholder.com/45'} alt={item.nom} style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                                                                <span style={{ fontWeight: '700', color: '#0f172a' }}>{safeRender(item.nom)}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', color: '#1e293b' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                                                                <LuMapPin size={12} color="#c0241a" /> {safeRender(item.ville_name || item.ville)}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', color: '#64748b', fontSize: '0.85rem' }}>{safeRender(item.adresse)}</td>
                                                        <td style={{ padding: '1.2rem', fontSize: '0.85rem' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span style={{ fontWeight: '600' }}><LuPhone size={12} /> {safeRender(item.contact)}</span>
                                                                <span style={{ color: '#64748b' }}>{safeRender(item.email)}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>
                                                            {safeRender(item.categorie || item.cuisine)}
                                                        </td>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.3rem 0.6rem', borderRadius: '8px', fontWeight: '800', fontSize: '0.85rem' }}>
                                                                {item.prix_moyen ? `${item.prix_moyen} DH` : 'N/A'}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', fontWeight: '700', color: '#ef4444' }}>
                                                            ❤️ {item.likes || 0}
                                                        </td>
                                                    </>
                                                )}
                                                {type === 'place' && (
                                                    <>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                <img src={item.image_url || 'https://via.placeholder.com/45'} alt={item.nom} style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                                                                <span style={{ fontWeight: '700', color: '#0f172a' }}>{safeRender(item.nom)}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', color: '#1e293b' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                                                                <LuMapPin size={12} color="#c0241a" /> {safeRender(item.ville_name || item.ville)}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', color: '#64748b', fontSize: '0.85rem', maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {safeRender(item.description)}
                                                        </td>
                                                        <td style={{ padding: '1.2rem', fontWeight: '700', color: '#ef4444' }}>
                                                            ❤️ {item.likes || 0}
                                                        </td>
                                                    </>
                                                )}
                                                {type === 'stadium' && (
                                                    <>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                <img src={item.image_url || 'https://via.placeholder.com/45'} alt={item.nom} style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                                                                <span style={{ fontWeight: '700', color: '#0f172a' }}>{safeRender(item.nom)}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', color: '#1e293b' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                                                                <LuMapPin size={12} color="#c0241a" /> {safeRender(item.ville_name || item.ville)}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', color: '#64748b', fontSize: '0.85rem' }}>{safeRender(item.adresse)}</td>
                                                        <td style={{ padding: '1.2rem', fontWeight: '700', color: '#0f172a' }}>
                                                            {item.capacite ? `${Number(item.capacite).toLocaleString()} places` : 'N/A'}
                                                        </td>
                                                        <td style={{ padding: '1.2rem', fontSize: '0.85rem', fontWeight: '600' }}>
                                                            <LuPhone size={12} /> {safeRender(item.contact)}
                                                        </td>
                                                    </>
                                                )}
                                                {type === 'tours' && (
                                                    <>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                <img src={item.image_url || 'https://via.placeholder.com/45'} alt={item.titre} style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                                                                <span style={{ fontWeight: '700', color: '#0f172a' }}>{safeRender(item.titre)}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', color: '#1e293b' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                                                                <LuMapPin size={12} color="#c0241a" /> {safeRender(item.ville_name || item.ville || item.destination)}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', fontWeight: '600', color: '#475569' }}>
                                                            <LuClock size={12} /> {safeRender(item.duree)}
                                                        </td>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <span style={{ background: '#dcfce7', color: '#15803d', padding: '0.3rem 0.6rem', borderRadius: '8px', fontWeight: '800', fontSize: '0.85rem' }}>
                                                                {item.prix ? `${item.prix} DH` : 'Gratuit'}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', color: '#64748b', fontSize: '0.85rem' }}>
                                                            {safeRender(item.addedBy)}
                                                        </td>
                                                    </>
                                                )}
                                                {type === 'transport' && (
                                                    <>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                <img src={item.photo_url || 'https://via.placeholder.com/45'} alt={item.type_vehicule} style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                                                                <span style={{ fontWeight: '700', color: '#0f172a' }}>{safeRender(item.type_vehicule || item.type)}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', color: '#64748b', fontSize: '0.85rem', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {safeRender(item.description || item.desc)}
                                                        </td>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            {item.lien ? (
                                                                <a href={item.lien} target="_blank" rel="noopener noreferrer" style={{ color: '#c0241a', fontWeight: '700', textDecoration: 'none', fontSize: '0.85rem' }}>
                                                                    Lien de réservation 🔗
                                                                </a>
                                                            ) : '-'}
                                                        </td>
                                                    </>
                                                )}
                                                {type === 'localServices' && (
                                                    <>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                <img src={item.image_url || item.photo || 'https://via.placeholder.com/45'} alt={item.nom} style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                    <span style={{ fontWeight: '700', color: '#0f172a' }}>{safeRender(item.nom)}</span>
                                                                    <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px', alignSelf: 'flex-start', marginTop: '0.2rem' }}>{safeRender(item.type)}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', color: '#1e293b' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                                                                <LuMapPin size={12} color="#c0241a" /> {safeRender(item.ville)}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', color: '#64748b', fontSize: '0.85rem' }}>{safeRender(item.adresse)}</td>
                                                        <td style={{ padding: '1.2rem', color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>{safeRender(item.proprietaire)}</td>
                                                        <td style={{ padding: '1.2rem', fontSize: '0.85rem' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span style={{ fontWeight: '600' }}><LuPhone size={12} /> {safeRender(item.telephone)}</span>
                                                                <span style={{ color: '#64748b' }}>{safeRender(item.addedBy)}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <span style={{
                                                                padding: '0.3rem 0.6rem',
                                                                borderRadius: '50px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '800',
                                                                textTransform: 'uppercase',
                                                                background: item.status === 'accepted' ? '#dcfce7' : (item.status === 'rejected' ? '#fee2e2' : '#fef3c7'),
                                                                color: item.status === 'accepted' ? '#15803d' : (item.status === 'rejected' ? '#b91c1c' : '#b45309')
                                                            }}>
                                                                {item.status === 'accepted' ? 'Accepté' : (item.status === 'rejected' ? 'Refusé' : 'En attente')}
                                                            </span>
                                                        </td>
                                                    </>
                                                )}
                                                {type === 'PhoneN' && (
                                                    <>
                                                        <td style={{ padding: '1.2rem', fontWeight: '700', color: '#1e293b' }}>
                                                            {safeRender(item.service_nom || item.nom)}
                                                        </td>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <a href={`tel:${item.numero || item.num}`} style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.4rem 1rem', borderRadius: '50px', fontWeight: '800', fontSize: '0.95rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                📞 {safeRender(item.numero || item.num)}
                                                            </a>
                                                        </td>
                                                    </>
                                                )}
                                                {type === 'souvenirs' && (
                                                    <>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                <img src={item.image || 'https://via.placeholder.com/45'} alt={item.name} style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                                                                <span style={{ fontWeight: '700', color: '#0f172a' }}>{safeRender(item.name || item.nom)}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', color: '#1e293b' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                                                                <LuMapPin size={12} color="#c0241a" /> {safeRender(item.origin)}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', color: '#475569', fontWeight: '600', fontSize: '0.85rem' }}>
                                                            {safeRender(item.category)}
                                                        </td>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <span style={{ background: '#dcfce7', color: '#15803d', padding: '0.3rem 0.6rem', borderRadius: '8px', fontWeight: '800', fontSize: '0.85rem' }}>
                                                                {item.price ? `${item.price} MAD` : 'N/A'}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                                                                {item.tag && <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>{item.tag}</span>}
                                                                {item.badge && <span style={{ background: 'rgba(192, 36, 26, 0.1)', color: '#c0241a', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>{item.badge}</span>}
                                                            </div>
                                                        </td>
                                                    </>
                                                )}
                                                {type === 'siteComments' && (
                                                    <>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                                <div style={{ width: '36px', height: '36px', background: '#c0241a', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                                                                    {(item.auteur_nom || item.user || 'V').charAt(0).toUpperCase()}
                                                                </div>
                                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                    <span style={{ fontWeight: '700', color: '#0f172a' }}>{safeRender(item.auteur_nom || item.user)}</span>
                                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{safeRender(item.pays || 'Maroc')}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            {renderStars(item.note || item.rating)}
                                                        </td>
                                                        <td style={{ padding: '1.2rem', color: '#475569', fontStyle: 'italic', fontSize: '0.85rem', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            "{safeRender(item.contenu || item.text)}"
                                                        </td>
                                                    </>
                                                )}
                                                {type === 'utilisateurs' && (
                                                    <>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                                <div style={{ width: '36px', height: '36px', background: '#3b82f6', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                                                                    {(item.name || item.nom || 'U').charAt(0).toUpperCase()}
                                                                </div>
                                                                <span style={{ fontWeight: '700', color: '#0f172a' }}>{safeRender(item.name || item.nom)}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.2rem', color: '#64748b', fontSize: '0.85rem' }}>{safeRender(item.email)}</td>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <span style={{
                                                                padding: '0.2rem 0.6rem',
                                                                borderRadius: '8px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '800',
                                                                textTransform: 'uppercase',
                                                                background: item.userType === 'admin' || item.role === 'admin' ? '#fee2e2' : (item.userType === 'provider' || item.role === 'provider' ? '#e0f2fe' : (item.userType === 'guide' || item.role === 'guide' ? '#fef3c7' : '#f1f5f9')),
                                                                color: item.userType === 'admin' || item.role === 'admin' ? '#b91c1c' : (item.userType === 'provider' || item.role === 'provider' ? '#0369a1' : (item.userType === 'guide' || item.role === 'guide' ? '#b45309' : '#475569'))
                                                            }}>
                                                                {safeRender(item.role || item.userType)}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '1.2rem' }}>
                                                            <span style={{
                                                                padding: '0.3rem 0.6rem',
                                                                borderRadius: '50px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '800',
                                                                textTransform: 'uppercase',
                                                                background: item.status === 'accepted' ? '#dcfce7' : (item.status === 'rejected' ? '#fee2e2' : '#fef3c7'),
                                                                color: item.status === 'accepted' ? '#15803d' : (item.status === 'rejected' ? '#b91c1c' : '#b45309')
                                                            }}>
                                                                {item.status === 'accepted' ? 'Accepté' : (item.status === 'rejected' ? 'Refusé' : 'En attente')}
                                                            </span>
                                                        </td>
                                                    </>
                                                )}
                                                <td style={{ padding: '1.2rem' }}>
                                                    {type === 'localServices' || (type === 'utilisateurs' && ['provider', 'guide'].includes(item.role || item.userType)) ? (
                                                        <div className="approval-actions" style={{ display: 'flex', gap: '0.4rem' }}>
                                                            {item.status !== 'accepted' && (
                                                                <button className="action-btn approve" title="Accepter" onClick={() => handleStatusUpdate(item.id, 'accepted', type)} style={{ background: '#dcfce7', color: '#16a34a', border: 'none', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                                    <LuCheck size={16} />
                                                                </button>
                                                            )}
                                                            {item.status !== 'rejected' && (
                                                                <button className="action-btn reject" title="Refuser" onClick={() => handleStatusUpdate(item.id, 'rejected', type)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                                    <LuBan size={16} />
                                                                </button>
                                                            )}
                                                            <button className="action-btn delete" title="Supprimer" onClick={() => handleDelete(type, item.id)} style={{ background: '#f1f5f9', color: '#64748b', border: 'none', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                                <LuTrash2 size={16} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                            {type !== 'siteComments' && (
                                                                <button className="action-btn edit" title="Modifier" onClick={() => openModal(item)} style={{ background: '#e0f2fe', color: '#0284c7', border: 'none', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                                    <LuPenLine size={16} />
                                                                </button>
                                                            )}
                                                            <button className="action-btn delete" title="Supprimer" onClick={() => handleDelete(type, item.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                                <LuTrash2 size={16} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredItems.length === 0 && (
                                        <tr>
                                            <td colSpan="20" className="empty-row" style={{ padding: '4rem', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>Aucun résultat trouvé</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="admin-dashboard-page">
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
            )}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <img src="/logo-pfe1.webp" alt="Logo" />
                        <div className="logo-text">
                            <span>MoroVista</span>
                            <small>ADMIN PLATFORM</small>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => { setActiveTab(item.id); setSearchTerm(''); }}
                        >
                            <span className="link-icon">{item.icon}</span>
                            <span className="link-name">{item.name}</span>
                            {activeTab === item.id && <LuChevronRight className="active-arrow" />}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="sidebar-logout" onClick={() => navigate('/')}>
                        <LuLogOut /> Quitter le Panel
                    </button>
                    <div className="admin-profile">
                        <div className="profile-img">A</div>
                        <div className="profile-info">
                            <span>Admin Root</span>
                            <small>Super Admin</small>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="admin-main">
                <div className="top-bar">
                    <div className="top-bar-left">
                        <button className="hamburger-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            {sidebarOpen ? <LuX /> : <LuLayoutDashboard />}
                        </button>
                        <div className="breadcrumb">
                            <span>Dashboard</span>
                            <LuChevronRight />
                            <span className="current">{navItems.find(n => n.id === activeTab)?.name}</span>
                        </div>
                    </div>
                    <div className="top-actions">
                        <div className="live-badge">
                            <div className="status-dot pulse"></div>
                            <span>En ligne</span>
                        </div>
                    </div>
                </div>
                <div className="admin-scroll-content">
                    {activeTab === 'overview' ? renderOverview() : renderManagementView(activeTab)}
                </div>
            </main>

            {/* CRUD MODAL */}
            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal glass-morph animate-scale">
                        <div className="modal-header">
                            <h3>{editingItem ? 'Modifier' : 'Ajouter'} {navItems.find(n => n.id === activeTab)?.name.slice(0, -1)}</h3>
                            <button className="close-modal" onClick={() => setIsModalOpen(false)}><LuX /></button>
                        </div>
                        <form className="modal-form" onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group full">
                                    <label><LuInfo /> {activeTab === 'transport' ? 'Type' : (activeTab === 'localServices' ? 'Nom du Service' : (activeTab === 'tours' ? 'Titre du Plan' : (activeTab === 'siteComments' ? 'Nom Utilisateur' : (activeTab === 'souvenirs' ? 'Nom du Produit' : 'Nom / Titre'))))}</label>
                                    <input
                                        type="text"
                                        value={formData.nom || formData.type || formData.titre || formData.user || formData.name || ''}
                                        onChange={(e) => setFormData({ ...formData, [activeTab === 'transport' ? 'type' : (activeTab === 'tours' ? 'titre' : (activeTab === 'siteComments' ? 'user' : (activeTab === 'souvenirs' ? 'name' : 'nom')))]: e.target.value })}
                                        required
                                    />
                                </div>
                                {activeTab !== 'city' && activeTab !== 'utilisateurs' && activeTab !== 'PhoneN' && activeTab !== 'siteComments' && activeTab !== 'souvenirs' && (
                                    <div className="form-group">
                                        <label><LuMapPin /> Ville</label>
                                        <select
                                            value={formData.ville || ''}
                                            onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                                            required
                                        >
                                            <option value="">Sélectionner une ville</option>
                                            {data.city.map(c => <option key={c.nom} value={c.nom}>{c.nom}</option>)}
                                        </select>
                                    </div>
                                )}
                                {activeTab !== 'siteComments' && activeTab !== 'souvenirs' && (
                                    <div className="form-group">
                                        <label><LuImage /> URL de la Photo / Image</label>
                                        <input
                                            type="text"
                                            value={formData.photo || formData.image || ''}
                                            onChange={(e) => setFormData({ ...formData, [activeTab === 'stadium' || activeTab === 'place' || activeTab === 'tours' ? 'image' : 'photo']: e.target.value })}
                                        />
                                    </div>
                                )}
                                {activeTab === 'transport' && (
                                    <div className="form-group">
                                        <label><LuActivity /> Lien / Action</label>
                                        <input
                                            type="text"
                                            value={formData.lien || ''}
                                            onChange={(e) => setFormData({ ...formData, lien: e.target.value })}
                                        />
                                    </div>
                                )}
                                {(activeTab === 'hotels' || activeTab === 'restaurant') && (
                                    <div className="form-group">
                                        <label><LuStar /> Catégorie</label>
                                        <input
                                            type="text"
                                            value={formData.categorie || ''}
                                            onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                                        />
                                    </div>
                                )}
                                {activeTab === 'utilisateurs' && (
                                    <>
                                        <div className="form-group">
                                            <label><LuInfo /> Email</label>
                                            <input
                                                type="email"
                                                value={formData.email || ''}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><LuInfo /> Mot de passe</label>
                                            <input
                                                type="password"
                                                value={formData.password || ''}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><LuUsers /> Type d'utilisateur</label>
                                            <select
                                                value={formData.userType || 'user'}
                                                onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                                            >
                                                <option value="user">Visiteur</option>
                                                <option value="provider">Prestataire</option>
                                                <option value="admin">Administrateur</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                                {activeTab === 'PhoneN' && (
                                    <div className="form-group">
                                        <label><LuPhoneCall /> Numéro</label>
                                        <input
                                            type="text"
                                            value={formData.num || ''}
                                            onChange={(e) => setFormData({ ...formData, num: e.target.value })}
                                            required
                                        />
                                    </div>
                                )}
                                {activeTab === 'stadium' && (
                                    <div className="form-group">
                                        <label><LuActivity /> Capacité</label>
                                        <input
                                            type="number"
                                            value={formData.capacite || ''}
                                            onChange={(e) => setFormData({ ...formData, capacite: e.target.value })}
                                        />
                                    </div>
                                )}
                                {activeTab === 'localServices' && (
                                    <>
                                        <div className="form-group">
                                            <label><LuActivity /> Type de Service</label>
                                            <input
                                                type="text"
                                                value={formData.type || ''}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                placeholder="Ex: Plomberie, Taxi..."
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><LuPhone /> Téléphone</label>
                                            <input
                                                type="text"
                                                value={formData.telephone || ''}
                                                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                                placeholder="+212 XXX-XXX-XXX"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><LuMapPin /> Adresse</label>
                                            <input
                                                type="text"
                                                value={formData.adresse || ''}
                                                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                                                placeholder="Adresse complète"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><LuUser /> Propriétaire</label>
                                            <input
                                                type="text"
                                                value={formData.proprietaire || ''}
                                                onChange={(e) => setFormData({ ...formData, proprietaire: e.target.value })}
                                                placeholder="Nom du propriétaire"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><LuCheck /> Status</label>
                                            <select
                                                value={formData.status || 'pending'}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            >
                                                <option value="pending">⏳ En attente</option>
                                                <option value="accepted">✅ Accepté</option>
                                                <option value="rejected">❌ Refusé</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                                {activeTab === 'tours' && (
                                    <>
                                        <div className="form-group">
                                            <label><LuClock /> Durée</label>
                                            <input
                                                type="text"
                                                value={formData.duree || ''}
                                                onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                                                placeholder="Ex: 4 heures, 2 jours"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><LuTrendingUp /> Prix (DH)</label>
                                            <input
                                                type="number"
                                                value={formData.prix || ''}
                                                onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </>
                                )}
                                {activeTab === 'souvenirs' && (
                                    <>
                                        <div className="form-group">
                                            <label><LuMapPin /> Provenance (Origine)</label>
                                            <input
                                                type="text"
                                                value={formData.origin || ''}
                                                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                                placeholder="Ex: Fès, Marrakech..."
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><LuTag /> Catégorie (Boutique)</label>
                                            <input
                                                type="text"
                                                value={formData.category || ''}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                placeholder="Ex: Artisanat, Décoration..."
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><LuTag /> Tag Spécifique</label>
                                            <input
                                                type="text"
                                                value={formData.tag || ''}
                                                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                                placeholder="Ex: Céramique & Zellige, Huile & Soins..."
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><LuTag /> Badge</label>
                                            <input
                                                type="text"
                                                value={formData.badge || ''}
                                                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                                placeholder="Ex: Bestseller, Fait Main..."
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><LuTrendingUp /> Prix (MAD)</label>
                                            <input
                                                type="number"
                                                value={formData.price || ''}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><LuImage /> URL de l'image</label>
                                            <input
                                                type="text"
                                                value={formData.image || ''}
                                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                placeholder="URL de l'image du produit"
                                                required
                                            />
                                        </div>
                                        <div className="form-group full">
                                            <label><LuInfo /> Description</label>
                                            <textarea
                                                value={formData.description || ''}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Description détaillée du souvenir..."
                                                required
                                            ></textarea>
                                        </div>
                                    </>
                                )}
                                {activeTab === 'siteComments' && (
                                    <div className="form-group">
                                        <label><LuStar /> Rating (1-5)</label>
                                        <input
                                            type="number"
                                            min="1" max="5"
                                            value={formData.rating || ''}
                                            onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                                        />
                                    </div>
                                )}
                                {activeTab !== 'PhoneN' && activeTab !== 'souvenirs' && (
                                    <div className="form-group full">
                                        <label><LuMapPin /> {activeTab === 'siteComments' ? 'Commentaire' : (activeTab === 'localServices' || activeTab === 'tours' ? 'Détails / Description' : (activeTab === 'utilisateurs' ? 'Adresse' : 'Adresse / Description'))}</label>
                                        <textarea
                                            value={formData.adress || formData.desc || formData.description || formData.details || formData.text || ''}
                                            onChange={(e) => setFormData({ ...formData, [activeTab === 'siteComments' ? 'text' : (activeTab === 'transport' ? 'desc' : (activeTab === 'place' ? 'description' : (activeTab === 'localServices' || activeTab === 'tours' ? 'details' : 'adress')))]: e.target.value })}
                                        ></textarea>
                                    </div>
                                )}
                                {activeTab !== 'city' && activeTab !== 'utilisateurs' && activeTab !== 'PhoneN' && activeTab !== 'localServices' && activeTab !== 'siteComments' && activeTab !== 'place' && activeTab !== 'souvenirs' && (
                                    <div className="form-group">
                                        <label><LuPhone /> Contact</label>
                                        <input
                                            type="text"
                                            value={formData.contact || ''}
                                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Annuler</button>
                                <button type="submit" className="btn-save"><LuSave /> Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
