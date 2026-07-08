import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { 
    FaArrowLeft, FaPassport, FaCheckCircle, FaExclamationTriangle, 
    FaTimesCircle, FaChevronDown, FaChevronUp, FaExternalLinkAlt, 
    FaGlobe, FaSearch, FaPassport as FaIconPassport, FaListUl,
    FaRegBuilding, FaCheck
} from "react-icons/fa";
import "../../css/visa.css";

export default function Visa() {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all'); // all, exempt, evisa, required
    const [selectedCode, setSelectedCode] = useState('us'); // Default to US
    const [faqOpen, setFaqOpen] = useState(null);

    // Comprehensive nationality database with ISO 3166-1 alpha-2 codes (lowercase)
    const nationalities = [
        { code: 'us', name: 'United States', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for US Citizens. Passport must be valid for the duration of your stay in Morocco.' },
        { code: 'fr', name: 'France', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry. Passport must be valid for the duration of stay. National ID card is not accepted on its own.' },
        { code: 'es', name: 'Spain', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry. Passport must be valid for the duration of stay.' },
        { code: 'gb', name: 'United Kingdom', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for British citizens. Passport must be valid for the duration of stay.' },
        { code: 'ca', name: 'Canada', status: 'exempt', duration: '90 Days', notes: 'No visa required for tourism stays up to 90 days. Passport validity must cover the stay.' },
        { code: 'de', name: 'Germany', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for German citizens. Passport must be valid for the duration of stay.' },
        { code: 'it', name: 'Italy', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry. Passport must be valid for the duration of stay.' },
        { code: 'be', name: 'Belgium', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for Belgian citizens. Passport must be valid for the duration of stay.' },
        { code: 'nl', name: 'Netherlands', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry. Passport must be valid for the duration of stay.' },
        { code: 'ch', name: 'Switzerland', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry. Passport must be valid for the duration of stay.' },
        { code: 'sa', name: 'Saudi Arabia', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry. Standard biometric passport stamp upon landing.' },
        { code: 'ua', name: 'United Arab Emirates', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for UAE nationals.' },
        { code: 'qa', name: 'Qatar', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for Qatari citizens.' },
        { code: 'kw', name: 'Kuwait', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for Kuwaiti citizens.' },
        { code: 'bh', name: 'Bahrain', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for Bahraini citizens.' },
        { code: 'om', name: 'Oman', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for Omani citizens.' },
        { code: 'tr', name: 'Turkey', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for up to 90 days for Turkish Citizens.' },
        { code: 'sn', name: 'Senegal', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry. Proof of yellow fever vaccine required if coming from risk zones.' },
        { code: 'ci', name: 'Cote d\'Ivoire', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for Ivorian Citizens.' },
        { code: 'br', name: 'Brazil', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for tourism or business up to 90 days.' },
        { code: 'ar', name: 'Argentina', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for up to 90 days.' },
        { code: 'mx', name: 'Mexico', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for Mexican citizens.' },
        { code: 'au', name: 'Australia', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry. Passport must be valid for the duration of stay.' },
        { code: 'nz', name: 'New Zealand', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for Kiwi Citizens.' },
        { code: 'jp', name: 'Japan', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for Japanese nationals.' },
        { code: 'kr', name: 'South Korea', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for South Korean Citizens.' },
        { code: 'cn', name: 'China', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry implemented for all Chinese passport holders.' },
        { code: 'ru', name: 'Russia', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for Russian citizens.' },
        { code: 'dz', name: 'Algeria', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry. Direct air and sea routes are currently closed, transit routing is required.' },
        { code: 'tn', name: 'Tunisia', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for Tunisian citizens.' },
        { code: 'ga', name: 'Gabon', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for Gabonese citizens.' },
        { code: 'ml', name: 'Mali', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for Malian nationals.' },
        { code: 'cg', name: 'Congo', status: 'exempt', duration: '90 Days', notes: 'Visa-free entry for Congolese citizens.' },
        
        // eVisa Eligible
        { code: 'in', name: 'India', status: 'evisa', duration: '30 Days', notes: 'Eligible for eVisa (AccessMaroc). Processed within 24-72 hours. The eVisa costs 220 MAD.' },
        { code: 'eg', name: 'Egypt', status: 'evisa', duration: '30 Days', notes: 'Eligible for eVisa (AccessMaroc) ONLY if holding a valid Schengen, US, UK, Canada, Australia, or Japan visa or residence card. Otherwise, a consular visa is required.' },
        { code: 'jo', name: 'Jordan', status: 'evisa', duration: '30 Days', notes: 'Eligible for eVisa (AccessMaroc) online application. Passport must be valid for at least 6 months.' },
        { code: 'th', name: 'Thailand', status: 'evisa', duration: '30 Days', notes: 'Eligible for eVisa (AccessMaroc) online. Quick processing.' },
        { code: 'az', name: 'Azerbaijan', status: 'evisa', duration: '30 Days', notes: 'Eligible for eVisa (AccessMaroc) online application.' },
        { code: 'gt', name: 'Guatemala', status: 'evisa', duration: '30 Days', notes: 'Eligible for eVisa (AccessMaroc) online.' },
        { code: 'vn', name: 'Vietnam', status: 'evisa', duration: '30 Days', notes: 'Eligible for eVisa (AccessMaroc) online application.' },
        { code: 'ec', name: 'Ecuador', status: 'evisa', duration: '30 Days', notes: 'Eligible for eVisa (AccessMaroc) online.' },
        
        // Required (Consular)
        { code: 'za', name: 'South Africa', status: 'required', duration: 'Varies', notes: 'Consular visa required prior to departure. Contact the closest Moroccan Embassy or Consulate to schedule an appointment.' },
        { code: 'pk', name: 'Pakistan', status: 'required', duration: 'Varies', notes: 'Consular visa required. Requires official application form, proof of funds, hotel booking, and flight itinerary.' },
        { code: 'bd', name: 'Bangladesh', status: 'required', duration: 'Varies', notes: 'Consular visa required. Contact the Moroccan Embassy in Dhaka.' },
        { code: 'ng', name: 'Nigeria', status: 'required', duration: 'Varies', notes: 'Consular visa required. Requires bank statements, approval certificates, and travel booking details.' },
        { code: 'ke', name: 'Kenya', status: 'required', duration: 'Varies', notes: 'Consular visa required. Contact the Moroccan Embassy in Nairobi.' },
        { code: 'gh', name: 'Ghana', status: 'required', duration: 'Varies', notes: 'Consular visa required. Contact the Moroccan Embassy in Accra.' },
        { code: 'cm', name: 'Cameroon', status: 'required', duration: 'Varies', notes: 'Consular visa required. Contact the Moroccan Embassy in Yaoundé.' },
        { code: 'iq', name: 'Iraq', status: 'required', duration: 'Varies', notes: 'Consular visa required. Contact the Moroccan Embassy in Baghdad.' },
        { code: 'sy', name: 'Syria', status: 'required', duration: 'Varies', notes: 'Consular visa required prior to booking travel.' },
        { code: 'ye', name: 'Yemen', status: 'required', duration: 'Varies', notes: 'Consular visa required prior to departure.' },
        { code: 'lb', name: 'Lebanon', status: 'required', duration: 'Varies', notes: 'Consular visa required. Contact the Embassy in Beirut.' },
        { code: 'np', name: 'Nepal', status: 'required', duration: 'Varies', notes: 'Consular visa required prior to booking travel.' },
        { code: 'lk', name: 'Sri Lanka', status: 'required', duration: 'Varies', notes: 'Consular visa required before departure.' },
        { code: 'af', name: 'Afghanistan', status: 'required', duration: 'Varies', notes: 'Consular visa required prior to arrival.' }
    ];

    const currentRule = nationalities.find(nat => nat.code === selectedCode) || nationalities[0];

    const toggleFaq = (index) => {
        setFaqOpen(faqOpen === index ? null : index);
    };

    const faqs = [
        {
            q: "Do I need travel medical insurance to enter Morocco?",
            a: "While travel medical insurance is not strictly mandatory for visa-exempt travelers, it is highly recommended. For eVisa and consular visa applicants, proof of comprehensive travel insurance covering medical care and repatriation is often a required document."
        },
        {
            q: "Can I extend my stay in Morocco beyond 90 days?",
            a: "Yes, you can apply for a residence permit (Carte de Séjour) or a stay extension at the local police department (Préfecture de Police - Bureau des Étrangers) in Morocco. You must apply at least 15 days before your initial 90 days expire, providing proof of income/funds and housing."
        },
        {
            q: "How long does the Moroccan eVisa take to process?",
            a: "Standard eVisa applications on AccessMaroc are processed within 72 hours (3 business days). An express option is available, which processes applications within 24 hours. We recommend applying at least 1 week before your trip."
        },
        {
            q: "What is the passport validity requirement for Morocco?",
            a: "Regardless of your nationality, your passport must be valid for at least 3 months (6 months is highly recommended) beyond the date of your departure from Morocco. It must also have at least one blank page for stamps."
        }
    ];

    // Search and Filter logic
    const filteredNationalities = nationalities.filter(nat => {
        const matchesSearch = nat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              nat.code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'all' || nat.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="visa-page-container">
            <Link to="/" className="visa-back-btn">
                <FaArrowLeft /> {t('common.back_home', 'Back to Home')}
            </Link>

            <div className="visa-header">
                <h2>🛂 {t('services.grid.visa_requirements', 'Visa Requirements')}</h2>
                <p className="subtitle">{t('visa.subtitle', 'Moroccan border guidelines, dynamic visa exemptions, and official entry checklists')}</p>
            </div>

            {/* Main Advisor Section */}
            <div className="visa-main-layout">
                {/* Search & List Panel */}
                <div className="visa-search-panel">
                    <div className="visa-search-header">
                        <h3><FaPassport /> Dynamic Visa Finder</h3>
                        <p>Search or filter to check if your passport requires an entry visa.</p>
                    </div>

                    <div className="visa-search-bar">
                        <FaSearch />
                        <input 
                            type="text" 
                            placeholder="Search your country..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="visa-filters">
                        <button 
                            className={`filter-chip ${activeFilter === 'all' ? 'active-filter' : ''}`}
                            onClick={() => setActiveFilter('all')}
                        >
                            All Countries
                        </button>
                        <button 
                            className={`filter-chip ${activeFilter === 'exempt' ? 'active-filter' : ''}`}
                            onClick={() => setActiveFilter('exempt')}
                        >
                            Visa Exempt
                        </button>
                        <button 
                            className={`filter-chip ${activeFilter === 'evisa' ? 'active-filter' : ''}`}
                            onClick={() => setActiveFilter('evisa')}
                        >
                            eVisa Eligible
                        </button>
                        <button 
                            className={`filter-chip ${activeFilter === 'required' ? 'active-filter' : ''}`}
                            onClick={() => setActiveFilter('required')}
                        >
                            Visa Required
                        </button>
                    </div>

                    <div className="country-list-scroll">
                        {filteredNationalities.length > 0 ? (
                            filteredNationalities.map((nat) => (
                                <div 
                                    key={nat.code} 
                                    className={`country-item ${selectedCode === nat.code ? 'selected-country' : ''}`}
                                    onClick={() => setSelectedCode(nat.code)}
                                >
                                    <div className="country-info-left">
                                        <img 
                                            src={`https://flagcdn.com/w40/${nat.code}.png`} 
                                            alt={`${nat.name} Flag`} 
                                            className="country-flag-img"
                                            onError={(e) => {
                                                // Fallback to a standard globe icon if flag fails to load
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                        <span className="country-name-txt">{nat.name}</span>
                                    </div>
                                    <span className={`visa-badge ${nat.status}`}>
                                        {nat.status === 'exempt' ? 'Exempt' : nat.status === 'evisa' ? 'eVisa' : 'Required'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem 0', fontWeight: 'bold' }}>
                                No countries match your search.
                            </div>
                        )}
                    </div>
                </div>

                {/* Detailed Result Card */}
                <div className="visa-result-panel">
                    {currentRule ? (
                        <div className="active-result-card">
                            <div className="country-header-row">
                                <img 
                                    src={`https://flagcdn.com/w80/${currentRule.code}.png`} 
                                    alt={`${currentRule.name} Flag`}
                                    className="country-flag-large" 
                                />
                                <div>
                                    <h4>{currentRule.name}</h4>
                                    <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
                                        ISO: {currentRule.code.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className={`status-info-box ${currentRule.status}`}>
                                <div className="status-icon">
                                    {currentRule.status === 'exempt' ? <FaCheckCircle /> : currentRule.status === 'evisa' ? <FaExclamationTriangle /> : <FaTimesCircle />}
                                </div>
                                <h5>
                                    {currentRule.status === 'exempt' ? 'Visa Exempt' : currentRule.status === 'evisa' ? 'eVisa Eligible' : 'Visa Required'}
                                </h5>
                                <div className="status-duration-lbl">Allowed Duration of Stay</div>
                                <div className="status-duration-val">{currentRule.duration}</div>
                            </div>

                            <div className="guideline-section">
                                <h6><FaGlobe /> Travel Guideline Info</h6>
                                <p>{currentRule.notes}</p>
                            </div>

                            <div style={{ marginBottom: '28px' }}>
                                {currentRule.status === 'evisa' ? (
                                    <a 
                                        href="https://www.acces-maroc.ma/" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="visa-action-btn"
                                    >
                                        Apply on AccessMaroc <FaExternalLinkAlt />
                                    </a>
                                ) : currentRule.status === 'required' ? (
                                    <a 
                                        href="https://www.consulat.ma/" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="visa-action-btn"
                                    >
                                        Embassy Information <FaRegBuilding />
                                    </a>
                                ) : (
                                    <div className="checklist-card">
                                        <h5>Required Entry Checklist:</h5>
                                        <ul className="checklist-grid">
                                            <li><FaCheck /> Passport valid for duration of stay</li>
                                            <li><FaCheck /> Confirmed onward flight ticket</li>
                                            <li><FaCheck /> Sufficient proof of funds</li>
                                            <li><FaCheck /> Hotel booking or invitation letter</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="result-placeholder">
                            <FaIconPassport />
                            <p>Select a nationality from the list to see entry requirements and checklist details.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Accordion FAQ Section */}
            <div className="visa-faq-section">
                <h3>Frequently Asked Questions</h3>
                <div className="faq-list">
                    {faqs.map((faq, idx) => (
                        <div 
                            key={idx} 
                            className="faq-card"
                            onClick={() => toggleFaq(idx)}
                        >
                            <div className="faq-question-row">
                                <h4>{faq.q}</h4>
                                <span className="faq-toggle-icon">
                                    {faqOpen === idx ? <FaChevronUp /> : <FaChevronDown />}
                                </span>
                            </div>
                            {faqOpen === idx && (
                                <p className="faq-answer">
                                    {faq.a}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
