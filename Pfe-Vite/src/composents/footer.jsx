import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaPaperPlane, FaStar, FaGem, FaAward, FaShieldAlt } from "react-icons/fa";
import { LuPhone, LuMail, LuMapPin, LuGlobe, LuArrowRight, LuClock, LuHeadphones } from "react-icons/lu";
import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const { t } = useTranslation();
    const footerRef = useRef(null);
    const [activePolicy, setActivePolicy] = useState(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".premium-footer-section", {
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });

            gsap.from(".premium-social-icon", {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: "elastic.out(1, 0.5)",
                scrollTrigger: {
                    trigger: ".premium-social-icons",
                    start: "top 90%",
                    toggleActions: "play none none none"
                }
            });

            gsap.from(".premium-feature-card", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".premium-features",
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });
        }, footerRef.current);

        return () => ctx.revert();
    }, []);

    return (
        <footer className="premium-footer" id="contact" ref={footerRef}>
            {/* Premium Top Gradient Bar */}
            <div className="premium-gradient-bar"></div>



            {/* Main Footer Content */}
            <div className="premium-footer-main">
                <div className="premium-container">
                    <div className="premium-footer-grid">
                        {/* Brand Column */}
                        <div className="premium-footer-section brand-section">
                            <Link to="/" className="premium-brand-link">
                                <div className="premium-logo-wrapper">
                                    <img src="/logo-pfe1.webp" alt="MoroVista Logo" className="premium-logo" />
                                    <div className="logo-shine"></div>
                                </div>
                                <div className="premium-brand-text">
                                    <span className="brand-name">MoroVista</span>
                                    <span className="brand-tagline">Discover Morocco</span>
                                </div>
                            </Link>
                            <p className="premium-brand-desc">
                                Experience the magic of Morocco with curated travel experiences, premium accommodations, and unforgettable adventures. Your journey begins here.
                            </p>
                            <div className="premium-trust-badges">
                                <div className="trust-badge">
                                    <FaStar className="trust-icon" />
                                    <span>4.9 Rating</span>
                                </div>
                                <div className="trust-badge">
                                    <FaGem className="trust-icon" />
                                    <span>Premium Service</span>
                                </div>
                            </div>
                            <div className="premium-social-icons">
                                <a href="#" className="premium-social-icon facebook" aria-label="Facebook">
                                    <FaFacebookF />
                                </a>
                                <a href="#" className="premium-social-icon instagram" aria-label="Instagram">
                                    <FaInstagram />
                                </a>
                                <a href="#" className="premium-social-icon twitter" aria-label="Twitter">
                                    <FaTwitter />
                                </a>
                                <a href="#" className="premium-social-icon linkedin" aria-label="LinkedIn">
                                    <FaLinkedinIn />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links Column */}
                        <div className="premium-footer-section">
                            <h3 className="premium-section-title">
                                <span className="title-icon">✦</span>
                                Quick Links
                            </h3>
                            <ul className="premium-nav-list">
                                <li>
                                    <Link to="/" className="premium-nav-link">
                                        <LuArrowRight className="nav-arrow" />
                                        <span>Home</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/places" className="premium-nav-link">
                                        <LuArrowRight className="nav-arrow" />
                                        <span>Places</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/Stadium" className="premium-nav-link">
                                        <LuArrowRight className="nav-arrow" />
                                        <span>Stadiums</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/AboutUs" className="premium-nav-link">
                                        <LuArrowRight className="nav-arrow" />
                                        <span>About Us</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/Contact" className="premium-nav-link">
                                        <LuArrowRight className="nav-arrow" />
                                        <span>Contact</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Services Column */}
                        <div className="premium-footer-section">
                            <h3 className="premium-section-title">
                                <span className="title-icon">✦</span>
                                Our Services
                            </h3>
                            <ul className="premium-nav-list">
                                <li>
                                    <Link to="/Hotels" className="premium-nav-link">
                                        <LuArrowRight className="nav-arrow" />
                                        <span>Luxury Hotels</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/Restaurant" className="premium-nav-link">
                                        <LuArrowRight className="nav-arrow" />
                                        <span>Fine Dining</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/Transport" className="premium-nav-link">
                                        <LuArrowRight className="nav-arrow" />
                                        <span>Private Transport</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/PhoneList" className="premium-nav-link">
                                        <LuArrowRight className="nav-arrow" />
                                        <span>Emergency Services</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/Tours" className="premium-nav-link">
                                        <LuArrowRight className="nav-arrow" />
                                        <span>Guided Tours</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact & Newsletter Column */}
                        <div className="premium-footer-section contact-section">
                            <h3 className="premium-section-title">
                                <span className="title-icon">✦</span>
                                Get In Touch
                            </h3>
                            <div className="premium-contact-info">
                                <div className="premium-contact-item">
                                    <div className="contact-icon-box">
                                        <LuMapPin className="contact-icon" />
                                    </div>
                                    <div className="contact-text">
                                        <span className="contact-label">Address</span>
                                        <span className="contact-value">Casablanca, Morocco</span>
                                    </div>
                                </div>
                                <div className="premium-contact-item">
                                    <div className="contact-icon-box">
                                        <LuPhone className="contact-icon" />
                                    </div>
                                    <div className="contact-text">
                                        <span className="contact-label">Phone</span>
                                        <span className="contact-value">+212 5XX XX XX XX</span>
                                    </div>
                                </div>
                                <div className="premium-contact-item">
                                    <div className="contact-icon-box">
                                        <LuMail className="contact-icon" />
                                    </div>
                                    <div className="contact-text">
                                        <span className="contact-label">Email</span>
                                        <span className="contact-value">contact@morovista.ma</span>
                                    </div>
                                </div>
                                <div className="premium-contact-item">
                                    <div className="contact-icon-box">
                                        <LuGlobe className="contact-icon" />
                                    </div>
                                    <div className="contact-text">
                                        <span className="contact-label">Website</span>
                                        <span className="contact-value">www.morovista.ma</span>
                                    </div>
                                </div>
                            </div>

                            <div className="premium-newsletter">
                                <h4 className="newsletter-title">Subscribe to Newsletter</h4>
                                <p className="newsletter-desc">Get exclusive deals and travel tips</p>
                                <form className="premium-newsletter-form" onSubmit={(e) => e.preventDefault()}>
                                    <div className="newsletter-input-wrapper">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="premium-newsletter-input"
                                        />
                                        <button type="submit" className="premium-newsletter-btn">
                                            <FaPaperPlane />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Bottom Bar */}
            <div className="premium-footer-bottom">
                <div className="premium-container">
                    <div className="premium-bottom-content">
                        <div className="copyright-section">
                            <p className="premium-copyright">
                                © {new Date().getFullYear()} <strong className="brand-highlight">MoroVista</strong>. All rights reserved. Crafted by <strong className="brand-highlight">abdelali elarj</strong>.
                            </p>
                        </div>
                        <div className="premium-legal-links">
                            <button onClick={() => setActivePolicy('privacy')} className="premium-legal-btn-link">Privacy Policy</button>
                            <span className="legal-separator">•</span>
                            <button onClick={() => setActivePolicy('terms')} className="premium-legal-btn-link">Terms of Service</button>
                            <span className="legal-separator">•</span>
                            <button onClick={() => setActivePolicy('cookie')} className="premium-legal-btn-link">Cookie Policy</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Policy Modal */}
            {activePolicy && (
                <div className="policy-modal-overlay" onClick={() => setActivePolicy(null)}>
                    <div className="policy-modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="policy-modal-header">
                            <h3 className="policy-modal-title">
                                {activePolicy === 'privacy' && "Privacy Policy"}
                                {activePolicy === 'terms' && "Terms of Service"}
                                {activePolicy === 'cookie' && "Cookie Policy"}
                            </h3>
                            <button className="policy-modal-close" onClick={() => setActivePolicy(null)} aria-label="Close modal">×</button>
                        </div>
                        <div className="policy-modal-body">
                            {activePolicy === 'privacy' && (
                                <div className="policy-content">
                                    <p className="policy-last-updated">Last Updated: May 2026</p>
                                    <p className="policy-intro">
                                        At <strong>MoroVista</strong>, we are committed to safeguarding the privacy of our website visitors and service users. This policy details how we handle, store, and protect your personal information to ensure a safe and premium travel experience in Morocco.
                                    </p>
                                    
                                    <div className="policy-section">
                                        <h4>1. Information We Collect</h4>
                                        <p>To provide you with curated Moroccan travel experiences, we collect the following categories of information:</p>
                                        <ul>
                                            <li><strong>Identity Data:</strong> First name, last name, date of birth, and passport details (when booking international flights or local premium tours).</li>
                                            <li><strong>Contact Data:</strong> Email address, phone number, and physical address.</li>
                                            <li><strong>Travel Preferences:</strong> Dietary requirements, accommodation choices, and accessibility requests.</li>
                                            <li><strong>Technical & Usage Data:</strong> IP address, browser type, search queries (cities, Riads, restaurants), and interaction with our chatbot assistant.</li>
                                        </ul>
                                    </div>

                                    <div className="policy-section">
                                        <h4>2. How We Use Your Information</h4>
                                        <p>We process your data for the following essential business purposes:</p>
                                        <ul>
                                            <li>To finalize and manage your hotel, restaurant, and private transport bookings.</li>
                                            <li>To tailor-make and personalize travel itineraries suited to your exact tastes.</li>
                                            <li>To provide real-time updates regarding flight details, weather advisories, or booking confirmations.</li>
                                            <li>To train our MoroVista AI Assistant to better answer your queries about Morocco.</li>
                                        </ul>
                                    </div>

                                    <div className="policy-section">
                                        <h4>3. Data Sharing and Third Parties</h4>
                                        <p>MoroVista will never sell your personal information. We only share necessary data with trusted travel partners (luxury Riads, private drivers, local certified guides) solely to fulfill your bookings.</p>
                                    </div>

                                    <div className="policy-section">
                                        <h4>4. Security and Storage</h4>
                                        <p>All data is processed through industry-standard secure servers using 256-bit SSL encryption. We employ strict access controls to prevent unauthorized access, alteration, or disclosure of your travel documents.</p>
                                    </div>

                                    <div className="policy-section">
                                        <h4>5. Your Legal Rights</h4>
                                        <p>Under international data protection regulations, you have the right to request access, correction, transfer, or complete deletion of your personal data at any time. Simply reach out to our privacy officer at <strong>privacy@morovista.ma</strong>.</p>
                                    </div>
                                </div>
                            )}

                            {activePolicy === 'terms' && (
                                <div className="policy-content">
                                    <p className="policy-last-updated">Last Updated: May 2026</p>
                                    <p className="policy-intro">
                                        Welcome to <strong>MoroVista</strong>. By accessing our platform, booking our services, or interacting with our digital tools, you agree to comply with and be bound by the following Terms of Service. Please read them carefully.
                                    </p>

                                    <div className="policy-section">
                                        <h4>1. Scope of Services</h4>
                                        <p>MoroVista provides an online platform that aggregates, curates, and books luxury accommodations, dining experiences, certified guided tours, and premium private transport across the Kingdom of Morocco.</p>
                                    </div>

                                    <div className="policy-section">
                                        <h4>2. Bookings, Payments, and Cancellations</h4>
                                        <ul>
                                            <li><strong>Pricing:</strong> All displayed prices are shown in Moroccan Dirhams (MAD), Euros (EUR), or US Dollars (USD) and are inclusive of local tourist taxes unless stated otherwise.</li>
                                            <li><strong>Payment:</strong> Secure payments are processed in real-time. A booking is only officially confirmed once receipt of deposit is cleared.</li>
                                            <li><strong>Cancellations:</strong> Cancel free of charge up to 72 hours prior to the scheduled tour or transport service. Riad and Hotel cancellations are subject to their individual reservation policies.</li>
                                        </ul>
                                    </div>

                                    <div className="policy-section">
                                        <h4>3. User Responsibilities & Conduct</h4>
                                        <p>When using our website, interactive tools, and chat support, you agree to:</p>
                                        <ul>
                                            <li>Provide accurate and complete personal details during signup and booking.</li>
                                            <li>Respect local Moroccan laws, traditions, and cultural heritage while traveling.</li>
                                            <li>Not engage in malicious software injection, data scraping, or abusing our AI systems.</li>
                                        </ul>
                                    </div>

                                    <div className="policy-section">
                                        <h4>4. Intellectual Property</h4>
                                        <p>All original content, graphics, custom itineraries, logos, and UI designs displayed on MoroVista are the exclusive property of MoroVista and protected by copyright laws.</p>
                                    </div>

                                    <div className="policy-section">
                                        <h4>5. Limitation of Liability</h4>
                                        <p>MoroVista partners with premium, licensed local service providers to guarantee high quality. However, we act as an intermediary agency and cannot be held liable for flight delays, severe weather disruptions, or personal accidents beyond our direct control.</p>
                                    </div>
                                </div>
                            )}

                            {activePolicy === 'cookie' && (
                                <div className="policy-content">
                                    <p className="policy-last-updated">Last Updated: May 2026</p>
                                    <p className="policy-intro">
                                        This Cookie Policy explains how <strong>MoroVista</strong> uses cookies and similar tracking technologies to personalize and enhance your browsing experience on our platform.
                                    </p>

                                    <div className="policy-section">
                                        <h4>1. What Are Cookies?</h4>
                                        <p>Cookies are tiny text files placed on your computer or mobile device when you browse websites. They help us remember your preferences, keep you logged in, and analyze website performance.</p>
                                    </div>

                                    <div className="policy-section">
                                        <h4>2. Types of Cookies We Use</h4>
                                        <ul>
                                            <li><strong>Essential Cookies:</strong> These are absolutely crucial to make the website function properly. They handle secure user logins, booking cart state, and currency preferences.</li>
                                            <li><strong>Preference Cookies:</strong> These remember your chosen settings, such as your selected language (English, French, or Arabic) and localized currency views, ensuring a smooth return visit.</li>
                                            <li><strong>Analytics & Performance:</strong> We use aggregated, anonymous cookies to count visits, track popular tours (e.g. Marrakech, Sahara desert), and identify any navigation glitches.</li>
                                            <li><strong>Interactive Chat Cookies:</strong> These keep your ongoing chat session active with the MoroVista AI Assistant so you do not lose your conversation history during page transitions.</li>
                                        </ul>
                                    </div>

                                    <div className="policy-section">
                                        <h4>3. Managing Your Cookie Settings</h4>
                                        <p>Most browsers let you reject or delete cookies through their settings panel. Note that disabling essential cookies may impact your ability to successfully complete hotel or tour bookings on our platform.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="policy-modal-footer">
                            <button className="policy-modal-btn" onClick={() => setActivePolicy(null)}>Accept & Close</button>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
}
