import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { FaArrowLeft, FaMapMarkedAlt, FaMapMarkerAlt, FaInfoCircle, FaSearch, FaHeart, FaRegHeart, FaTimes, FaCamera } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from '../../api';

gsap.registerPlugin(ScrollTrigger);

export default function Places() {
    const { t } = useTranslation();
    const [places, setPlaces] = useState([]);
    const [selectedCity, setSelectedCity] = useState('Casablanca');
    const [searchTerm, setSearchTerm] = useState('');
    const [likedItems, setLikedItems] = useState(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            const saved = localStorage.getItem(`favorited_places_${user.id}`);
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [showFavorites, setShowFavorites] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleOpenModal = (place) => {
        setSelectedPlace(place);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPlace(null);
    };

    const villes = ["Casablanca", "Rabat", "Marrakech", "Fès", "Agadir", "Tanger"];

    const toggleLike = (place) => {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
            alert('Veuillez vous connecter pour ajouter aux favoris.');
            return;
        }
        const user = JSON.parse(savedUser);
        const isLiked = likedItems.includes(place.id);
        const currentLikes = typeof place.likes === 'number' ? place.likes : 0;
        const newLikes = isLiked ? currentLikes - 1 : currentLikes + 1;

        const updatedPlaces = places.map(p => p.id === place.id ? { ...p, likes: newLikes } : p);
        setPlaces(updatedPlaces);

        let updatedLikedItems;
        if (isLiked) {
            updatedLikedItems = likedItems.filter(id => id !== place.id);
        } else {
            updatedLikedItems = [...likedItems, place.id];
        }
        setLikedItems(updatedLikedItems);
        localStorage.setItem(`favorited_places_${user.id}`, JSON.stringify(updatedLikedItems));

        const placeRef = doc(db, 'place', String(place.id));
        updateDoc(placeRef, { likes: newLikes }).catch(err => console.error(err));
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await api.get('/lieu-places');
                const data = response.data.map(item => ({
                    ...item,
                    photo: item.image_url, // Map Laravel field to React expected field
                    description: item.description || '',
                    ville: item.ville_name
                }));
                setPlaces(data);
            } catch(err) {
                console.error('Erreur de chargement:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter places based on favorites, search term or selected city
    let filteredPlace = places;
    if (showFavorites) {
        filteredPlace = filteredPlace.filter(p => likedItems.includes(p.id));
    } else if (searchTerm) {
        filteredPlace = filteredPlace.filter(p => p.nom.toLowerCase().includes(searchTerm.toLowerCase()));
    } else {
        filteredPlace = filteredPlace.filter(p => p.ville === selectedCity);
    }

    useEffect(() => {
        if (searchTerm && filteredPlace.length > 0) {
            const firstResultCity = filteredPlace[0].ville;
            if (firstResultCity !== selectedCity) {
                setSelectedCity(firstResultCity);
            }
        }
    }, [searchTerm, filteredPlace, selectedCity]);

    // GSAP Scroll Reveal - Individual card trigger for smooth entry
    useEffect(() => {
        if (filteredPlace.length === 0) return;

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray(".data-card");
            cards.forEach((card) => {
                gsap.fromTo(card, 
                    { y: 50, opacity: 0 },
                    { 
                        y: 0, 
                        opacity: 1, 
                        duration: 0.8, 
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 95%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            });
        });

        return () => ctx.revert();
    }, [filteredPlace, selectedCity, showFavorites]);

    return (
        <div className="page-container">
            <Link to="/" className="back-btn">
                <FaArrowLeft /> {t('common.back_home')}
            </Link>

            <div className="page-header">
                <h2>{t('places.title')}</h2>
                <p className="subtitle">{t('places.subtitle')}</p>
            </div>

            <div className="search-bar-wrapper">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder={t('places.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button
                            className="search-clear"
                            onClick={() => setSearchTerm('')}
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            <div className="city-filters">
                {villes.map((ville, y) => (
                    <button
                        key={y}
                        className={`city-btn ${selectedCity === ville && !showFavorites ? 'active' : ''}`}
                        onClick={() => { setSelectedCity(ville); setShowFavorites(false); }}
                    >
                        {ville}
                    </button>
                ))}
                <button
                    className={`city-btn favorite-filter-btn ${showFavorites ? 'active' : ''}`}
                    onClick={() => { setShowFavorites(true); setSearchTerm(''); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                    <FaHeart color={showFavorites ? "white" : "red"} /> {t('common.favorites', 'Mes Favoris')}
                </button>
            </div>

            <div className="data-grid">
                {loading ? (
                    <div className="premium-loader-container">
                        <div className="premium-loader"></div>
                        <div className="premium-loader-text">{t('places.loading', 'Loading Historic Monuments & Places...')}</div>
                    </div>
                ) : filteredPlace.length > 0 ? (
                    filteredPlace.map((p, i) => (
                        <div className="data-card" key={i}>
                            <img src={p.photo} alt={p.nom} />
                            <div className="card-content">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <span className="card-tag">{p.ville}</span>
                                </div>
                                <h4>{p.nom}</h4>
                                <ul className="card-details">
                                    <li><FaMapMarkerAlt /> {p.ville}</li>
                                    <li><FaInfoCircle /> {p.description.substring(0, 100)}...</li>
                                </ul>
                                <div className="card-action-btns">
                                    <button className="view-details-btn" onClick={() => handleOpenModal(p)}>
                                        {t('places.view_details', 'Voir Détails')}
                                    </button>
                                    <button
                                        className={`favorite-circle-btn ${likedItems.includes(p.id) ? 'active' : ''}`}
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleLike(p); }}
                                    >
                                        {likedItems.includes(p.id) ? <FaHeart /> : <FaRegHeart />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        {searchTerm
                            ? t('places.search_empty', { term: searchTerm })
                            : t('places.empty', { city: selectedCity })}
                    </div>
                )}
            </div>

            {/* Place Details Modal */}
            {isModalOpen && selectedPlace && (
                <div className="hotel-modal-overlay" onClick={handleCloseModal}>
                    <div className="hotel-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={handleCloseModal}>
                            <FaTimes />
                        </button>
                        
                        <div className="modal-grid">
                            <div className="modal-left">
                                <div className="image-container">
                                    <img src={selectedPlace.photo} alt={selectedPlace.nom} />
                                    <div className="modal-badge">Lieu Incontournable</div>
                                </div>
                            </div>
                            
                            <div className="modal-right">
                                <div className="modal-header-info">
                                    <div className="modal-rating">
                                        <FaCamera color="var(--p-red)" /> {t('places.must_visit', 'À visiter')}
                                    </div>
                                    <h3>{selectedPlace.nom}</h3>
                                    <p className="modal-location"><FaMapMarkerAlt /> {selectedPlace.ville}, Maroc</p>
                                </div>
                                
                                <div className="modal-description">
                                    <h4>Description</h4>
                                    <p>{selectedPlace.description}</p>
                                </div>
                                
                                <div className="modal-amenities-section">
                                    <h4>{t('places.info', 'Informations Pratiques')}</h4>
                                    <div className="modal-amenities-list">
                                        <div className="amenity-item"><FaMapMarkedAlt /> Accès Public</div>
                                        <div className="amenity-item"><FaCamera /> Photo Autorisée</div>
                                        <div className="amenity-item"><FaHeart /> Site Culturel</div>
                                    </div>
                                </div>
                                
                                <div className="modal-actions">
                                    <button className="reserve-now-btn" onClick={() => alert('Plus d\'infos bientôt disponibles !')}>
                                        Guide de Voyage
                                    </button>
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.nom + ' ' + selectedPlace.ville)}`}
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="localisation-btn"
                                    >
                                        Localisation
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


