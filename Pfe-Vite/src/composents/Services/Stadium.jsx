import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { FaArrowLeft, FaFutbol, FaMapMarkerAlt, FaUsers, FaSearch, FaHeart, FaRegHeart, FaTimes } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from '../../api';

gsap.registerPlugin(ScrollTrigger);

export default function Stadium() {
    const { t } = useTranslation();
    const [stadium, setStadium] = useState([]);
    const [selectedCity, setSelectedCity] = useState('Casablanca');
    const [searchTerm, setSearchTerm] = useState('');
    const [likedItems, setLikedItems] = useState(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            const saved = localStorage.getItem(`favorited_stadiums_${user.id}`);
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [showFavorites, setShowFavorites] = useState(false);
    const [selectedStadium, setSelectedStadium] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleOpenModal = (stad) => {
        setSelectedStadium(stad);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStadium(null);
    };

    const villes = ["Casablanca", "Rabat", "Marrakech", "Fès", "Agadir", "Tanger"];

    const toggleLike = (stad) => {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
            alert('Veuillez vous connecter pour ajouter aux favoris.');
            return;
        }
        const user = JSON.parse(savedUser);
        const isLiked = likedItems.includes(stad.id);
        const currentLikes = typeof stad.likes === 'number' ? stad.likes : 0;
        const newLikes = isLiked ? currentLikes - 1 : currentLikes + 1;

        const updatedStadium = stadium.map(s => s.id === stad.id ? { ...s, likes: newLikes } : s);
        setStadium(updatedStadium);

        let updatedLikedItems;
        if (isLiked) {
            updatedLikedItems = likedItems.filter(id => id !== stad.id);
        } else {
            updatedLikedItems = [...likedItems, stad.id];
        }
        setLikedItems(updatedLikedItems);
        localStorage.setItem(`favorited_stadiums_${user.id}`, JSON.stringify(updatedLikedItems));

        const stadRef = doc(db, 'stadium', String(stad.id));
        updateDoc(stadRef, { likes: newLikes }).catch(err => console.error(err));
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await api.get('/stades');
                const data = response.data.map(item => ({
                    ...item,
                    photo: item.image_url, // Map Laravel field to React expected field
                    adress: item.adresse,   // Map Laravel field to React expected field
                    ville: item.ville_name  // Map Laravel field to React expected field
                }));
                setStadium(data);
            } catch(err) {
                console.error('Erreur de chargement:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter stadiums based on favorites, search term or selected city
    let filteredStadium = stadium;
    if (showFavorites) {
        filteredStadium = filteredStadium.filter(s => likedItems.includes(s.id));
    } else if (searchTerm) {
        filteredStadium = filteredStadium.filter(s => s.nom.toLowerCase().includes(searchTerm.toLowerCase()));
    } else {
        filteredStadium = filteredStadium.filter(s => s.ville === selectedCity);
    }

    useEffect(() => {
        if (searchTerm && filteredStadium.length > 0) {
            const firstResultCity = filteredStadium[0].ville;
            if (firstResultCity !== selectedCity) {
                setSelectedCity(firstResultCity);
            }
        }
    }, [searchTerm, filteredStadium, selectedCity]);

    // GSAP Scroll Reveal - Trigger cards individually to prevent white page sensation
    useEffect(() => {
        if (filteredStadium.length === 0) return;

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
    }, [filteredStadium, selectedCity, showFavorites]);

    return (
        <div className="page-container">
            <Link to="/" className="back-btn">
                <FaArrowLeft /> {t('common.back_home')}
            </Link>

            <div className="page-header">
                <h2>{t('stadiums.title')}</h2>
                <p className="subtitle">{t('stadiums.subtitle')}</p>
            </div>

            <div className="search-bar-wrapper">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder={t('stadiums.search')}
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
                        <div className="premium-loader-text">{t('stadiums.loading', 'Loading Stadiums & Sports Venues...')}</div>
                    </div>
                ) : filteredStadium.length > 0 ? (
                    filteredStadium.map((s, i) => (
                        <div className="data-card" key={i}>
                            <img src={s.photo} alt={s.nom} />
                            <div className="card-content">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <span className="card-tag">{s.ville}</span>
                                </div>
                                <h4>{s.nom}</h4>
                                <ul className="card-details">
                                    <li><FaMapMarkerAlt /> {s.adress}</li>
                                    <li><FaUsers /> {t('stadiums.capacity')}: {s.capacite}</li>
                                </ul>
                                <div className="card-action-btns">
                                    <button className="view-details-btn" onClick={() => handleOpenModal(s)}>
                                        {t('stadiums.view_details', 'Voir Détails')}
                                    </button>
                                    <button
                                        className={`favorite-circle-btn ${likedItems.includes(s.id) ? 'active' : ''}`}
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleLike(s); }}
                                    >
                                        {likedItems.includes(s.id) ? <FaHeart /> : <FaRegHeart />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        {searchTerm
                            ? t('stadiums.search_empty', { term: searchTerm })
                            : t('stadiums.empty', { city: selectedCity })}
                    </div>
                )}
            </div>

            {/* Stadium Details Modal */}
            {isModalOpen && selectedStadium && (
                <div className="hotel-modal-overlay" onClick={handleCloseModal}>
                    <div className="hotel-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={handleCloseModal}>
                            <FaTimes />
                        </button>
                        
                        <div className="modal-grid">
                            <div className="modal-left">
                                <div className="image-container">
                                    <img src={selectedStadium.photo} alt={selectedStadium.nom} />
                                    <div className="modal-badge">Stade National</div>
                                </div>
                            </div>
                            
                            <div className="modal-right">
                                <div className="modal-header-info">
                                    <div className="modal-rating">
                                        <FaFutbol color="var(--p-green)" /> {t('stadiums.premium', 'Premium Venue')}
                                    </div>
                                    <h3>{selectedStadium.nom}</h3>
                                    <p className="modal-location"><FaMapMarkerAlt /> {selectedStadium.adress}, {selectedStadium.ville}</p>
                                </div>
                                
                                <div className="modal-description">
                                    <h4>Description</h4>
                                    <p>
                                        Le stade {selectedStadium.nom} est l'une des enceintes sportives les plus emblématiques de {selectedStadium.ville}. 
                                        Avec une capacité de {selectedStadium.capacite} spectateurs, il accueille les plus grands événements 
                                        sportifs nationaux et internationaux, offrant une ambiance électrique inégalée.
                                    </p>
                                </div>
                                
                                <div className="modal-amenities-section">
                                    <h4>{t('stadiums.info', 'Installations')}</h4>
                                    <div className="modal-amenities-list">
                                        <div className="amenity-item"><FaUsers /> {selectedStadium.capacite} sièges</div>
                                        <div className="amenity-item"><FaFutbol /> Pelouse FIFA</div>
                                        <div className="amenity-item"><FaHeart /> Zone VIP</div>
                                    </div>
                                </div>
                                
                                <div className="modal-actions">
                                    <button className="reserve-now-btn" onClick={() => alert('Billetterie bientôt disponible !')}>
                                        Acheter Billets
                                    </button>
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedStadium.nom + ' ' + selectedStadium.ville)}`}
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
