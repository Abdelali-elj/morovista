import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { 
    FaArrowLeft, FaWifi, FaMobileAlt, FaQrcode, FaCheckCircle, 
    FaSearch, FaSlidersH, FaApple, FaAndroid, FaSignal, FaCheck,
    FaPhone, FaGlobe, FaSpinner, FaCreditCard,
    FaCity, FaRoute, FaBolt, FaMountain, FaCompass, FaCampground, 
    FaMobile, FaNetworkWired, FaRocket, FaGlobeAfrica
} from "react-icons/fa";
import "../../css/esim.css";

export default function Esim() {
    const { t } = useTranslation();
    const [selectedOperator, setSelectedOperator] = useState('orange');
    const [selectedPlanId, setSelectedPlanId] = useState('orange-plan-2');
    const [deviceQuery, setDeviceQuery] = useState('');
    const [compatibilityResult, setCompatibilityResult] = useState(null);
    const [activeTab, setActiveTab] = useState('ios');
    
    // Checkout simulation states
    const [email, setEmail] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [checkoutError, setCheckoutError] = useState('');

    const renderOperatorLogo = (opId) => {
        switch (opId) {
            case 'orange':
                return (
                    <svg viewBox="0 0 80 80" width="50" height="50" style={{ borderRadius: '10px' }}>
                        <rect width="80" height="80" fill="#FF7900" />
                        <text x="8" y="70" fontFamily="system-ui, -apple-system, sans-serif" fontSize="16" fontWeight="bold" fill="#ffffff">orange</text>
                    </svg>
                );
            case 'iam':
                return (
                    <img 
                        src="https://i.pinimg.com/1200x/ae/3c/11/ae3c11064b6df4ed8f3ed45043e0ea5c.jpg" 
                        alt="Maroc Telecom" 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                );
            case 'inwi':
                return (
                    <img 
                        src="https://i.pinimg.com/1200x/0c/b8/27/0cb827fb7dee8a8f71611288fba73e50.jpg" 
                        alt="Inwi" 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                );
            default:
                return null;
        }
    };

    const operators = [
        {
            id: 'orange',
            name: 'Orange Maroc',
            color: '#ff7900',
            description: 'Ultra-fast 4G/5G networks, perfect for urban areas and heavy streaming.',
            badge: 'Fastest 5G Speed',
            logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Orange_logo.svg'
        },
        {
            id: 'iam',
            name: 'Maroc Telecom',
            color: '#00509d',
            description: 'Widest national footprint. Best coverage for Sahara desert & Atlas mountains.',
            badge: 'Widest Coverage',
            logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Logo_Maroc_Telecom.svg'
        },
        {
            id: 'inwi',
            name: 'Inwi',
            color: '#9d178e',
            description: 'Incredible value & flexible social media bundles for budget-conscious travelers.',
            badge: 'Best Data Value',
            logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Logo_inwi.svg'
        }
    ];

    const allPlans = {
        orange: [
            {
                id: 'orange-plan-1',
                name: 'Orange City Go',
                data: '10 GB',
                duration: '7 Days',
                priceUsd: 12,
                priceMad: 120,
                badge: 'Urban Lite',
                speed: '5G Enabled',
                icon: <FaCity />,
                features: ['1 Hour Local Calls', '50 SMS Local', 'Instant QR Activation', 'Personal Hotspot allowed']
            },
            {
                id: 'orange-plan-2',
                name: 'Orange Explorer',
                data: '25 GB',
                duration: '15 Days',
                priceUsd: 22,
                priceMad: 220,
                badge: 'Best Seller',
                speed: '5G Enabled',
                icon: <FaRoute />,
                features: ['2 Hours Local Calls', '100 SMS Local', '30 Mins International', 'Full Speed Tethering']
            },
            {
                id: 'orange-plan-3',
                name: 'Orange Unlimited',
                data: 'Unlimited',
                duration: '30 Days',
                priceUsd: 45,
                priceMad: 450,
                badge: 'Heavy Streamer',
                speed: 'Ultra 5G Speed',
                icon: <FaBolt />,
                features: ['5 Hours Local Calls', '200 SMS Local', '1 Hour International', 'VIP Priority Network']
            }
        ],
        iam: [
            {
                id: 'iam-plan-1',
                name: 'Atlas Essential',
                data: '8 GB',
                duration: '7 Days',
                priceUsd: 10,
                priceMad: 100,
                badge: 'Hiker Choice',
                speed: '4G/5G National',
                icon: <FaMountain />,
                features: ['30 Mins Local Calls', '30 SMS Local', 'Best for rural trekking', 'Instant setup']
            },
            {
                id: 'iam-plan-2',
                name: 'Sahara Voyager',
                data: '18 GB',
                duration: '15 Days',
                priceUsd: 20,
                priceMad: 200,
                badge: 'Widest Network',
                speed: '4G/5G National',
                icon: <FaCompass />,
                features: ['2 Hours Local Calls', '50 SMS Local', 'Desert-proof signal towers', 'Dual SIM Ready']
            },
            {
                id: 'iam-plan-3',
                name: 'National Nomad',
                data: '35 GB',
                duration: '30 Days',
                priceUsd: 32,
                priceMad: 320,
                badge: 'Extreme Range',
                speed: '4G/5G National',
                icon: <FaCampground />,
                features: ['4 Hours Local Calls', '100 SMS Local', '30 Mins International', 'Tethering & Router OK']
            }
        ],
        inwi: [
            {
                id: 'inwi-plan-1',
                name: 'inwi Social Lite',
                data: '12 GB',
                duration: '7 Days',
                priceUsd: 9,
                priceMad: 90,
                badge: 'Budget Pick',
                speed: '4G LTE Speed',
                icon: <FaMobile />,
                features: ['1 Hour Local Calls', 'Unlimited Social Chat', 'Instant QR code delivery', 'Keep physical SIM']
            },
            {
                id: 'inwi-plan-2',
                name: 'inwi Chat & Surf',
                data: '22 GB',
                duration: '15 Days',
                priceUsd: 17,
                priceMad: 170,
                badge: 'Most Popular',
                speed: '4G/5G Network',
                icon: <FaNetworkWired />,
                features: ['3 Hours Local Calls', 'Unlimited WhatsApp & Insta', '50 SMS Local', 'Hotspot sharing']
            },
            {
                id: 'inwi-plan-3',
                name: 'inwi Max Data',
                data: '50 GB',
                duration: '30 Days',
                priceUsd: 29,
                priceMad: 290,
                badge: 'Best GB Value',
                speed: '4G/5G Network',
                icon: <FaRocket />,
                features: ['5 Hours Local Calls', '100 SMS Local', 'Unlimited Social Apps', 'High-speed data caps']
            }
        ]
    };

    const handleOperatorChange = (opId) => {
        setSelectedOperator(opId);
        // Automatically select the second (popular) plan of the operator
        setSelectedPlanId(allPlans[opId][1].id);
    };

    const currentPlans = allPlans[selectedOperator];
    const selectedPlan = currentPlans.find(p => p.id === selectedPlanId) || currentPlans[1];

    const checkCompatibility = (e) => {
        e.preventDefault();
        if (!deviceQuery) return;
        
        const q = deviceQuery.toLowerCase();
        if (
            q.includes('iphone') || 
            q.includes('ipad') || 
            q.includes('galaxy') || 
            q.includes('pixel') || 
            q.includes('s20') || 
            q.includes('s21') || 
            q.includes('s22') || 
            q.includes('s23') || 
            q.includes('s24') || 
            q.includes('xiaomi 13') || 
            q.includes('oneplus 11') ||
            q.includes('flip') ||
            q.includes('fold')
        ) {
            setCompatibilityResult({
                status: 'compatible',
                msg: `Awesome! Your ${deviceQuery} is 100% compatible with MoroVista eSIM. You can proceed with instant QR code activation.`
            });
        } else {
            setCompatibilityResult({
                status: 'maybe',
                msg: `Your ${deviceQuery} might support eSIM. To check: dial *#06# on your device. If an "EID" code is displayed in your settings, your device is compatible!`
            });
        }
    };

    const handleCheckoutSubmit = (e) => {
        e.preventDefault();
        setCheckoutError('');

        if (!email) {
            setCheckoutError('Please enter a valid email address.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setCheckoutError('Please enter a valid email format.');
            return;
        }

        setIsProcessing(true);

        // Simulate secure merchant response
        setTimeout(() => {
            setIsProcessing(false);
            setShowSuccessModal(true);
        }, 1800);
    };

    return (
        <div className="esim-page-container">
            <Link to="/" className="esim-back-btn">
                <FaArrowLeft /> {t('common.back_home', 'Back to Home')}
            </Link>

            <div className="esim-header">
                <h2>📶 {t('services.grid.esim_internet', 'eSIM & Internet')}</h2>
                <p className="subtitle">
                    {t('esim.subtitle', 'Premium local travel eSIMs. Keep your physical SIM active, scan our secure QR code, and connect instantly to Morocco’s leading networks.')}
                </p>
            </div>

            {/* Operator Selector Header */}
            <div className="operator-selection-section">
                <h3 className="operator-selection-title">1. Choose Your Preferred Carrier</h3>
                <div className="operators-grid">
                    {operators.map((op) => {
                        const isActive = selectedOperator === op.id;
                        return (
                            <div 
                                key={op.id}
                                className={`operator-card operator-${op.id} ${isActive ? 'active-operator' : ''}`}
                                onClick={() => handleOperatorChange(op.id)}
                            >
                                <div className="operator-logo-img-wrapper">
                                    {renderOperatorLogo(op.id)}
                                </div>
                                <h3>{op.name}</h3>
                                <p>{op.description}</p>
                                <span className="operator-badge">{op.badge}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Plans List based on selected operator theme */}
            <div className={`plans-wrapper operator-${selectedOperator}-theme`}>
                <h3 className="operator-selection-title">2. Select Your Mobile Package</h3>
                <div className="plans-grid">
                    {currentPlans.map((plan) => {
                        const isSelected = selectedPlanId === plan.id;
                        return (
                            <div 
                                key={plan.id}
                                className={`plan-card ${isSelected ? 'plan-selected' : ''}`}
                                onClick={() => setSelectedPlanId(plan.id)}
                            >
                                <div>
                                    <span className="plan-card-tag">{plan.badge}</span>
                                    <span className="plan-speed"><FaSignal /> {plan.speed}</span>
                                    <div className="plan-data">
                                        {plan.data}
                                        {plan.data !== 'Unlimited' && <span>Data</span>}
                                    </div>
                                    <div className="plan-name-container">
                                        <span className="plan-name-icon">{plan.icon}</span>
                                        <h4 className="plan-name">{plan.name}</h4>
                                    </div>
                                    
                                    <ul className="plan-details-list">
                                        {plan.features.map((feat, idx) => (
                                            <li key={idx}><FaCheck /> {feat}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="plan-price-row">
                                    <span className="plan-price-label">Validity: {plan.duration}</span>
                                    <div className="plan-price">
                                        ${plan.priceUsd} <span>({plan.priceMad} DH)</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Dynamic Checkout Form */}
            {selectedPlan && (
                <div className={`checkout-panel operator-${selectedOperator}-theme`}>
                    <div className="checkout-details">
                        <span className="plan-card-tag" style={{ position: 'static', display: 'inline-block', marginBottom: '16px' }}>
                            {selectedPlan.badge}
                        </span>
                        <h4>Confirm {selectedPlan.name} Plan</h4>
                        <p className="plan-desc">
                            You have selected a high-speed {selectedPlan.data} eSIM package provided by {operators.find(o => o.id === selectedOperator)?.name}. Your setup email will contain instructions to scan the QR code and connect instantly once you arrive in Morocco.
                        </p>
                        
                        <ul className="checkout-features">
                            <li><FaWifi /> 4G / 5G High Speed</li>
                            <li><FaQrcode /> QR Delivery under 2m</li>
                            <li><FaMobileAlt /> Dual SIM Active Mode</li>
                            <li><FaCheckCircle /> Prepaid No Contract</li>
                        </ul>
                    </div>

                    <div className="checkout-form-side">
                        <form onSubmit={handleCheckoutSubmit}>
                            <span className="checkout-total-title">Total Cost</span>
                            <div className="checkout-total-price">
                                ${selectedPlan.priceUsd} <span>USD / {selectedPlan.priceMad} MAD</span>
                            </div>

                            <div className="checkout-input-group">
                                <label>Delivery Email Address</label>
                                <input 
                                    type="email" 
                                    placeholder="yourname@gmail.com" 
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setCheckoutError('');
                                    }}
                                    required
                                />
                                {checkoutError && (
                                    <div style={{ color: '#ef4444', fontSize: '0.88rem', fontWeight: 'bold', marginTop: '6px' }}>
                                        {checkoutError}
                                    </div>
                                )}
                            </div>

                            <button 
                                type="submit" 
                                className="checkout-btn"
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <FaSpinner className="fa-spin" /> Processing Payment...
                                    </>
                                ) : (
                                    <>
                                        <FaCreditCard /> Purchase eSIM Instantly
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Double Row: Checker & Guide */}
            <div className="esim-meta-grid">
                {/* Checker */}
                <div className="esim-meta-card">
                    <h3><FaMobileAlt /> Compatibility Checker</h3>
                    <p>
                        Find out if your smartphone supports eSIM hardware by searching for your model name below.
                    </p>

                    <form onSubmit={checkCompatibility} className="compatibility-form">
                        <div className="search-input-wrapper">
                            <FaSearch />
                            <input 
                                type="text"
                                placeholder="e.g., iPhone 15, Galaxy S24, Pixel 8..."
                                value={deviceQuery}
                                onChange={(e) => setDeviceQuery(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="compatibility-btn">Check Model</button>
                    </form>

                    {compatibilityResult && (
                        <div className={`result-box ${compatibilityResult.status}`}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'start' }}>
                                <FaCheckCircle style={{ marginTop: '3px', flexShrink: 0 }} />
                                <span>{compatibilityResult.msg}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Guide */}
                <div className="esim-meta-card">
                    <h3><FaSlidersH /> Installation Guide</h3>
                    <p>
                        Setting up your MoroVista eSIM is simple and fast. Choose your platform:
                    </p>

                    <div className="tabs-header">
                        <button 
                            className={`tab-btn ${activeTab === 'ios' ? 'active-tab' : ''}`}
                            onClick={() => setActiveTab('ios')}
                        >
                            <FaApple /> iOS (iPhone)
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'android' ? 'active-tab' : ''}`}
                            onClick={() => setActiveTab('android')}
                        >
                            <FaAndroid /> Android
                        </button>
                    </div>

                    <ol className="guide-steps">
                        {activeTab === 'ios' ? (
                            <>
                                <li>Go to <strong>Settings</strong> &rarr; <strong>Cellular</strong>.</li>
                                <li>Tap <strong>Add eSIM</strong> or <strong>Add Cellular Plan</strong>.</li>
                                <li>Select <strong>Use QR Code</strong> and scan the email code.</li>
                                <li>Enable <strong>Data Roaming</strong> on your MoroVista line.</li>
                            </>
                        ) : (
                            <>
                                <li>Go to <strong>Settings</strong> &rarr; <strong>Network & Internet</strong> &rarr; <strong>SIMs</strong>.</li>
                                <li>Tap <strong>Add SIM</strong> and select <strong>Download eSIM</strong>.</li>
                                <li>Scan the eSIM QR code from your confirmation email.</li>
                                <li>Turn on <strong>Data Roaming</strong> on the newly downloaded SIM profile.</li>
                            </>
                        )}
                    </ol>
                </div>
            </div>

            {/* Success Success QR Code Activation Modal */}
            {showSuccessModal && (
                <div className="activation-modal-overlay">
                    <div className="activation-modal">
                        <div className="modal-success-icon">
                            <FaCheck />
                        </div>
                        <h3>eSIM Purchase Complete!</h3>
                        <p className="modal-subtitle">
                            Your eSIM QR Code has been generated and sent to <strong>{email}</strong>.
                        </p>

                        <div className="qr-code-wrapper">
                            {/* Realistic mockup QR code container */}
                            <div className="qr-placeholder-img">
                                <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ fill: '#1e1b4b' }}>
                                    <path d="M0 0h30v10H10v20H0V0zm70 0h30v30H90V10H70V0zM0 70h10v20h20v10H0V70zm100 0v30H70V90h20V70h10zM15 15h10v10H15V15zm5 5h10v10H20v-10zm55-5h10v10H75V15zm5 5h10v10H80v-10zM15 75h10v10H15V75zm5 5h10v10H20v-10z" />
                                    <rect x="35" y="35" width="30" height="30" rx="3" />
                                    <path d="M40 15h5v5h-5v-5zm15 15h5v5h-5v-5zm-5 30h5v5h-5v-5zm20-15h5v5h-5v-5zm-5 5h5v5h-5v-5zM45 45h10v10H45V45z" />
                                </svg>
                            </div>
                        </div>

                        <div className="instructions">
                            <p>How to Activate:</p>
                            <ul>
                                <li>Do not scan this QR code with your standard camera app.</li>
                                <li>Scan it using the <strong>eSIM Cellular Setup settings</strong> on your compatible mobile device.</li>
                                <li>Ensure you are connected to a WiFi network during installation.</li>
                            </ul>
                        </div>

                        <button 
                            className="modal-close-btn"
                            onClick={() => {
                                setShowSuccessModal(false);
                                setEmail('');
                            }}
                        >
                            Got It, Back to Plans
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
