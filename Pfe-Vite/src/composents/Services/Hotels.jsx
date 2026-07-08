import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft, FaStar, FaMapMarkerAlt, FaPhoneAlt, FaWifi, FaParking, FaSwimmingPool, FaDumbbell, FaSearch, FaHeart, FaRegHeart, FaTimes, FaCommentAlt, FaPaperPlane, FaCheckCircle, FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from '../../api';
import ReservationModal from './ReservationModal';

gsap.registerPlugin(ScrollTrigger);

export default function Hotels() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [hotels, setHotels] = useState([]);
    const [showReservation, setShowReservation] = useState(false);
    const [selectedCity, setSelectedCity] = useState('Casablanca');
    const [hoveredCard, setHoveredCard] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [likedItems, setLikedItems] = useState(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            const saved = localStorage.getItem(`favorited_hotels_${user.id}`);
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [showFavorites, setShowFavorites] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Comments State
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({ auteur_nom: '', pays: '', contenu: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchComments = async (hotelId) => {
        try {
            const response = await api.get(`/commentaires?service_type=hotel&service_id=${hotelId}`);
            setComments(response.data);
        } catch (err) {
            console.error("Erreur chargement commentaires:", err);
        }
    };

    const handleOpenModal = (hotel) => {
        setSelectedHotel(hotel);
        setIsModalOpen(true);
        setShowComments(false);
        fetchComments(hotel.id);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedHotel(null);
        setShowComments(false);
    };

    useEffect(() => {
        const root = document.getElementById('root');
        const pageContainer = document.querySelector('.page-container');
        if (isModalOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isModalOpen]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.auteur_nom || !newComment.pays || !newComment.contenu) return;
        
        setIsSubmitting(true);
        try {
            const response = await api.post('/commentaires', {
                ...newComment,
                service_type: 'hotel',
                service_id: selectedHotel.id
            });
            setComments([response.data, ...comments]);
            setNewComment({ auteur_nom: '', pays: '', contenu: '' });
        } catch (err) {
            console.error("Erreur ajout commentaire:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const villes = ["Casablanca", "Rabat", "Marrakech", "Fès", "Agadir", "Tanger"];

    const toggleLike = (hotel) => {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
            alert('Veuillez vous connecter pour ajouter aux favoris.');
            return;
        }
        const user = JSON.parse(savedUser);
        const isLiked = likedItems.includes(hotel.id);
        const currentLikes = typeof hotel.likes === 'number' ? hotel.likes : 0;
        const newLikes = isLiked ? currentLikes - 1 : currentLikes + 1;

        const updatedHotels = hotels.map(h => h.id === hotel.id ? { ...h, likes: newLikes } : h);
        setHotels(updatedHotels);

        let updatedLikedItems;
        if (isLiked) {
            updatedLikedItems = likedItems.filter(id => id !== hotel.id);
        } else {
            updatedLikedItems = [...likedItems, hotel.id];
        }
        setLikedItems(updatedLikedItems);
        localStorage.setItem(`favorited_hotels_${user.id}`, JSON.stringify(updatedLikedItems));

        localStorage.setItem(`favorited_hotels_${user.id}`, JSON.stringify(updatedLikedItems));
        
        // Removed Firebase calls (now using Laravel API)
        // api.post('/hotels/like', { id: hotel.id, likes: newLikes });
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await api.get('/hotels');
                const data = response.data.map(item => ({
                    ...item,
                    photo: item.photo_url, // Map Laravel field to React expected field
                    adress: item.adresse,   // Map Laravel field to React expected field
                    ville: item.ville_name  // Map Laravel field to React expected field
                }));
                setHotels(data);
                
                // Deep-linking: auto-open modal if ID is in URL
                const params = new URLSearchParams(window.location.search);
                const id = params.get('id');
                if (id) {
                    const hotel = data.find(h => String(h.id) === String(id));
                    if (hotel) {
                        handleOpenModal(hotel);
                    }
                }
            } catch (err) {
                console.error('Erreur de chargement:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Listen to URL changes for deep-linking (e.g. clicking from Search modal)
    useEffect(() => {
        if (hotels.length > 0) {
            const params = new URLSearchParams(location.search);
            const id = params.get('id');
            if (id) {
                const hotel = hotels.find(h => String(h.id) === String(id));
                if (hotel && selectedHotel?.id !== hotel.id) {
                    handleOpenModal(hotel);
                }
            }
        }
    }, [location.search, hotels]);

    // Filter hotels based on favorites, search term or selected city
    let filteredHotels = hotels;
    if (showFavorites) {
        filteredHotels = filteredHotels.filter(h => likedItems.includes(h.id));
    } else if (searchTerm) {
        filteredHotels = filteredHotels.filter(h => h.nom.toLowerCase().includes(searchTerm.toLowerCase()));
    } else {
        filteredHotels = filteredHotels.filter(h => h.ville === selectedCity);
    }

    useEffect(() => {
        if (searchTerm && filteredHotels.length > 0) {
            const firstResultCity = filteredHotels[0].ville;
            if (firstResultCity !== selectedCity) {
                setSelectedCity(firstResultCity);
            }
        }
    }, [searchTerm, filteredHotels, selectedCity]);

    // GSAP Scroll Reveal - Individual card trigger to prevent blanking out the whole grid
    useEffect(() => {
        if (filteredHotels.length === 0) return;

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
    }, [filteredHotels, selectedCity, showFavorites]);

    const getStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <FaStar key={i} className={i < rating ? "star-filled" : "star-empty"} />
        ));
    };

    const getAmenities = (categorie) => {
        const amenities = [];
        if (categorie.toLowerCase().includes('luxury') || categorie.toLowerCase().includes('5')) {
            amenities.push(<FaSwimmingPool key="pool" title="Swimming Pool" />);
            amenities.push(<FaDumbbell key="gym" title="Fitness Center" />);
        }
        amenities.push(<FaWifi key="wifi" title="Free WiFi" />);
        amenities.push(<FaParking key="parking" title="Parking" />);
        return amenities;
    };

    return (
        <div className="page-container">
            <Link to="/" className="back-btn">
                <FaArrowLeft /> {t('common.back_home')}
            </Link>

            <div className="page-header">
                <h2>{t('hotels.title')}</h2>
                <p className="subtitle">{t('hotels.subtitle')}</p>
            </div>

            <div className="search-bar-wrapper">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder={t('hotels.search')}
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
                        <div className="premium-loader-text">{t('hotels.loading', 'Loading Luxury Hotels & Stays...')}</div>
                    </div>
                ) : filteredHotels.length > 0 ? (
                    filteredHotels.map((h, i) => (
                        <div
                            className="data-card"
                            key={i}
                            onMouseEnter={() => setHoveredCard(i)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className="card-image-wrapper">
                                <img src={h.photo} alt={h.nom} />
                                <div className="card-overlay">
                                    <div className="rating">
                                        {getStars(4)}
                                    </div>
                                </div>
                            </div>
                            <div className="card-content">
                                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                                        <span className="card-tag">{h.categorie}</span>
                                        <span className="card-tag" style={{background: '#f8fafc', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #e2e8f0'}}>
                                            <FaCommentAlt size={11} /> {h.commentaires_count || 0}
                                        </span>
                                    </div>
                                    <div className="amenities">
                                        {getAmenities(h.categorie)}
                                    </div>
                                </div>
                                <h4>{h.nom}</h4>
                                <ul className="card-details">
                                    <li><FaMapMarkerAlt /> {h.adress}</li>
                                    <li><FaPhoneAlt /> {h.contact}</li>
                                </ul>
                                <div className="card-action-btns">
                                    <button className="view-details-btn" onClick={() => handleOpenModal(h)}>
                                        {t('hotels.view_details', 'Voir Détails')}
                                    </button>
                                    <button
                                        className={`favorite-circle-btn ${likedItems.includes(h.id) ? 'active' : ''}`}
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleLike(h); }}
                                        title={likedItems.includes(h.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                                    >
                                        {likedItems.includes(h.id) ? <FaHeart /> : <FaRegHeart />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        {searchTerm
                            ? t('hotels.search_empty', { term: searchTerm })
                            : t('hotels.empty', { city: selectedCity })}
                    </div>
                )}
            </div>

            {/* Hotel Details Modal */}
            {isModalOpen && selectedHotel && (
                <div className="hotel-modal-overlay" onClick={handleCloseModal} data-lenis-prevent>
                    <div className="hotel-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={handleCloseModal}>
                            <FaTimes />
                        </button>
                        
                        <div className="modal-grid">
                            <div className="modal-left">
                                <div className="image-container">
                                    <img src={selectedHotel.photo} alt={selectedHotel.nom} />
                                    <div className="modal-badges">
                                        <div className="modal-badge">{selectedHotel.categorie}</div>
                                        <div className="modal-badge comment-count-badge">
                                            <FaCommentAlt style={{marginRight: '5px'}}/> {comments.length} {t('common.reviews', 'Avis')}
                                        </div>
                                    </div>
                                    <div className="carousel-indicators">
                                        <div className="indicator-dot active"></div>
                                        <div className="indicator-dot"></div>
                                        <div className="indicator-dot"></div>
                                        <div className="indicator-dot"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="modal-right">
                                <div className="details-main-card">
                                    <div className="modal-header-info">
                                        <h3>{selectedHotel.nom}</h3>
                                        <p className="modal-location">
                                            <FaMapMarkerAlt style={{color: 'var(--p-red)'}} /> {selectedHotel.adress}, {selectedHotel.ville}
                                        </p>
                                    </div>
                                    
                                    <div className="modal-description">
                                        <h4>{t('common.description', 'Description')}</h4>
                                        <p>
                                            {selectedHotel.descriptions && selectedHotel.descriptions[i18n.language] 
                                                ? selectedHotel.descriptions[i18n.language] 
                                                : (selectedHotel.description || `Découvrez le confort et l'élégance de l'hôtel ${selectedHotel.nom}. Situé au cœur de ${selectedHotel.ville}, cet établissement offre un cadre exceptionnel pour vos séjours.`)}
                                        </p>
                                        <div className="modal-contact-row-inline">
                                            <FaPhoneAlt /> <span>{selectedHotel.contact}</span>
                                        </div>
                                    </div>

                                    <div className="modal-amenities-section">
                                        <h4>{t('hotels.amenities', 'Services & Équipements')}</h4>
                                        <div className="modal-amenities-list">
                                            <div className="amenity-item"><FaWifi /> WiFi</div>
                                            <div className="amenity-item"><FaSwimmingPool /> Piscine</div>
                                            <div className="amenity-item"><FaParking /> Parking</div>
                                            <div className="amenity-item"><FaDumbbell /> Fitness</div>
                                        </div>
                                    </div>
                                    
                                    <div className="modal-price-card">
                                        <div className="modal-rating">{getStars(5)}</div>
                                        <div className="price-value">
                                            {selectedHotel.prix_chambre || "2,200"} <span>MAD / nuit</span>
                                        </div>
                                    </div>

                                    <div className="modal-actions-container">
                                        <div className="action-grid">
                                            <button
                                                className="main-reserve-btn"
                                                onClick={() => setShowReservation(true)}
                                            >
                                                {t('common.reserve', 'Réserver Maintenant')}
                                            </button>
                                            <button 
                                                type="button"
                                                className={`icon-action-btn ${likedItems.some(id => String(id) === String(selectedHotel?.id)) ? 'active' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleLike(selectedHotel);
                                                }}
                                                title="Favoris"
                                            >
                                                {likedItems.some(id => String(id) === String(selectedHotel?.id)) ? (
                                                    <FaHeart style={{color: 'var(--p-red)'}} />
                                                ) : (
                                                    <FaRegHeart />
                                                )}
                                            </button>
                                            <a 
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedHotel.nom + ' ' + selectedHotel.adress)}`}
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="icon-action-btn"
                                                title="Localisation"
                                            >
                                                <FaMapMarkerAlt />
                                            </a>
                                        </div>
                                    </div>

                                    {/* Beautiful Maps Card with Floating Info Overlay directly below the buttons */}
                                    <div className="hotel-map-widget-container">
                                        <iframe 
                                            title="Hotel Location Map"
                                            src={"https://maps.google.com/maps?q=" + encodeURIComponent((selectedHotel?.nom && selectedHotel?.ville) ? (selectedHotel.nom + ", " + selectedHotel.ville) : (selectedHotel?.ville || "Casablanca")) + "&output=embed&z=15&t=m"}
                                            width="100%"
                                            height="100%"
                                            frameBorder="0" 
                                            style={{ border: 0 }}
                                            allowFullScreen=""
                                            loading="lazy"
                                        ></iframe>
                                        <div className="map-floating-overlay-card">
                                            <div className="map-floating-info">
                                                <h5>{selectedHotel.ville}</h5>
                                                <p>{selectedHotel.nom || `${selectedHotel.ville}, Maroc`}</p>
                                            </div>
                                            <a 
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedHotel.nom + ' ' + selectedHotel.adress)}`}
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="map-floating-external-btn"
                                                title={t('common.open_maps', 'Open in Google Maps')}
                                            >
                                                <FaExternalLinkAlt />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Comments Section */}
                                <div className="modal-comments-section">
                                    <div className="comments-header">
                                        <h4>{t('common.comments', 'Avis Clients')}</h4>
                                    </div>

                                    {/* Add Comment Form */}
                                    <form className="comment-form" onSubmit={handleAddComment}>
                                        <div className="comment-inputs-row">
                                            <input
                                                type="text"
                                                placeholder={t('common.name', 'Nom complet')}
                                                value={newComment.auteur_nom}
                                                onChange={e => setNewComment({...newComment, auteur_nom: e.target.value})}
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder={t('common.country', 'Pays')}
                                                value={newComment.pays}
                                                onChange={e => setNewComment({...newComment, pays: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <textarea
                                            placeholder={t('common.write_comment', 'Partagez votre expérience...')}
                                            value={newComment.contenu}
                                            onChange={e => setNewComment({...newComment, contenu: e.target.value})}
                                            required
                                            rows="3"
                                        />
                                        <button type="submit" className="submit-comment-btn" disabled={isSubmitting}>
                                            {isSubmitting ? '...' : <><FaPaperPlane /> {t('common.send', 'Envoyer')}</>}
                                        </button>
                                    </form>

                                    <div className="comments-list">
                                        {comments.length > 0 ? (
                                            comments.map((c, idx) => (
                                                <div key={idx} className="comment-card">
                                                    <div className="comment-card-top">
                                                        <div className="comment-stars">
                                                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                                        </div>
                                                        <div className="comment-verified">
                                                            <FaCheckCircle /> VÉRIFIÉ
                                                        </div>
                                                    </div>
                                                    <p className="comment-body">{c.contenu}</p>
                                                    <div className="comment-divider"></div>
                                                    <div className="comment-author-section">
                                                        <div className="comment-author-left">
                                                            <div className="comment-avatar-wrapper">
                                                                <div className="comment-avatar">
                                                                    {(c.auteur_nom || 'A').charAt(0).toUpperCase()}
                                                                </div>
                                                            </div>
                                                            <div className="comment-author-info">
                                                                <span className="author-name">{c.auteur_nom || 'Anonyme'}</span>
                                                                <span className="author-country">{c.pays || 'Maroc'}</span>
                                                            </div>
                                                        </div>
                                                        <span className="comment-date">
                                                            {new Date(c.date_pub || c.created_at || new Date()).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="no-comments">Aucun commentaire pour le moment. Soyez le premier !</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reservation Modal */}
            {showReservation && selectedHotel && (
                <ReservationModal
                    service={selectedHotel}
                    serviceType="hotel"
                    onClose={() => setShowReservation(false)}
                />
            )}
        </div>
    );
}


