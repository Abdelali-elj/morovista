import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import api from '../../api';
import { Link, useLocation } from 'react-router-dom';
import {
    LuChevronLeft, LuChevronRight, LuMapPin, LuStar, LuSearch,
    LuCalendar, LuLayers, LuRefreshCw, LuCompass, LuHeart, LuPlus, LuMinus
} from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'swiper/css';
import 'swiper/css/navigation';
import '../../css/plans.css';

gsap.registerPlugin(ScrollTrigger);

const PlansG = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const isToursPage = location.pathname.toLowerCase() === '/tours';
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [navigationReady, setNavigationReady] = useState(false);
    const [activeTab, setActiveTab] = useState('All Tours');
    const tabs = ['All Tours', 'Guided Tours', 'Private Tours'];
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const sectionRef = useRef(null);

    const [searchCity, setSearchCity] = useState('');
    const [maxPrice, setMaxPrice] = useState(3000);
    const [selectedDays, setSelectedDays] = useState('any');
    const [showFavorites, setShowFavorites] = useState(false);
    const [likedItems, setLikedItems] = useState([]);

    const STORAGE_BASE = 'http://127.0.0.1:8000/storage/';

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            const savedLikes = localStorage.getItem(`favorited_plans_${user.id}`);
            if (savedLikes) {
                setLikedItems(JSON.parse(savedLikes));
            }
        }
    }, []);

    const toggleLike = (e, tourId) => {
        e.preventDefault();
        e.stopPropagation();
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
            alert('Veuillez vous connecter pour ajouter aux favoris.');
            return;
        }
        const user = JSON.parse(savedUser);
        let updatedLikedItems;
        if (likedItems.includes(tourId)) {
            updatedLikedItems = likedItems.filter(id => id !== tourId);
        } else {
            updatedLikedItems = [...likedItems, tourId];
        }
        setLikedItems(updatedLikedItems);
        localStorage.setItem(`favorited_plans_${user.id}`, JSON.stringify(updatedLikedItems));
    };

    const resolveImage = (image_url) => {
        if (!image_url) return null;
        if (image_url.startsWith('http') || image_url.startsWith('data:')) return image_url;
        return STORAGE_BASE + image_url.replace(/^\//, '');
    };

    const getMockTours = () => [
        { id: 1, titre: 'Trip en forêt', prix: 2500, ville_name: 'Fès', destination: 'Fès', image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80', duree: '2 Days', details: 'Explore the beautiful forests of Fès', type: 'Guided Tours' },
        { id: 2, titre: 'Tours en bateau', prix: 90, ville_name: 'Tanger', destination: 'Tanger', image_url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80', duree: '3 Hours', details: 'Enjoy boat tours in Tanger', type: 'Private Tours' },
        { id: 3, titre: 'Découverte Chefchaouen', prix: 350, ville_name: 'Chefchaouen', destination: 'Chefchaouen', image_url: 'https://images.unsplash.com/photo-1549944850-84e00be42155?auto=format&fit=crop&w=800&q=80', duree: '1 Day', details: 'Discover the blue city of Morocco', type: 'Guided Tours' },
        { id: 4, titre: 'Sortie à Ifrane', prix: 449, ville_name: 'Ifrane', destination: 'Ifrane', image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80', duree: '1 Day', details: 'Visit the snowy mountains of Ifrane', type: 'Private Tours' },
        { id: 5, titre: 'Sahara Sunset Trek', prix: 1800, ville_name: 'Merzouga', destination: 'Merzouga', image_url: 'https://images.unsplash.com/photo-1509060464153-44667396260f?auto=format&fit=crop&w=800&q=80', duree: '3 Days', details: 'Ride camels over the golden dunes of Erg Chebbi.', type: 'Guided Tours' },
        { id: 6, titre: 'Marrakech Medina Walk', prix: 150, ville_name: 'Marrakech', destination: 'Marrakech', image_url: 'https://images.unsplash.com/photo-1597212618440-8062a50d6f7b?auto=format&fit=crop&w=800&q=80', duree: '4 Hours', details: 'Explore the vibrant souks, Bahia Palace, and Jemaa el-Fnaa square.', type: 'Guided Tours' },
        { id: 7, titre: 'Essaouira Atlantic Escape', prix: 950, ville_name: 'Essaouira', destination: 'Essaouira', image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', duree: '1 Day', details: 'Take a private coastal escape to watch old ramparts.', type: 'Private Tours' },
        { id: 8, titre: 'Aït Benhaddou Heritage', prix: 1200, ville_name: 'Ouarzazate', destination: 'Ouarzazate', image_url: 'https://images.unsplash.com/photo-1549944850-84e00be42155?auto=format&fit=crop&w=800&q=80', duree: '2 Days', details: 'Cross High Atlas to see UNESCO clay fortress.', type: 'Guided Tours' },
        { id: 9, titre: 'Hot Air Balloon Adventure', prix: 2200, ville_name: 'Marrakech', destination: 'Marrakech', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', duree: '5 Hours', details: 'Float peacefully above Marrakech plains during sunrise.', type: 'Private Tours' },
        { id: 10, titre: 'Ouzoud Waterfalls Hike', prix: 290, ville_name: 'Ouzoud', destination: 'Ouzoud', image_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', duree: '1 Day', details: 'Visit spectacular 110m high waterfalls, meet monkeys.', type: 'Guided Tours' },
        { id: 11, titre: 'Fes Medieval Heritage', prix: 400, ville_name: 'Fès', destination: 'Fès', image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80', duree: '6 Hours', details: 'Wander inside Fes el Bali to see iconic tanneries.', type: 'Private Tours' },
    ];

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await api.get('/plan-tours');
                const data = response.data.map(item => ({
                    ...item,
                    image: resolveImage(item.image_url),
                }));
                const mappedMocks = getMockTours().map(item => ({ ...item, image: item.image_url }));
                setTours([...data, ...mappedMocks.slice(4)]);
            } catch {
                const mappedMocks = getMockTours().map(item => ({ ...item, image: item.image_url }));
                setTours(mappedMocks);
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    useEffect(() => {
        if (!loading && tours.length > 0) setNavigationReady(true);
    }, [loading, tours]);

    useLayoutEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from('.pt-eyebrow, .pt-title, .pt-subtitle', {
                y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
                scrollTrigger: { trigger: '.pt-hero-header', start: 'top 85%', once: true },
            });
            gsap.from('.pt-filter-block', {
                y: 20, opacity: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: '.pt-hero-header', start: 'top 85%', once: true },
            });
            gsap.from('.pt-right', {
                y: 35, opacity: 0, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: '.pt-right', start: 'top 85%', once: true },
            });
        }, sectionRef.current);
        return () => ctx.revert();
    }, [loading, tours.length]);

    const getMockRating = (id) => {
        const ratings = ['4.8', '4.9', '5.0', '4.7', '4.9', '4.8', '4.9', '5.0'];
        const reviewCounts = ['1.2k', '950', '2k', '780', '1.1k', '650', '1.4k', '890'];
        const index = id ? (Number(id) || 0) % ratings.length : 0;
        return { rating: ratings[index], reviews: reviewCounts[index] };
    };

    const getTourTag = (tour) => {
        const title = (tour.titre || '').toLowerCase();
        const dest = (tour.ville_name || tour.destination || '').toLowerCase();
        if (title.includes('desert') || title.includes('sahara') || title.includes('dune')) return 'Desert Safari';
        if (title.includes('beach') || title.includes('sea') || dest.includes('essaouira') || dest.includes('tanger')) return 'Beach Paradise';
        if (title.includes('mountain') || title.includes('atlas') || title.includes('trek') || title.includes('ifrane')) return 'Mountain Getaway';
        if (title.includes('bateau') || title.includes('boat')) return 'Boat Tour';
        if (title.includes('balloon')) return 'Air Adventure';
        return 'Cultural Journey';
    };

    const filteredTours = tours.filter(tour => {
        // 1. Check Favorites (If enabled, only allow liked items)
        if (showFavorites && !likedItems.includes(tour.id)) {
            return false;
        }

        // 2. Check Search (City or Title)
        const city = (tour.ville_name || tour.destination || '').toLowerCase();
        const title = (tour.titre || '').toLowerCase();
        const searchTerm = searchCity.toLowerCase();
        const cityMatch = city.includes(searchTerm) || title.includes(searchTerm);

        // 3. Check Price
        const tourPrice = Number(tour.prix) || 0;
        const priceMatch = tourPrice <= maxPrice;

        // 4. Check Duration (Days)
        let daysMatch = true;
        if (selectedDays !== 'any') {
            const durationNum = parseInt(String(tour.duree || '').replace(/\D/g, '')) || 0;
            if (selectedDays === '1-2') daysMatch = durationNum > 0 && durationNum <= 2;
            else if (selectedDays === '3-5') daysMatch = durationNum >= 3 && durationNum <= 5;
            else if (selectedDays === '6+') daysMatch = durationNum >= 6;
        }

        // 5. Check Tab (Type)
        let tabMatch = true;
        if (activeTab !== 'All Tours') {
            const tourType = tour.type || (tour.id % 2 === 0 ? 'Private Tours' : 'Guided Tours');
            tabMatch = tourType === activeTab;
        }

        return cityMatch && priceMatch && daysMatch && tabMatch;
    });

    const hasActiveFilter = searchCity !== '' || maxPrice !== 3000 || selectedDays !== 'any' || showFavorites;

    const renderCard = (tour) => {
        const { rating, reviews } = getMockRating(tour.id);
        const tourTag = getTourTag(tour);
        const tourType = tour.type || (tour.id % 2 === 0 ? 'Private Tours' : 'Guided Tours');
        const isLiked = likedItems.includes(tour.id);
        return (
            <Link to={`/PlanDetails/${tour.id}`} className="pt-card">
                <div className="pt-card-price-badge">
                    {t('plans.details.starting_at') || 'À partir de'} {tour.prix} DH
                </div>
                <button
                    className={`pt-like-btn ${isLiked ? 'active' : ''}`}
                    onClick={(e) => toggleLike(e, tour.id)}
                >
                    <LuHeart fill={isLiked ? "currentColor" : "none"} />
                </button>
                <img
                    src={tour.image || tour.image_url}
                    alt={tour.titre}
                    className="pt-card-img"
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
                    }}
                />
                <div className="pt-card-overlay" />
                <div className="pt-card-details">
                    <h3 className="pt-card-title">{tour.titre}</h3>
                    <div className="pt-card-rating-line">
                        <span>{tour.ville_name || tour.destination || 'Morocco'}</span>
                        <span className="pt-card-divider">|</span>
                        <LuStar className="pt-star-icon" fill="currentColor" />
                        <span className="pt-rating-val">{rating}</span>
                        <span className="pt-reviews-count">({reviews})</span>
                    </div>
                    <div className="pt-card-location-line">
                        <LuMapPin className="pt-location-icon" />
                        <span>{tour.ville_name || tour.destination || 'Morocco'}, Morocco</span>
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <section className="pt-section" id="plans" ref={sectionRef}>
            <div className="pt-container">

                {isToursPage && (
                    <div className="pt-back-btn-wrapper">
                        <Link to="/" className="pt-back-to-home">
                            <LuChevronLeft /> <span>{t('common.back_home') || 'Back to Home'}</span>
                        </Link>
                    </div>
                )}

                {/* ── HERO HEADER ── */}
                <div className="pt-hero-header">
                    <div className="pt-header-left">
                        <div className="pt-eyebrow">
                            {t('plans.eyebrow') || 'Curated Moroccan Journeys'}
                        </div>
                        <h2 className="pt-title">
                            Discover Our Plans &amp; <span>Tours</span>
                        </h2>
                        <p className="pt-subtitle">
                            {t('plans.subtitle') || 'Handpicked premium Moroccan travel experiences curated just for you.'}
                        </p>
                    </div>
                </div>

                {/* ── NEW SEARCH & FILTER ZONE ── */}
                <div className="pt-search-zone">
                    <div className="pt-search-bar-wrapper">
                        <LuSearch className="pt-search-icon" />
                        <input
                            type="text"
                            placeholder={t('plans.search_placeholder') || "Search destination or tour..."}
                            value={searchCity}
                            onChange={(e) => { setSearchCity(e.target.value); setShowFavorites(false); }}
                            className="pt-search-input"
                        />
                    </div>

                    <div className="pt-filter-actions">
                        <button
                            className={`pt-action-btn ${showFavorites ? 'active' : ''}`}
                            onClick={() => setShowFavorites(!showFavorites)}
                        >
                            <LuHeart fill={showFavorites ? "currentColor" : "none"} />
                            <span>My Favorites</span>
                        </button>

                        <div className="pt-price-filter">
                            <span className="pt-filter-label">Max Price:</span>
                            <div className="pt-price-controls">
                                <button onClick={() => setMaxPrice(p => Math.max(200, p - 100))}><LuMinus /></button>
                                <span className="pt-price-display">{maxPrice} DH</span>
                                <button onClick={() => setMaxPrice(p => Math.min(10000, p + 100))}><LuPlus /></button>
                            </div>
                        </div>

                        {hasActiveFilter && (
                            <button
                                className="pt-reset-action"
                                onClick={() => { setSearchCity(''); setMaxPrice(3000); setSelectedDays('any'); setShowFavorites(false); }}
                            >
                                <LuRefreshCw />
                            </button>
                        )}
                    </div>
                </div>

                {/* ── CARDS ── */}
                <div className="pt-right">
                    {loading ? (
                        <div className="pt-loading"><div className="pt-spinner" /></div>
                    ) : filteredTours.length === 0 ? (
                        <div className="pt-empty"><p>No tours match your filter criteria.</p></div>
                    ) : isToursPage ? (
                        <div className="tours-grid-layout">
                            {filteredTours.map(tour => (
                                <div key={tour.id} className="tours-grid-card">{renderCard(tour)}</div>
                            ))}
                        </div>
                    ) : (
                        <Swiper
                            key={`${filteredTours.length}-${navigationReady}-${searchCity}-${maxPrice}-${selectedDays}`}
                            modules={[Navigation, Autoplay]}
                            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                            onBeforeInit={swiper => {
                                swiper.params.navigation.prevEl = prevRef.current;
                                swiper.params.navigation.nextEl = nextRef.current;
                            }}
                            autoplay={{ delay: 4200, disableOnInteraction: false, pauseOnMouseEnter: true }}
                            loop={filteredTours.length >= 4}
                            speed={700}
                            slidesPerView={1}
                            spaceBetween={20}
                            breakpoints={{
                                320: { slidesPerView: 1.1, spaceBetween: 12 },
                                480: { slidesPerView: 2.1, spaceBetween: 16 },
                                768: { slidesPerView: 2.5, spaceBetween: 20 },
                                1024: { slidesPerView: 3.2, spaceBetween: 24 },
                                1400: { slidesPerView: 4, spaceBetween: 28 },
                            }}
                            className="pt-swiper"
                        >
                            {filteredTours.map(tour => (
                                <SwiperSlide key={tour.id}>{renderCard(tour)}</SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>

                {/* ── FOOTER ROW ── */}
                {!isToursPage && (
                    <div className="pt-footer-row">
                        <Link to="/Tours" className="pt-view-btn">
                            <LuCompass /> {t('plans.view_more') || 'View all tours'}
                        </Link>
                        <div className="pt-nav-controls">
                            <button ref={prevRef} className="pt-nav-btn pt-prev" aria-label="Previous">
                                <LuChevronLeft />
                            </button>
                            <button ref={nextRef} className="pt-nav-btn pt-next" aria-label="Next">
                                <LuChevronRight />
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
};

export default PlansG;
