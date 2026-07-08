import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft, FaUtensils, FaMapMarkerAlt, FaPhoneAlt, FaSearch, FaHeart, FaRegHeart, FaTimes, FaStar, FaCommentAlt, FaPaperPlane, FaCheckCircle, FaWifi } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from '../../api';
import ReservationModal from './ReservationModal';

gsap.registerPlugin(ScrollTrigger);

export default function Restaurant() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [Restau, setRestau] = useState([]);
    const [showReservation, setShowReservation] = useState(false);
    const [selectedCity, setSelectedCity] = useState('Casablanca');
    const [searchTerm, setSearchTerm] = useState('');
    const [likedItems, setLikedItems] = useState(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            const saved = localStorage.getItem(`favorited_restaurants_${user.id}`);
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [showFavorites, setShowFavorites] = useState(false);
    const [selectedRestau, setSelectedRestau] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Comments State
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({ auteur_nom: '', pays: '', contenu: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchComments = async (restauId) => {
        try {
            const response = await api.get(`/commentaires?service_type=restaurant&service_id=${restauId}`);
            setComments(response.data);
        } catch (err) {
            console.error("Erreur chargement commentaires:", err);
        }
    };

    const handleOpenModal = (restau) => {
        setSelectedRestau(restau);
        setIsModalOpen(true);
        setShowComments(false);
        fetchComments(restau.id);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRestau(null);
        setShowComments(false);
    };

    useEffect(() => {
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
                service_type: 'restaurant',
                service_id: selectedRestau.id
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

    const toggleLike = (restau) => {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
            alert('Veuillez vous connecter pour ajouter aux favoris.');
            return;
        }
        const user = JSON.parse(savedUser);
        const isLiked = likedItems.includes(restau.id);
        const currentLikes = typeof restau.likes === 'number' ? restau.likes : 0;
        const newLikes = isLiked ? currentLikes - 1 : currentLikes + 1;

        const updatedRestau = Restau.map(r => r.id === restau.id ? { ...r, likes: newLikes } : r);
        setRestau(updatedRestau);

        let updatedLikedItems;
        if (isLiked) {
            updatedLikedItems = likedItems.filter(id => id !== restau.id);
        } else {
            updatedLikedItems = [...likedItems, restau.id];
        }
        setLikedItems(updatedLikedItems);
        localStorage.setItem(`favorited_restaurants_${user.id}`, JSON.stringify(updatedLikedItems));
        
        // Removed Firebase calls (now using Laravel API)
        // api.post('/restaurants/like', { id: restau.id, likes: newLikes }); 
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await api.get('/restaurants');
                const data = response.data.map(item => ({
                    ...item,
                    photo: item.photo_url,
                    adress: item.adresse,
                    ville: item.ville_name
                }));
                setRestau(data);
            } catch(err) {
                console.error('Erreur de chargement:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Listen to URL changes for deep-linking (e.g. clicking from Search modal)
    useEffect(() => {
        if (Restau.length > 0) {
            const params = new URLSearchParams(location.search);
            const id = params.get('id');
            if (id) {
                const r = Restau.find(item => String(item.id) === String(id));
                if (r && selectedRestau?.id !== r.id) {
                    handleOpenModal(r);
                }
            }
        }
    }, [location.search, Restau]);

    // Filter restaurants based on favorites, search term or selected city
    let filteredRestau = Restau;
    if (showFavorites) {
        filteredRestau = filteredRestau.filter(r => likedItems.includes(r.id));
    } else if (searchTerm) {
        filteredRestau = filteredRestau.filter(r => r.nom.toLowerCase().includes(searchTerm.toLowerCase()));
    } else {
        filteredRestau = filteredRestau.filter(r => r.ville === selectedCity);
    }

    // Auto-select city when search results are found
    useEffect(() => {
        if (searchTerm && filteredRestau.length > 0) {
            const firstResultCity = filteredRestau[0].ville;
            if (firstResultCity !== selectedCity) {
                setSelectedCity(firstResultCity);
            }
        }
    }, [searchTerm, filteredRestau, selectedCity]);

    // GSAP Scroll Reveal - Animating cards individually to prevent white page/batching issues
    useEffect(() => {
        if (filteredRestau.length === 0) return;

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
    }, [filteredRestau, selectedCity, showFavorites]);

    return (
        <div className="page-container">
            <Link to="/" className="back-btn">
                <FaArrowLeft /> {t('common.back_home')}
            </Link>

            <div className="page-header">
                <h2>{t('restaurants.title')}</h2>
                <p className="subtitle">{t('restaurants.subtitle')}</p>
            </div>

            <div className="search-bar-wrapper">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder={t('restaurants.search')}
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
                        <div className="premium-loader-text">{t('restaurants.loading', 'Loading Culinary Restaurants...')}</div>
                    </div>
                ) : filteredRestau.length > 0 ? (
                    filteredRestau.map((r, i) => (
                        <div className="data-card" key={i}>
                            <img src={r.photo} alt={r.nom} />
                            <div className="card-content">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                                        <span className="card-tag">{r.categorie}</span>
                                        <span className="card-tag" style={{background: '#f8fafc', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #e2e8f0'}}>
                                            <FaCommentAlt size={11} /> {r.commentaires_count || 0}
                                        </span>
                                    </div>
                                </div>
                                <h4>{r.nom}</h4>
                                <ul className="card-details">
                                    <li><FaMapMarkerAlt /> {r.adress}</li>
                                    <li><FaPhoneAlt /> {r.contact}</li>
                                </ul>
                                <div className="card-action-btns">
                                    <button className="view-details-btn" onClick={() => handleOpenModal(r)}>
                                        {t('restaurants.view_details', 'Voir Détails')}
                                    </button>
                                    <button
                                        className={`favorite-circle-btn ${likedItems.includes(r.id) ? 'active' : ''}`}
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleLike(r); }}
                                    >
                                        {likedItems.includes(r.id) ? <FaHeart /> : <FaRegHeart />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        {searchTerm
                            ? t('restaurants.search_empty', { term: searchTerm })
                            : t('restaurants.empty', { city: selectedCity })}
                    </div>
                )}
            </div>
            {/* Restaurant Details Modal */}
            {isModalOpen && selectedRestau && (
                <div className="hotel-modal-overlay" onClick={handleCloseModal} data-lenis-prevent>
                    <div className="hotel-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={handleCloseModal}>
                            <FaTimes />
                        </button>
                        
                        <div className="modal-grid">
                            <div className="modal-left">
                                <div className="image-container">
                                    <img src={selectedRestau?.photo} alt={selectedRestau?.nom} />
                                    <div className="modal-badges">
                                        <div className="modal-badge">{selectedRestau?.categorie}</div>
                                        <div className="modal-badge comment-count-badge">
                                            <FaCommentAlt style={{marginRight: '5px'}}/> {comments?.length || 0} {t('common.reviews', 'Avis')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="modal-right">
                                <div className="details-main-card">
                                    <div className="modal-header-info">
                                        <h3>{selectedRestau?.nom}</h3>
                                        <p className="modal-location">
                                            <FaMapMarkerAlt style={{color: 'var(--p-red)'}} /> {selectedRestau?.adress}, {selectedRestau?.ville}
                                        </p>
                                    </div>
                                    
                                    <div className="modal-description">
                                        <h4>{t('common.description', 'Description')}</h4>
                                        <p>
                                            {selectedRestau?.description || `Vivez une expérience culinaire inoubliable au restaurant ${selectedRestau?.nom}. Spécialisé dans une cuisine raffinée à ${selectedRestau?.ville}.`}
                                        </p>
                                        <div className="modal-contact-row-inline">
                                            <FaPhoneAlt /> <span>{selectedRestau?.contact || 'Contact non disponible'}</span>
                                        </div>
                                    </div>

                                    <div className="modal-amenities-section">
                                        <h4>{t('restaurants.features', 'Caractéristiques')}</h4>
                                        <div className="modal-amenities-list">
                                            <div className="amenity-item"><FaUtensils /> Cuisine</div>
                                            <div className="amenity-item"><FaWifi /> WiFi</div>
                                            <div className="amenity-item"><FaHeart /> Ambiance</div>
                                        </div>
                                    </div>
                                    
                                    <div className="modal-price-card">
                                        <div className="modal-rating">
                                            <FaStar color="#FFD700" /><FaStar color="#FFD700" /><FaStar color="#FFD700" /><FaStar color="#FFD700" /><FaStar color="#FFD700" />
                                        </div>
                                        <div className="price-value">
                                            {selectedRestau?.prix_moyen || "450"} <span>MAD / pers</span>
                                        </div>
                                    </div>

                                    <div className="modal-actions-container">
                                        <div className="action-grid">
                                            <button
                                                className="main-reserve-btn"
                                                onClick={() => setShowReservation(true)}
                                            >
                                                {t('common.reserve_table', 'Réserver une Table')}
                                            </button>
                                            <button 
                                                type="button"
                                                className={`icon-action-btn ${likedItems.some(id => String(id) === String(selectedRestau?.id)) ? 'active' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleLike(selectedRestau);
                                                }}
                                                title="Favoris"
                                            >
                                                {likedItems.some(id => String(id) === String(selectedRestau?.id)) ? (
                                                    <FaHeart style={{color: 'var(--p-red)'}} />
                                                ) : (
                                                    <FaRegHeart />
                                                )}
                                            </button>
                                            <a 
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((selectedRestau?.nom || '') + ' ' + (selectedRestau?.adress || ''))}`}
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="icon-action-btn"
                                                title="Localisation"
                                            >
                                                <FaMapMarkerAlt />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="maps-container-card">
                                    <iframe 
                                        title="Restaurant Location"
                                        src={"https://maps.google.com/maps?q=" + encodeURIComponent((selectedRestau?.adress && selectedRestau?.ville) ? (selectedRestau.adress + ", " + selectedRestau.ville) : (selectedRestau?.ville || "Casablanca")) + "&output=embed&z=15&t=m"}
                                        width="100%"
                                        height="100%"
                                        frameBorder="0" 
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                    ></iframe>
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
                                        {Array.isArray(comments) && comments.length > 0 ? (
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
                                                    <p className="comment-body">{c?.contenu}</p>
                                                    <div className="comment-divider"></div>
                                                    <div className="comment-author-section">
                                                        <div className="comment-author-left">
                                                            <div className="comment-avatar-wrapper">
                                                                <div className="comment-avatar">
                                                                    {(c?.auteur_nom || 'A').charAt(0).toUpperCase()}
                                                                </div>
                                                            </div>
                                                            <div className="comment-author-info">
                                                                <span className="author-name">{c?.auteur_nom || 'Anonyme'}</span>
                                                                <span className="author-country">{c?.pays || 'Maroc'}</span>
                                                            </div>
                                                        </div>
                                                        <span className="comment-date">
                                                            {new Date(c?.date_pub || c?.created_at || new Date()).toLocaleDateString()}
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
            {showReservation && selectedRestau && (
                <ReservationModal
                    service={selectedRestau}
                    serviceType="restaurant"
                    onClose={() => setShowReservation(false)}
                />
            )}
        </div>
    );
}
