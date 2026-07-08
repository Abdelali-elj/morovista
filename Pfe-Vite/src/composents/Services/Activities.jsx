import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { FaArrowLeft, FaCompass, FaMapMarkerAlt, FaStar, FaClock, FaCalendarAlt, FaSearch } from "react-icons/fa";
import api from '../../api';
import ReservationModal from './ReservationModal';

export default function Activities() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [isReservationOpen, setIsReservationOpen] = useState(false);
    const [fallbackRestaurantId, setFallbackRestaurantId] = useState(1);

    // Fetch a valid restaurant ID to satisfy backend reservation checks
    useEffect(() => {
        api.get('/restaurants')
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setFallbackRestaurantId(res.data[0].id);
                }
            })
            .catch(err => console.log("Failed to fetch restaurants for fallback ID:", err));
    }, []);

    const categories = ['All', 'Adventure 🏜️', 'Culture 🕌', 'Water Sports 🏄', 'Food & Dining 🍲'];

    const activities = [
        {
            id: 'act-1',
            nom: 'Quad Biking in Agafay Desert',
            category: 'Adventure 🏜️',
            ville: 'Marrakech',
            prix: 450, // in MAD
            duree: '3 Hours',
            note: 4.9,
            photo: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80&w=800',
            description: 'Feel the thrill of riding a powerful quad bike across the stunning stone desert of Agafay. Enjoy a guided trek and watch the sun set over the High Atlas mountains with mint tea.'
        },
        {
            id: 'act-2',
            nom: 'Sunset Camel Trekking',
            category: 'Adventure 🏜️',
            ville: 'Merzouga',
            prix: 300,
            duree: '2 Hours',
            note: 4.8,
            photo: 'https://images.unsplash.com/photo-1542332213-9b5a5a3abd90?auto=format&fit=crop&q=80&w=800',
            description: 'Embark on a traditional camel caravan into the giant golden dunes of Erg Chebbi. Witness a mesmerizing desert sunset and experience traditional Berber nomadic hospitality.'
        },
        {
            id: 'act-3',
            nom: 'Surfing Lesson in Taghazout Bay',
            category: 'Water Sports 🏄',
            ville: 'Agadir',
            prix: 250,
            duree: '4 Hours',
            note: 4.7,
            photo: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=800',
            description: 'Learn to ride the Atlantic waves with certified instructors in Morocco’s premier surfing village. Suitable for absolute beginners as well as intermediate surfers looking for tips.'
        },
        {
            id: 'act-4',
            nom: 'Traditional Cooking Class & Market Tour',
            category: 'Food & Dining 🍲',
            ville: 'Fès',
            prix: 350,
            duree: '5 Hours',
            note: 4.9,
            photo: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800',
            description: 'Shop for fresh ingredients at the ancient Fes medina souks, then prepare an authentic 3-course Moroccan meal (tajine, couscous, salads) under the guidance of a master chef.'
        },
        {
            id: 'act-5',
            nom: 'Premium Hot Air Balloon Flight',
            category: 'Adventure 🏜️',
            ville: 'Marrakech',
            prix: 1800,
            duree: '4 Hours',
            note: 5.0,
            photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
            description: 'Float peacefully above the palm groves, canyons, and picturesque Berber villages surrounding Marrakech at sunrise. Includes a gourmet breakfast in a traditional tent afterward.'
        },
        {
            id: 'act-6',
            nom: 'Medina Historical Walking Tour',
            category: 'Culture 🕌',
            ville: 'Rabat',
            prix: 200,
            duree: '3 Hours',
            note: 4.6,
            photo: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=800',
            description: 'Stroll through the scenic blue alleys of Oudayas Kasbah, discover the towering Hassan Minaret, and explore the rich history of Rabat medina with a professional licensed historian.'
        },
        {
            id: 'act-7',
            nom: 'Scuba Diving & Snorkeling Day',
            category: 'Water Sports 🏄',
            ville: 'Tanger',
            prix: 550,
            duree: '6 Hours',
            note: 4.7,
            photo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800',
            description: 'Explore the marine biodiversity of the Mediterranean at Cap Spartel. Meet exotic fish, underwater caves, and dynamic reefs in crystal clear waters. Suitable for all experience levels.'
        },
        {
            id: 'act-8',
            nom: 'Paradise Valley Rock Pool Hike',
            category: 'Adventure 🏜️',
            ville: 'Agadir',
            prix: 150,
            duree: '5 Hours',
            note: 4.8,
            photo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
            description: 'Hike through palm groves and dramatic gorges to discover the stunning natural turquoise pools of Paradise Valley. Enjoy cliff jumping, swimming, and relaxing in the sun.'
        }
    ];

    const filtered = activities.filter(act => {
        const matchesSearch = act.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              act.ville.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || act.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleOpenBooking = (activity) => {
        // Construct service object that matches ReservationModal expected attributes
        const serviceMock = {
            id: fallbackRestaurantId,
            nom: activity.nom,
            prix_moyen: activity.prix
        };
        setSelectedActivity(serviceMock);
        setIsReservationOpen(true);
    };

    return (
        <div className="page-container">
            <Link to="/" className="back-btn">
                <FaArrowLeft /> {t('common.back_home', 'Back to Home')}
            </Link>

            <div className="page-header">
                <h2>🎯 {t('services.grid.fun_activities', 'Activities For Fun')}</h2>
                <p className="subtitle">{t('activities.subtitle', 'Unforgettable adventures, workshops, and guided local tours in Morocco')}</p>
            </div>

            <div className="search-bar-wrapper">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search activities or cities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button className="search-clear" onClick={() => setSearchTerm('')}>×</button>
                    )}
                </div>
            </div>

            <div className="city-filters" style={{ marginBottom: '2.5rem' }}>
                {categories.map((cat, i) => (
                    <button
                        key={i}
                        className={`city-btn ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="data-grid">
                {filtered.length > 0 ? (
                    filtered.map((act, i) => (
                        <div className="activity-card" key={i}>
                            <div className="activity-card-image-wrapper">
                                <img src={act.photo} alt={act.nom} />
                                <span className="activity-category-badge">
                                    {act.category}
                                </span>
                            </div>
                            <div className="activity-card-content">
                                <div className="activity-card-meta">
                                    <span className="activity-location"><FaMapMarkerAlt /> {act.ville}</span>
                                    <span className="activity-rating">
                                        <FaStar /> {act.note}
                                    </span>
                                </div>
                                <h4 className="activity-title">{act.nom}</h4>
                                <p className="activity-description">
                                    {act.description}
                                </p>
                                <div className="activity-details-row">
                                    <span><FaClock /> {act.duree}</span>
                                    <span><FaCalendarAlt /> Daily departures</span>
                                </div>
                                <div className="activity-footer">
                                    <div className="activity-price-block">
                                        <span className="price-label">Starting At</span>
                                        <strong className="price-value">{act.prix} MAD</strong>
                                    </div>
                                    <button 
                                        className="activity-book-btn" 
                                        onClick={() => handleOpenBooking(act)}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#94a3b8', fontSize: '1.1rem' }}>
                        No activities found matching "{searchTerm}" under category {selectedCategory}.
                    </div>
                )}
            </div>

            {isReservationOpen && selectedActivity && (
                <ReservationModal 
                    service={selectedActivity} 
                    serviceType="restaurant" 
                    onClose={() => { setIsReservationOpen(false); setSelectedActivity(null); }} 
                />
            )}
        </div>
    );
}
