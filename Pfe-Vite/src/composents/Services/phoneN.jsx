import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
    FaAmbulance, FaTrain, FaInfoCircle, FaExclamationTriangle, FaBalanceScale,
    FaSearch, FaArrowLeft, FaPhoneVolume
} from "react-icons/fa";
import { MdOutlineLocalPolice, MdOutlineFireTruck } from "react-icons/md";
import { Link } from "react-router-dom";

export default function PhoneList() {
    const { t } = useTranslation();
    const [phones, setPhones] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPhones = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'PhoneN'));
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPhones(data);
            } catch (err) {
                console.error("Erreur API:", err);
            }
        };
        fetchPhones();
    }, []);

    const filteredPhones = phones.filter(item =>
        item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.num.includes(searchTerm)
    );

    const getServiceDetails = (nom) => {
        const lowerNom = nom.toLowerCase();
        if (lowerNom.includes("police")) return { icon: <MdOutlineLocalPolice />, category: "police" };
        if (lowerNom.includes("pompier")) return { icon: <MdOutlineFireTruck />, category: "fire" };
        if (lowerNom.includes("ambulance")) return { icon: <FaAmbulance />, category: "medical" };
        if (lowerNom.includes("oncf")) return { icon: <FaTrain />, category: "transport" };
        if (lowerNom.includes("secours")) return { icon: <FaExclamationTriangle />, category: "emergency" };
        if (lowerNom.includes("renseignement")) return { icon: <FaInfoCircle />, category: "info" };
        if (lowerNom.includes("corruption")) return { icon: <FaBalanceScale />, category: "justice" };
        return { icon: <FaPhoneVolume />, category: "general" };
    };

    return (
        <div className="page-container">
            <Link to="/" className="back-btn">
                <FaArrowLeft /> {t('common.back_home')}
            </Link>

            <div className="page-header">
                <h2>{t('emergency.title')}</h2>
                <p className="subtitle">{t('emergency.subtitle')}</p>
            </div>

            <div className="search-bar-wrapper">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder={t('emergency.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button
                            className="search-clear"
                            onClick={() => setSearchTerm("")}
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            <div className="data-grid">
                {filteredPhones.length > 0 ? (
                    filteredPhones.map((item, index) => {
                        const { icon, category } = getServiceDetails(item.nom);
                        return (
                            <div key={index} className={`data-card phone-card ${category}`}>
                                <div className="card-content">
                                    <div className="icon-wrapper">{icon}</div>
                                    <h4>{item.nom}</h4>
                                    <p className="phone-num">{item.num}</p>
                                    <a href={`tel:${item.num}`} className="call-btn">
                                        <FaPhoneVolume className="btn-icon" />
                                        <span>{t('emergency.call')}</span>
                                    </a>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-state">
                        {t('emergency.empty', { term: searchTerm })}
                    </div>
                )}
            </div>
        </div>
    );
}
