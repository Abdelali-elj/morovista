import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
    FaArrowLeft, FaSearch, FaTaxi, FaBus, FaTrain,
    FaTram, FaCar, FaMapMarkerAlt, FaLink, FaPhoneAlt, FaUserTie
} from "react-icons/fa";
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const TRANSPORT_TYPES = (t) => [
    { id: "Bus", label: t('transport.types.Bus'), icon: <FaBus /> },
    { id: "Train", label: t('transport.types.Train'), icon: <FaTrain /> },
    { id: "Tramway", label: t('transport.types.Tramway'), icon: <FaTram /> },
    { id: "Taxi", label: t('transport.types.Taxi'), icon: <FaTaxi /> },
    { id: "Drivers", label: t('transport.types.Drivers'), icon: <FaUserTie /> }
];

const MOROCCAN_CITIES = ["Casablanca", "Rabat", "Marrakech", "Tanger", "Agadir", "Fès"];

export default function Transport() {
    const { t } = useTranslation();
    const [transportData, setTransportData] = useState([]);
    const [selectedCity, setSelectedCity] = useState("Casablanca");
    const [selectedType, setSelectedType] = useState("Taxi");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const snapshot = await getDocs(collection(db, 'transport'));
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTransportData(data);
            } catch (err) {
                console.error("Error fetching transport data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredData = transportData.filter((item) => {
        const matchesCity = item.ville === selectedCity;
        const matchesType = item.type === selectedType || (item.type && item.type.includes(selectedType));
        const matchesSearch = (item.nom || item.type || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCity && matchesType && matchesSearch;
    });

    return (
        <div className="page-container">
            <Link to="/" className="back-btn">
                <FaArrowLeft /> {t('common.back_home')}
            </Link>

            <div className="page-header">
                <h2>{t('transport.title')}</h2>
                <p className="subtitle">{t('transport.subtitle')}</p>
            </div>

            <div className="search-bar-wrapper">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder={t('transport.search', { type: t(`transport.types.${selectedType}`), city: selectedCity })}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {/* Top City Tabs (Hotels Style) */}
            <div className="city-filters">
                {MOROCCAN_CITIES.map((city, idx) => (
                    <button
                        key={idx}
                        className={`city-btn ${selectedCity === city ? "active" : ""}`}
                        onClick={() => setSelectedCity(city)}
                    >
                        {city}
                    </button>
                ))}
            </div>

            <div className="transport-content-layout">
                {/* Left Categories Sidebar */}
                <aside className="transport-sidebar">
                    <div className="sidebar-header">
                        <span>{t('transport.categories')}</span>
                    </div>
                    <nav className="sidebar-nav">
                        {TRANSPORT_TYPES(t).map((type) => (
                            <button
                                key={type.id}
                                className={`sidebar-btn ${selectedType === type.id ? "active" : ""}`}
                                onClick={() => setSelectedType(type.id)}
                            >
                                <span className="sidebar-icon">{type.icon}</span>
                                <span className="sidebar-label">{type.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content: Card Grid */}
                <main className="transport-main">
                    <div className="data-grid transport-grid">
                        {loading ? (
                            <div className="premium-loader-container">
                                <div className="premium-loader"></div>
                                <div className="premium-loader-text">{t('transport.loading', 'Loading Transportation Schedules...')}</div>
                            </div>
                        ) : filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <div key={index} className="data-card transport-card">
                                    <div className="card-content">
                                        <div className="card-header">
                                            <span className="card-tag">{item.type}</span>
                                            <div className="transport-location">
                                                <FaMapMarkerAlt /> {item.ville}
                                            </div>
                                        </div>
                                        <h4>{item.nom || (item.type.includes('-') ? item.type.split('-')[0].trim() : item.type)}</h4>
                                        <p className="transport-desc">{item.desc}</p>

                                        <div className="card-actions">
                                            {(item.lien || `tel:${item.contact || ''}`).startsWith("tel:") ? (
                                                <a href={item.lien || `tel:${item.contact || ''}`} className="book-btn call-action">
                                                    <FaPhoneAlt /> {t('transport.call_now') || 'Appeler'}
                                                </a>
                                            ) : (
                                                <a
                                                    href={item.lien || `tel:${item.contact || ''}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="book-btn browse-action"
                                                >
                                                    <FaLink /> {t('transport.visit_website') || 'Visiter Site'}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                {t('transport.empty', { type: t(`transport.types.${selectedType}`), city: selectedCity })}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
