import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaPhoneAlt, FaUser, FaSearch, FaBriefcase } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

gsap.registerPlugin(ScrollTrigger);

export default function LocalServices() {
    const { t } = useTranslation();
    const [services, setServices] = useState([]);
    const [selectedCity, setSelectedCity] = useState('Casablanca');
    const [hoveredCard, setHoveredCard] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const villes = ["Casablanca", "Rabat", "Marrakech", "Fès", "Agadir", "Tanger"];

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'localServices'));
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setServices(data.filter(s => s.status !== 'rejected'));
            } catch(err) {
                console.error('Erreur de chargement:', err);
            }
        };
        fetchServices();
    }, []);

    // Filter services based on search term (all cities) or selected city
    const filteredServices = searchTerm
        ? services.filter(s => s.nom.toLowerCase().includes(searchTerm.toLowerCase()))
        : services.filter(s => s.ville === selectedCity);

    useEffect(() => {
        if (searchTerm && filteredServices.length > 0) {
            const firstResultCity = filteredServices[0].ville;
            if (firstResultCity !== selectedCity) {
                setSelectedCity(firstResultCity);
            }
        }
    }, [searchTerm, filteredServices, selectedCity]);

    // GSAP Scroll Reveal - Individual card trigger for better performance and to prevent batching issues
    useEffect(() => {
        if (filteredServices.length === 0) return;

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
    }, [filteredServices, selectedCity]);

    return (
        <div className="page-container">
            <Link to="/" className="back-btn">
                <FaArrowLeft /> {t('common.back_home')}
            </Link>

            <div className="page-header">
                <h2>{t('services_local.title')}</h2>
                <p className="subtitle">{t('services_local.subtitle')}</p>
            </div>

            <div className="search-bar-wrapper">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder={t('services_local.search')}
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
                        className={`city-btn ${selectedCity === ville ? 'active' : ''}`}
                        onClick={() => setSelectedCity(ville)}
                    >
                        {ville}
                    </button>
                ))}
            </div>

            <div className="data-grid">
                {filteredServices.length > 0 ? (
                    filteredServices.map((s, i) => (
                        <div
                            className="data-card"
                            key={i}
                            onMouseEnter={() => setHoveredCard(i)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className="card-image-wrapper">
                                <img src={s.image || '/default-service.jpg'} alt={s.nom} />
                                <div className="card-overlay">
                                    <div className="service-type-badge">
                                        <FaBriefcase /> {s.type}
                                    </div>
                                </div>
                            </div>
                            <div className="card-content">
                                <div className="card-header">
                                    <span className="card-tag">{s.type}</span>
                                    <span className="owner-badge">
                                        <FaUser /> {s.proprietaire}
                                    </span>
                                </div>
                                <h4>{s.nom}</h4>
                                <p className="service-description">{s.details}</p>
                                <ul className="card-details">
                                    <li><FaMapMarkerAlt /> {s.adresse}</li>
                                    <li><FaPhoneAlt /> {s.telephone}</li>
                                </ul>
                                <button className="book-btn">
                                    {t('services_local.contact')}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        {searchTerm
                            ? t('services_local.search_empty', { term: searchTerm })
                            : t('services_local.empty', { city: selectedCity })}
                    </div>
                )}
            </div>
        </div>
    );
}
