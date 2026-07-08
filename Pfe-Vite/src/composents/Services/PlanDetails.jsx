import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import gsap from 'gsap';
import {
    LuMapPin,
    LuClock,
    LuCompass,
    LuArrowLeft,
    LuBadgeCheck,
    LuHeart,
    LuMessageCircle,
    LuCalendar,
    LuStar,
    LuSend,
    LuLanguages,
    LuCheck,
    LuX,
    LuUsers,
    LuShieldAlert,
    LuPlus,
    LuMinus
} from 'react-icons/lu';

const PlanDetails = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [guestCount, setGuestCount] = useState(1);
    const containerRef = useRef(null);

    // Form inputs state
    const [newRating, setNewRating] = useState(5);
    const [newName, setNewName] = useState("");
    const [newText, setNewText] = useState("");
    const [hoverRating, setHoverRating] = useState(0);

    // Seeded reviews list for a premium initial experience
    const defaultReviews = [
        {
            id: 1,
            name: "Youssef K.",
            rating: 5,
            date: "May 18, 2026",
            text: "An absolutely magical journey! The guide was incredibly knowledgeable and passionate. The trip to Ifrane exceeded all our expectations."
        },
        {
            id: 2,
            name: "Sarah M.",
            rating: 5,
            date: "May 15, 2026",
            text: "Highly recommend this tour! The private transport was extremely comfortable, and the drinks/snacks provided were local and delicious. Worth every single dirham."
        },
        {
            id: 3,
            name: "Elena R.",
            rating: 4,
            date: "May 10, 2026",
            text: "Morocco's beauty is unmatched. This tour made seeing the Atlas region so easy and stress-free. Very authentic experience."
        }
    ];

    const localStorageKey = `moro_reviews_tour_${id}`;
    const [reviews, setReviews] = useState(() => {
        const saved = localStorage.getItem(localStorageKey);
        return saved ? JSON.parse(saved) : defaultReviews;
    });

    useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(reviews));
    }, [reviews, localStorageKey]);

    // Mock tours — mirrors PlansG mock data so local cards always resolve
    const MOCK_TOURS = [
        { id: 1, titre: 'Trip en forêt', prix: 2500, ville_name: 'Fès', destination: 'Fès', image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80', duree: '2 Days', details: 'Explore the beautiful cedar forests of Fès region. Walk through enchanted pine and cedar trails, spot Barbary macaques, and enjoy panoramic views of the Middle Atlas mountains.', type: 'Guided Tours' },
        { id: 2, titre: 'Tours en bateau', prix: 90, ville_name: 'Tanger', destination: 'Tanger', image_url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80', duree: '3 Hours', details: 'Enjoy a scenic boat tour in the Strait of Gibraltar from Tanger. Watch dolphins, enjoy Atlantic breezes, and see the meeting point of two seas and two continents.', type: 'Private Tours' },
        { id: 3, titre: 'Découverte Chefchaouen', prix: 350, ville_name: 'Chefchaouen', destination: 'Chefchaouen', image_url: 'https://images.unsplash.com/photo-1549944850-84e00be42155?auto=format&fit=crop&w=800&q=80', duree: '1 Day', details: 'Discover the magical blue city of Morocco. Wander through winding blue alleys, visit the Kasbah museum, and experience the unique Berber culture of the Rif mountains.', type: 'Guided Tours' },
        { id: 4, titre: 'Sortie à Ifrane', prix: 449, ville_name: 'Ifrane', destination: 'Ifrane', image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80', duree: '1 Day', details: 'Visit the snowy mountains and charming European-style town of Ifrane. Spot the famous stone lion monument, stroll in the national park and enjoy the fresh mountain air.', type: 'Private Tours' },
        { id: 5, titre: 'Sahara Sunset Trek', prix: 1800, ville_name: 'Merzouga', destination: 'Merzouga', image_url: 'https://images.unsplash.com/photo-1509060464153-44667396260f?auto=format&fit=crop&w=800&q=80', duree: '3 Days', details: 'Ride camels over the golden dunes of Erg Chebbi and sleep under Saharan stars. Experience a magical bivouac dinner, traditional Gnawa music, and a breathtaking sunrise over the desert.', type: 'Guided Tours' },
        { id: 6, titre: 'Marrakech Medina Walk', prix: 150, ville_name: 'Marrakech', destination: 'Marrakech', image_url: 'https://images.unsplash.com/photo-1597212618440-8062a50d6f7b?auto=format&fit=crop&w=800&q=80', duree: '4 Hours', details: 'Explore the vibrant souks, Bahia Palace, and Jemaa el-Fnaa square with a certified local guide. Discover hidden riads, taste street food, and immerse yourself in 1000 years of history.', type: 'Guided Tours' },
        { id: 7, titre: 'Essaouira Atlantic Escape', prix: 950, ville_name: 'Essaouira', destination: 'Essaouira', image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', duree: '1 Day', details: 'Take a private coastal escape to the UNESCO-listed port city of Essaouira. Watch old ramparts, eat freshly grilled sardines, explore the artisan quarter, and enjoy Atlantic sea breezes.', type: 'Private Tours' },
        { id: 8, titre: 'Aït Benhaddou Heritage', prix: 1200, ville_name: 'Ouarzazate', destination: 'Ouarzazate', image_url: 'https://images.unsplash.com/photo-1549944850-84e00be42155?auto=format&fit=crop&w=800&q=80', duree: '2 Days', details: 'Cross the High Atlas to see the UNESCO clay fortress of Aït Benhaddou and Ouarzazate movie studios. Walk through a living ksar, meet local Berber families and explore Cinema City.', type: 'Guided Tours' },
        { id: 9, titre: 'Hot Air Balloon Adventure', prix: 2200, ville_name: 'Marrakech', destination: 'Marrakech', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', duree: '5 Hours', details: 'Float peacefully above Marrakech plains during sunrise in a luxury hot air balloon. Enjoy champagne breakfast after landing, panoramic views of the Atlas mountains and ancient palm groves.', type: 'Private Tours' },
        { id: 10, titre: 'Ouzoud Waterfalls Hike', prix: 290, ville_name: 'Ouzoud', destination: 'Ouzoud', image_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', duree: '1 Day', details: 'Visit the spectacular 110m-high Ouzoud waterfalls, the tallest in North Africa. Watch Barbary macaque monkeys, ride a traditional boat at the base, and hike scenic canyon trails.', type: 'Guided Tours' },
        { id: 11, titre: 'Fes Medieval Heritage', prix: 400, ville_name: 'Fès', destination: 'Fès', image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80', duree: '6 Hours', details: 'Wander inside Fes el Bali — the world\'s largest living medieval city — to see iconic leather tanneries, ornate medersas and the Bou Inania mosque. Experience 9th-century Arab civilization.', type: 'Private Tours' },
    ];

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const response = await api.get(`/plan-tours/${id}`);
                setTour(response.data);
            } catch (error) {
                // API failed — check if it matches a mock tour
                const numericId = Number(id);
                const mockMatch = MOCK_TOURS.find(t => t.id === numericId);
                if (mockMatch) {
                    setTour({ ...mockMatch, image: mockMatch.image_url });
                } else {
                    console.error("Tour not found in API or mock data:", error);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTour();
        window.scrollTo(0, 0);
    }, [id]);

    useLayoutEffect(() => {
        if (loading || !tour || !containerRef.current) return;

        const ctx = gsap.context(() => {
            // Smooth reveal
            gsap.from(".pd-back-link", {
                x: -30,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });

            gsap.from(".pd-hero-content > *", {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out"
            });

            gsap.from(".pd-highlight-item", {
                y: 20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.08,
                ease: "power2.out",
                delay: 0.3
            });

            gsap.from(".pd-tab-btn", {
                y: 10,
                opacity: 0,
                duration: 0.6,
                stagger: 0.05,
                ease: "power2.out",
                delay: 0.5
            });

            gsap.from(".pd-main-card", {
                y: 40,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                delay: 0.6
            });

            gsap.from(".pd-sidebar-widget", {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                delay: 0.7
            });
        }, containerRef.current);

        return () => ctx.revert();
    }, [loading, tour]);

    // Reviews summary math
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) 
        : "0.0";

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
        if (ratingCounts[r.rating] !== undefined) {
            ratingCounts[r.rating]++;
        }
    });

    const getAvatarColor = (name) => {
        const colors = [
            'linear-gradient(135deg, #c0241a 0%, #ef4444 100%)',
            'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
            'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
            'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
        ];
        const index = name ? name.charCodeAt(0) % colors.length : 0;
        return colors[index];
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!newName.trim() || !newText.trim()) return;

        const newReview = {
            id: Date.now(),
            name: newName,
            rating: newRating,
            date: new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
            text: newText
        };

        setReviews([newReview, ...reviews]);
        setNewName("");
        setNewText("");
        setNewRating(5);
    };

    const handleWhatsAppRedirect = () => {
        const guideName = tour.addedBy ? tour.addedBy.split('@')[0] : 'Guide';
        const message = `Hello, I'm interested in booking the tour: "${tour.titre}" in ${tour.ville_name || tour.destination} for ${guestCount} guest(s).`;
        const encodedText = encodeURIComponent(message);
        window.open(`https://wa.me/212600000000?text=${encodedText}`, '_blank');
    };

    if (loading) {
        return (
            <div className="pd-loader-screen">
                <div className="pd-spinner-ring" />
                <p>{t('plans.details.loading') || 'Loading experience...'}</p>
            </div>
        );
    }

    if (!tour) {
        return (
            <div className="pd-error-screen">
                <LuShieldAlert className="pd-error-icon" />
                <h2>{t('plans.details.not_found') || 'Experience Not Found'}</h2>
                <button onClick={() => navigate(-1)} className="pd-primary-btn">
                    <LuArrowLeft /> {t('plans.details.back_btn') || 'Return back'}
                </button>
            </div>
        );
    }

    return (
        <div className="pd-page-root" ref={containerRef}>
            {/* Top glass navbar for back trigger */}
            <div className="pd-top-nav">
                <div className="pd-nav-container">
                    <button onClick={() => navigate(-1)} className="pd-back-link">
                        <LuArrowLeft />
                        <span>{t('plans.details.back') || 'Tours & Experiences'}</span>
                    </button>
                </div>
            </div>

            {/* Immersive Header Banner */}
            <div className="pd-hero-banner">
                <img src={tour.image_url || tour.image} alt={tour.titre} className="pd-hero-img" />
                <div className="pd-hero-gradient" />
                <div className="pd-hero-container">
                    <div className="pd-hero-content">
                        <div className="pd-meta-row">
                            <span className="pd-pill pd-pill-location">
                                <LuMapPin /> {tour.ville_name || tour.destination}
                            </span>
                            <span className="pd-pill pd-pill-badge">
                                <LuStar fill="currentColor" /> {averageRating} ({totalReviews} {t('plans.details.reviews') || 'Reviews'})
                            </span>
                        </div>
                        <h1 className="pd-hero-title">{tour.titre}</h1>
                    </div>
                </div>
            </div>

            <div className="pd-layout-container">
                {/* Horizontal Quick Info grid */}
                <div className="pd-quick-grid">
                    <div className="pd-highlight-item">
                        <div className="pd-h-icon"><LuClock /></div>
                        <div className="pd-h-info">
                            <span className="pd-h-label">{t('plans.details.duration') || 'Duration'}</span>
                            <span className="pd-h-val">{tour.duree}</span>
                        </div>
                    </div>
                    <div className="pd-highlight-item">
                        <div className="pd-h-icon"><LuUsers /></div>
                        <div className="pd-h-info">
                            <span className="pd-h-label">{t('plans.details.type') || 'Group Size'}</span>
                            <span className="pd-h-val">{t('plans.details.private_group') || 'Private Custom'}</span>
                        </div>
                    </div>
                    <div className="pd-highlight-item">
                        <div className="pd-h-icon"><LuLanguages /></div>
                        <div className="pd-h-info">
                            <span className="pd-h-label">Languages</span>
                            <span className="pd-h-val">Fr, En, Ar</span>
                        </div>
                    </div>
                    <div className="pd-highlight-item">
                        <div className="pd-h-icon"><LuCompass /></div>
                        <div className="pd-h-info">
                            <span className="pd-h-label">Departure</span>
                            <span className="pd-h-val">{t('plans.details.flexible') || 'Flexible Time'}</span>
                        </div>
                    </div>
                </div>

                {/* Main Split Layout Grid */}
                <div className="pd-main-layout">
                    {/* Left Column Content */}
                    <div className="pd-content-col">
                        {/* Tab Buttons bar */}
                        <div className="pd-tab-bar">
                            <button 
                                className={`pd-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </button>
                            <button 
                                className={`pd-tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
                                onClick={() => setActiveTab('itinerary')}
                            >
                                Itinerary
                            </button>
                            <button 
                                className={`pd-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                                onClick={() => setActiveTab('reviews')}
                            >
                                Reviews ({totalReviews})
                            </button>
                        </div>

                        {/* Dynamic tab contents panel */}
                        <div className="pd-main-card">
                            {activeTab === 'overview' && (
                                <div className="pd-tab-content anim-fade">
                                    <div className="pd-section-block">
                                        <h3 className="pd-sec-title">{t('plans.details.about') || 'About this experience'}</h3>
                                        <p className="pd-description-p">{tour.details}</p>
                                    </div>

                                    <div className="pd-divider" />

                                    <div className="pd-section-block">
                                        <h3 className="pd-sec-title">{t('plans.details.included') || "What's Included"}</h3>
                                        <div className="pd-inclusion-grid">
                                            <div className="pd-inc-item positive">
                                                <div className="pd-chk"><LuCheck /></div>
                                                <span>{t('plans.details.guide') || 'Professional multilingual guide'}</span>
                                            </div>
                                            <div className="pd-inc-item positive">
                                                <div className="pd-chk"><LuCheck /></div>
                                                <span>{t('plans.details.transport') || 'Air-conditioned luxury private van'}</span>
                                            </div>
                                            <div className="pd-inc-item positive">
                                                <div className="pd-chk"><LuCheck /></div>
                                                <span>{t('plans.details.drinks') || 'Local tea, fresh juice and mineral water'}</span>
                                            </div>
                                            <div className="pd-inc-item positive">
                                                <div className="pd-chk"><LuCheck /></div>
                                                <span>{t('plans.details.authentic') || 'Authentic traditional landmarks entry'}</span>
                                            </div>
                                            <div className="pd-inc-item negative">
                                                <div className="pd-chk"><LuX /></div>
                                                <span>Meals / Lunch expenses</span>
                                            </div>
                                            <div className="pd-inc-item negative">
                                                <div className="pd-chk"><LuX /></div>
                                                <span>Graturities & tips for host</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'itinerary' && (
                                <div className="pd-tab-content anim-fade">
                                    <h3 className="pd-sec-title">Journey Itinerary</h3>
                                    <p className="pd-itinerary-intro">
                                        Here is a structured overview of what you will experience during this private tour. Timings can be adapted dynamically to suit your mood.
                                    </p>
                                    <div className="pd-timeline">
                                        <div className="pd-timeline-item">
                                            <div className="pd-t-marker">1</div>
                                            <div className="pd-t-content">
                                                <h4>Morning Departure & Briefing</h4>
                                                <p>Pick up from your hotel or preferred riad location in a high-end luxury vehicle. Meet your certified guide and discuss daily schedule.</p>
                                            </div>
                                        </div>
                                        <div className="pd-timeline-item">
                                            <div className="pd-t-marker">2</div>
                                            <div className="pd-t-content">
                                                <h4>Sightseeing & Guided Walk</h4>
                                                <p>Visit historic sites, natural treasures, and high-interest landmarks. Gain insightful cultural context from your local host.</p>
                                            </div>
                                        </div>
                                        <div className="pd-timeline-item">
                                            <div className="pd-t-marker">3</div>
                                            <div className="pd-t-content">
                                                <h4>Authentic Local Tea Break</h4>
                                                <p>Relax and unwind with freshly brewed traditional Moroccan mint tea accompanied by sweet artisanal snacks in a panoramic lounge.</p>
                                            </div>
                                        </div>
                                        <div className="pd-timeline-item">
                                            <div className="pd-t-marker">4</div>
                                            <div className="pd-t-content">
                                                <h4>Return & Riad Drop-Off</h4>
                                                <p>Enjoy a scenic, stress-free return transfer directly to your original pickup destination. Receive customized recommendations for the rest of your trip.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="pd-tab-content anim-fade">
                                    {/* Ratings dashboard */}
                                    <div className="pd-ratings-dashboard">
                                        <div className="pd-score-card">
                                            <span className="pd-score-num">{averageRating}</span>
                                            <div className="pd-stars-glow">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <LuStar 
                                                        key={star} 
                                                        className={star <= Math.round(averageRating) ? "star-filled" : "star-empty"}
                                                        fill={star <= Math.round(averageRating) ? "currentColor" : "none"}
                                                    />
                                                ))}
                                            </div>
                                            <span className="pd-score-lbl">
                                                Based on {totalReviews} reviews
                                            </span>
                                        </div>

                                        <div className="pd-breakdown-card">
                                            {[5, 4, 3, 2, 1].map((stars) => {
                                                const count = ratingCounts[stars] || 0;
                                                const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                                                return (
                                                    <div className="pd-breakdown-row" key={stars}>
                                                        <span className="pd-b-star-lbl">{stars} Star</span>
                                                        <div className="pd-b-progress-bg">
                                                            <div className="pd-b-progress-fill" style={{ width: `${percent}%` }} />
                                                        </div>
                                                        <span className="pd-b-count">{Math.round(percent)}%</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Reviews list */}
                                    <div className="pd-reviews-list">
                                        {reviews.map((review) => (
                                            <div className="pd-review-card" key={review.id}>
                                                <div className="pd-rev-header">
                                                    <div className="pd-rev-user">
                                                        <div className="pd-avatar" style={{ background: getAvatarColor(review.name) }}>
                                                            {review.name ? review.name.charAt(0).toUpperCase() : 'U'}
                                                        </div>
                                                        <div className="pd-rev-name-group">
                                                            <span className="pd-rev-name">{review.name}</span>
                                                            <span className="pd-rev-date">{review.date}</span>
                                                        </div>
                                                    </div>
                                                    <div className="pd-rev-stars">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <LuStar 
                                                                key={star} 
                                                                fill={star <= review.rating ? "currentColor" : "none"} 
                                                                className={star <= review.rating ? "star-filled" : "star-empty"}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="pd-rev-body">{review.text}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Form wrapper */}
                                    <div className="pd-review-form-container">
                                        <h4>{t('plans.details.write_review') || 'Write a review'}</h4>
                                        <p className="pd-form-subtitle">Share your unique moments & honest thoughts with others.</p>
                                        
                                        <form onSubmit={handleSubmitReview} className="pd-actual-form">
                                            <div className="pd-interactive-rating">
                                                <span>Your overall rating:</span>
                                                <div className="pd-star-selectors">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            className={`pd-star-sel-btn ${(hoverRating || newRating) >= star ? 'active' : ''}`}
                                                            onClick={() => setNewRating(star)}
                                                            onMouseEnter={() => setHoverRating(star)}
                                                            onMouseLeave={() => setHoverRating(0)}
                                                        >
                                                            <LuStar fill={(hoverRating || newRating) >= star ? "currentColor" : "none"} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pd-form-row">
                                                <div className="pd-input-wrap">
                                                    <label>{t('plans.details.form_name') || 'Your Name'}</label>
                                                    <input 
                                                        type="text" 
                                                        required 
                                                        placeholder="e.g. Amina Benjelloun"
                                                        value={newName}
                                                        onChange={(e) => setNewName(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="pd-input-wrap">
                                                <label>{t('plans.details.form_review') || 'Your Review'}</label>
                                                <textarea 
                                                    required 
                                                    rows={4}
                                                    placeholder="Describe your tour! What did you like the most?"
                                                    value={newText}
                                                    onChange={(e) => setNewText(e.target.value)}
                                                />
                                            </div>

                                            <button type="submit" className="pd-submit-rev-btn">
                                                <LuSend /> {t('plans.details.submit_review') || 'Publish Review'}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column Booking Sidebar */}
                    <div className="pd-sidebar-col">
                        <div className="pd-sidebar-widget">
                            {/* Price Header */}
                            <div className="pd-widget-price">
                                <span className="pd-price-lbl">{t('plans.details.starting_at') || 'Price starts from'}</span>
                                <div className="pd-price-row">
                                    <span className="pd-price-num">{tour.prix}</span>
                                    <span className="pd-price-curr">DH</span>
                                </div>
                                <span className="pd-price-tax-info">All inclusive price • No booking fees</span>
                            </div>

                            <div className="pd-w-divider" />

                            {/* Guest selector */}
                            <div className="pd-widget-guests">
                                <span className="pd-g-label">Select Number of Guests</span>
                                <div className="pd-guest-counter">
                                    <button 
                                        type="button" 
                                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                                        className="pd-count-btn"
                                        disabled={guestCount <= 1}
                                    >
                                        <LuMinus />
                                    </button>
                                    <span className="pd-count-display">{guestCount}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => setGuestCount(guestCount + 1)}
                                        className="pd-count-btn"
                                    >
                                        <LuPlus />
                                    </button>
                                </div>
                            </div>

                            {/* Offered By Host Profile */}
                            <div className="pd-widget-host">
                                <div className="pd-host-avatar">
                                    {tour.addedBy ? tour.addedBy.charAt(0).toUpperCase() : 'H'}
                                    <LuBadgeCheck className="pd-host-badge" />
                                </div>
                                <div className="pd-host-info">
                                    <span className="pd-host-sub">{t('plans.details.offered_by') || 'Hosted by'}</span>
                                    <span className="pd-host-name">{tour.addedBy ? tour.addedBy.split('@')[0] : 'Local Guide'}</span>
                                </div>
                            </div>

                            {/* Booking Action Buttons */}
                            <div className="pd-action-stack">
                                <button onClick={handleWhatsAppRedirect} className="pd-btn-whatsapp">
                                    <LuMessageCircle />
                                    <span>Book Tour via WhatsApp</span>
                                </button>
                                <button className="pd-btn-favorite">
                                    <LuHeart />
                                    <span>Add to Wishlist</span>
                                </button>
                            </div>

                            <p className="pd-secure-p">
                                <LuShieldAlert /> {t('plans.details.secure_booking') || 'Your inquiry is 100% secure. You pay local hosts directly upon pick up.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanDetails;
