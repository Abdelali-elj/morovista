import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
    LuHouse,
    LuStar,
    LuMenu,
    LuX,
    LuPhoneCall,
    LuChevronDown,
    LuWrench,
    LuUser,
    LuLayoutDashboard,
    LuLogOut,
    LuSettings,
    LuSearch,
    LuHeart,
    LuGlobe,
    LuMapPin,
    LuMap
} from "react-icons/lu";
import { FaAmbulance, FaTrain, FaInfoCircle, FaExclamationTriangle, FaBalanceScale, FaPhoneVolume } from "react-icons/fa";
import { MdOutlineLocalPolice, MdOutlineFireTruck } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import api from '../api';


function Navbar() {
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false); // clicked state
    const [dropdownHover, setDropdownHover] = useState(false); // hover state
    const [langDropdownOpen, setLangDropdownOpen] = useState(false); // clicked state
    const [langDropdownHover, setLangDropdownHover] = useState(false); // hover state
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false); // clicked state
    const [profileDropdownHover, setProfileDropdownHover] = useState(false); // hover state
    const [localData, setLocalData] = useState({ hotels: [], restaurant: [], localServices: [] });

    
    // Search States
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    
    const getEmergencyIcon = (nom) => {
        const lowerNom = (nom || "").toLowerCase();
        if (lowerNom.includes("police")) return <MdOutlineLocalPolice className="urgency-icon police" />;
        if (lowerNom.includes("pompier")) return <MdOutlineFireTruck className="urgency-icon fire" />;
        if (lowerNom.includes("ambulance")) return <FaAmbulance className="urgency-icon medical" />;
        if (lowerNom.includes("oncf")) return <FaTrain className="urgency-icon transport" />;
        if (lowerNom.includes("secours")) return <FaExclamationTriangle className="urgency-icon emergency" />;
        if (lowerNom.includes("renseignement")) return <FaInfoCircle className="urgency-icon info" />;
        if (lowerNom.includes("corruption")) return <FaBalanceScale className="urgency-icon justice" />;
        return <FaPhoneVolume className="urgency-icon general" />;
    };
    
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    
    // Refs for clicking outside
    const toolsRef = useRef(null);
    const langRef = useRef(null);
    const profileRef = useRef(null);
    const searchRef = useRef(null);
    const burgerRef = useRef(null);

    useEffect(() => {
        let lastScrollY = window.scrollY;
        
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrolled(currentScrollY > 50);

            // Smart Header Logic
            if (currentScrollY > lastScrollY && currentScrollY > 150) {
                // Scrolling Down - Hide
                gsap.to(".modern-nav", { y: "-100%", duration: 0.4, ease: "power2.out" });
            } else {
                // Scrolling Up - Show
                gsap.to(".modern-nav", { y: "0%", duration: 0.4, ease: "power2.out" });
            }
            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);


        document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

        // Click outside listener
        const handleClickOutside = (event) => {
            if (toolsRef.current && !toolsRef.current.contains(event.target)) setDropdownOpen(false);
            if (langRef.current && !langRef.current.contains(event.target)) setLangDropdownOpen(false);
            if (profileRef.current && !profileRef.current.contains(event.target)) setProfileDropdownOpen(false);
            if (burgerRef.current && !burgerRef.current.contains(event.target)) setIsOpen(false);
            
            // Search outside click - ignore search trigger button itself to prevent immediate toggling back
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                const triggerBtn = document.querySelector('.search-trigger-btn');
                if (triggerBtn && triggerBtn.contains(event.target)) return;
                
                setIsSearchOpen(false);
                setSearchQuery("");
                setSearchResults([]);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [i18n.language]);

    // Scroll Lock when search overlay is open
    useEffect(() => {
        if (isSearchOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isSearchOpen]);

    // ESC keydown listener to close search
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsSearchOpen(false);
                setSearchQuery("");
                setSearchResults([]);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Pre-load search data from Firebase and API once
    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch Laravel API Data
                const [hotelsRes, restauRes] = await Promise.all([
                    api.get('/hotels'),
                    api.get('/restaurants')
                ]);

                // Fetch Firebase Data
                const [servicesSnap, phonesSnap, toursSnap] = await Promise.all([
                    getDocs(collection(db, 'localServices')),
                    getDocs(collection(db, 'PhoneN')),
                    getDocs(collection(db, 'tours'))
                ]);

                setLocalData({
                    hotels: hotelsRes.data.map(item => ({ ...item, photo: item.photo_url, ville: item.ville_name })),
                    restaurant: restauRes.data.map(item => ({ ...item, photo: item.photo_url, ville: item.ville_name })),
                    localServices: servicesSnap.docs.map(d => ({ id: d.id, ...d.data() })),
                    phones: phonesSnap.docs.map(d => ({ id: d.id, ...d.data() })),
                    tours: toursSnap.docs.map(d => ({ id: d.id, ...d.data() }))
                });
            } catch (e) {
                console.error('Search data preload error:', e);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (searchQuery.trim().length > 1) {
            const query = searchQuery.toLowerCase();
            const results = [];

            // Search Hotels
            localData.hotels.forEach(item => {
                const name = item?.nom || "";
                const city = item?.ville || "";
                if (name.toLowerCase().includes(query) || city.toLowerCase().includes(query)) {
                    results.push({ ...item, nom: name, ville: city, typeLabel: 'Hotel', linkPrefix: '/Hotels' });
                }
            });

            // Search Restaurants
            localData.restaurant.forEach(item => {
                const name = item?.nom || "";
                const city = item?.ville || "";
                if (name.toLowerCase().includes(query) || city.toLowerCase().includes(query)) {
                    results.push({ ...item, nom: name, ville: city, typeLabel: 'Restaurant', linkPrefix: '/Restaurant' });
                }
            });

            // Search Local Services
            localData.localServices?.forEach(item => {
                const name = item?.nom || "";
                const city = item?.ville || "";
                if (name.toLowerCase().includes(query) || city.toLowerCase().includes(query)) {
                    results.push({ ...item, nom: name, ville: city, typeLabel: item?.type || 'Service', linkPrefix: '/LocalServices' });
                }
            });

            // Search Phones (Emergency)
            localData.phones?.forEach(item => {
                const name = item?.nom || "";
                if (name.toLowerCase().includes(query)) {
                    results.push({ ...item, nom: name, ville: 'Maroc', typeLabel: 'Urgence', linkPrefix: '/PhoneList' });
                }
            });

            // Search Tours (Plan et Tours)
            localData.tours?.forEach(item => {
                const name = item?.title || item?.nom || "";
                const city = item?.location || item?.ville || "";
                if (name.toLowerCase().includes(query) || city.toLowerCase().includes(query)) {
                    results.push({ ...item, nom: name, ville: city, typeLabel: 'Tour', linkPrefix: '/PlanDetails' });
                }
            });

            setSearchResults(results.slice(0, 8)); // Limit results
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, localData]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };


    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen) {
            setTimeout(() => document.getElementById('nav-search-input')?.focus(), 100);
        } else {
            setSearchQuery("");
            setSearchResults([]);
        }
    };

    const goToSection = (id) => {
        setIsOpen(false);
        const isHome = window.location.pathname === "/";
        
        if (!isHome) {
            navigate("/");
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    const offset = 80; // Account for fixed navbar
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }, 500); // Wait longer for components to mount on page change
        } else {
            const element = document.getElementById(id);
            if (element) {
                const offset = 80;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = element.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }
    };

    const languages = [
        { code: "fr", name: "Français" },
        { code: "en", name: "English" },
        { code: "ar", name: "العربية" },
        { code: "es", name: "Español" }
    ];

    return (
        <nav className={`navbar ${(scrolled || !isHomePage) ? 'scrolled' : ''}`}>

            <div className="navbar-container">
                <Link to="/" className="mobile-logo">
                    <img src="/logo-pfe1.webp" alt="Logo" />
                </Link>

                <div className="nav-links desktop-nav">
                    <Link to="/" className="nav-logo-link">
                        <div className="logo-wrapper">
                            <img src="/logo-pfe1.webp" alt="Logo" />
                        </div>
                    </Link>

                    <button className="nav-link" onClick={() => goToSection('home')}>
                        <LuHouse className="nav-icon" />
                        <span>{t('nav.home')}</span>
                    </button>

                    <button className="nav-link" onClick={() => goToSection("services")}>
                        <LuStar className="nav-icon" />
                        <span>{t('nav.services')}</span>
                    </button>

                    <div className="tools-dropdown" ref={toolsRef}
                        onMouseEnter={() => setDropdownHover(true)}
                        onMouseLeave={() => setDropdownHover(false)}>
                        <button className={`nav-link ${(dropdownOpen || dropdownHover) ? 'active' : ''}`} 
                                onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <LuWrench className="nav-icon" />
                            <span>{t('nav.tools')}</span>
                            <LuChevronDown className={`dropdown-chevron ${(dropdownOpen || dropdownHover) ? 'rotate' : ''}`} />
                        </button>
                        {(dropdownOpen || dropdownHover) && (
                            <div className="dropdown-menu show">
                                <Link to="/Exchange" className="dropdown-item" onClick={() => setDropdownOpen(false)}>{t('tools.exchange')}</Link>
                                <Link to="/PhoneList" className="dropdown-item" onClick={() => setDropdownOpen(false)}>{t('tools.phone_list')}</Link>
                                <Link to="/Weather" className="dropdown-item" onClick={() => setDropdownOpen(false)}>{t('tools.weather')}</Link>
                            </div>
                        )}
                    </div>

                    <Link to="/Contact" className="nav-link nav-link-contact">
                        <LuPhoneCall className="nav-icon" />
                        <span>{t('nav.contact')}</span>
                    </Link>

                    <Link to="/MyPlan" className="nav-my-plan-btn" title={t('nav.my_plan', 'My Plan')}>
                        <LuMap className="nav-icon" />
                        <span>{t('nav.my_plan', 'My Plan')}</span>
                    </Link>
                </div>

                <div className="navbar-actions">
                    <button 
                        className={`nav-icon-btn search-trigger-btn ${isSearchOpen ? 'active' : ''}`} 
                        onClick={toggleSearch}
                        title={t('nav.search') || "Rechercher"}
                    >
                        {isSearchOpen ? <LuX /> : <LuSearch />}
                    </button>

                    <button 
                        className="nav-icon-btn" 
                        onClick={() => navigate('/Dashboard', { state: { tab: 'favorites' } })}
                        title={t('nav.favorites') || "Mes Favoris"}
                    >
                        <LuHeart />
                    </button>

                    <div className="lang-dropdown" ref={langRef}
                        onMouseEnter={() => setLangDropdownHover(true)}
                        onMouseLeave={() => setLangDropdownHover(false)}>
                        <button className="nav-icon-btn" onClick={() => setLangDropdownOpen(!langDropdownOpen)}>
                            <LuGlobe />
                        </button>
                        {(langDropdownOpen || langDropdownHover) && (
                            <div className="dropdown-menu show">
                                {languages.map(l => (
                                    <button 
                                        key={l.code} 
                                        className="dropdown-item" 
                                        onClick={() => {
                                            i18n.changeLanguage(l.code);
                                            setLangDropdownOpen(false);
                                        }}
                                    >
                                        {l.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="nav-divider"></div>

                    {user ? (
                        <div className="user-profile-dropdown" ref={profileRef}
                            onMouseEnter={() => setProfileDropdownHover(true)}
                            onMouseLeave={() => setProfileDropdownHover(false)}>
                            <button className="user-trigger-new" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                                <span className="user-name-text">{user.name}</span>
                            </button>
                            {(profileDropdownOpen || profileDropdownHover) && (
                                <div className="dropdown-menu show">
                                    {(user.role === 'admin' || user.userType === 'admin') && <Link to="/AdminDashboard" className="dropdown-item" onClick={() => setProfileDropdownOpen(false)}>Admin Panel</Link>}
                                    <Link to="/Dashboard" className="dropdown-item" onClick={() => setProfileDropdownOpen(false)}>My Dashboard</Link>
                                    <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/Login" className="user-trigger-new">
                            <div className="user-avatar"><LuUser /></div>
                            <span className="user-name-text">Login</span>
                        </Link>
                    )}

                    <div className="burger-menu-wrapper" ref={burgerRef}>
                        <div className="burger" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <LuX /> : <LuMenu />}
                        </div>

                        <div className={`nav-links mobile-nav ${isOpen ? "open" : ""}`}>
                            <button className="nav-link" onClick={() => goToSection('home')}>
                                <LuHouse className="nav-icon" />
                                <span>{t('nav.home')}</span>
                            </button>

                            <button className="nav-link" onClick={() => goToSection("services")}>
                                <LuStar className="nav-icon" />
                                <span>{t('nav.services')}</span>
                            </button>

                            <div className="tools-dropdown mobile-tools">
                                <button className="nav-link" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                    <LuWrench className="nav-icon" />
                                    <span>{t('nav.tools')}</span>
                                    <LuChevronDown className={`dropdown-chevron ${dropdownOpen ? 'rotate' : ''}`} />
                                </button>
                                {dropdownOpen && (
                                    <div className="dropdown-menu show">
                                        <Link to="/Exchange" className="dropdown-item" onClick={() => { setIsOpen(false); setDropdownOpen(false); }}>{t('tools.exchange')}</Link>
                                        <Link to="/PhoneList" className="dropdown-item" onClick={() => { setIsOpen(false); setDropdownOpen(false); }}>{t('tools.phone_list')}</Link>
                                        <Link to="/Weather" className="dropdown-item" onClick={() => { setIsOpen(false); setDropdownOpen(false); }}>{t('tools.weather')}</Link>
                                    </div>
                                )}
                            </div>

                            <Link to="/Contact" className="nav-link" onClick={() => setIsOpen(false)}>
                                <LuPhoneCall className="nav-icon" />
                                <span>{t('nav.contact')}</span>
                            </Link>
                            
                            <Link to="/MyPlan" className="nav-my-plan-btn mobile-plan-btn" onClick={() => setIsOpen(false)}>
                                <LuMap className="nav-icon" />
                                <span>{t('nav.my_plan', 'My Plan')}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ultra-Premium Full-Screen Modal Search Overlay */}
            {isSearchOpen && (
                <div className="search-modal-overlay" onClick={toggleSearch} data-lenis-prevent>
                    <div className="search-modal-card" onClick={(e) => e.stopPropagation()} ref={searchRef}>
                        <div className="search-modal-header">
                            <LuSearch className="search-modal-icon" />
                            <input 
                                id="nav-search-input"
                                type="text" 
                                className="search-modal-input"
                                placeholder={t('nav.search.placeholder') || "Rechercher un hôtel, un restaurant..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoComplete="off"
                                autoFocus
                            />
                            <button className="search-modal-close-btn" onClick={toggleSearch}>
                                <LuX />
                            </button>
                        </div>
                        
                        <div className="search-modal-divider"></div>
                        
                        <div className="search-modal-body">
                            {searchQuery.trim().length === 0 ? (
                                <div className="search-modal-trends">
                                    <h5 className="trends-title">{t('search.trends', 'TENDANCES')}</h5>
                                    <div className="trends-chips">
                                        <button className="trend-chip" onClick={() => setSearchQuery("La Mamounia")}>La Mamounia</button>
                                        <button className="trend-chip" onClick={() => setSearchQuery("Marrakech")}>Marrakech</button>
                                        <button className="trend-chip" onClick={() => setSearchQuery("Selman")}>Selman Marrakech</button>
                                        <button className="trend-chip" onClick={() => { setIsSearchOpen(false); navigate("/PhoneList"); }}>{t('tools.phone_list', 'Direct Line')}</button>
                                        <button className="trend-chip" onClick={() => { setIsSearchOpen(false); navigate("/Exchange"); }}>{t('tools.exchange', 'Devise')}</button>
                                    </div>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="search-modal-results">
                                    {searchResults.map((item, index) => (
                                        <Link 
                                            key={index} 
                                            to={item.typeLabel === 'Tour' ? `/PlanDetails/${item.id}` : `${item.linkPrefix}?id=${item.id}`} 
                                            className="search-modal-result-card"
                                            onClick={() => {
                                                setIsSearchOpen(false);
                                                setSearchQuery("");
                                                setSearchResults([]);
                                            }}
                                        >
                                            {item.typeLabel === 'Urgence' ? (
                                                <div className="search-modal-result-img icon-wrapper">
                                                    {getEmergencyIcon(item.nom)}
                                                </div>
                                            ) : (
                                                <img src={item.photo || item.image || "/placeholder.jpg"} alt={item.nom} className="search-modal-result-img" />
                                            )}
                                            <div className="search-modal-result-info">
                                                <div className="search-modal-result-main">
                                                    <h4 className="search-modal-result-title">{item.nom}</h4>
                                                    <span className="search-modal-result-type-label">{item.typeLabel}</span>
                                                </div>
                                                <div className="search-modal-result-meta">
                                                    <span><LuMapPin /> {item.ville}</span>
                                                </div>
                                            </div>
                                            <div className="search-modal-view-details-btn">
                                                {t('common.view_details', 'Voir Détails')}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : searchQuery.length > 2 ? (
                                <div className="search-modal-no-results">
                                    {t('nav.search.no_results') || "Aucun résultat trouvé pour votre recherche."}
                                </div>
                            ) : null}
                        </div>
                        
                        <div className="search-modal-footer">
                            <span>{t('search.esc_close', 'APPUYEZ SUR ESC POUR FERMER')}</span>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
