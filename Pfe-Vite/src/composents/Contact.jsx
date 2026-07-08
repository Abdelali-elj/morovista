import React, { useRef, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LuArrowLeft, LuMapPin, LuPhone, LuMail, LuClock, LuSend, LuUser, LuMessageSquare } from 'react-icons/lu';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../css/contact.css';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.contact-hero-badge', {
                y: -30, opacity: 0, duration: 0.8, ease: 'power3.out'
            });
            gsap.from('.contact-hero-title', {
                y: 40, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out'
            });
            gsap.from('.contact-hero-desc', {
                y: 30, opacity: 0, duration: 0.9, delay: 0.4, ease: 'power3.out'
            });
            gsap.from('.contact-info-card', {
                y: 50, opacity: 0, stagger: 0.15, duration: 0.8, delay: 0.5,
                ease: 'back.out(1.7)'
            });
            gsap.from('.contact-form-wrapper', {
                x: 60, opacity: 0, duration: 1, delay: 0.3, ease: 'power3.out',
                scrollTrigger: { trigger: '.contact-form-wrapper', start: 'top 85%' }
            });
            gsap.from('.contact-map-wrapper', {
                x: -60, opacity: 0, duration: 1, delay: 0.3, ease: 'power3.out',
                scrollTrigger: { trigger: '.contact-map-wrapper', start: 'top 85%' }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);
        setTimeout(() => {
            setSending(false);
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1800);
    };

    const infoCards = [
        {
            icon: <LuMapPin />,
            label: t('contact.info.address_label'),
            value: t('contact.info.address_value'),
            color: '#135c51'
        },
        {
            icon: <LuPhone />,
            label: t('contact.info.phone_label'),
            value: '+212 5XX XX XX XX',
            color: '#0b4d45'
        },
        {
            icon: <LuMail />,
            label: t('contact.info.email_label'),
            value: 'support@morovista.ma',
            color: '#135c51'
        },
        {
            icon: <LuClock />,
            label: t('contact.info.hours_label'),
            value: t('contact.info.hours_value'),
            color: '#0b4d45'
        }
    ];

    return (
        <div className="contact-page" ref={sectionRef}>
            {/* Hero Banner */}
            <div className="contact-hero">
                <div className="contact-hero-overlay" />
                <div className="contact-hero-content">
                    <Link to="/" className="contact-back-btn">
                        <LuArrowLeft /> {t('common.back_home')}
                    </Link>
                    <span className="contact-hero-badge">{t('contact.badge')}</span>
                    <h1 className="contact-hero-title">{t('contact.title')}</h1>
                    <p className="contact-hero-desc">{t('contact.subtitle')}</p>
                </div>
            </div>

            {/* Info Cards Row */}
            <div className="contact-cards-row">
                {infoCards.map((card, i) => (
                    <div className="contact-info-card" key={i} style={{ '--accent': card.color }}>
                        <div className="contact-info-icon">{card.icon}</div>
                        <div className="contact-info-text">
                            <span className="contact-info-label">{card.label}</span>
                            <p className="contact-info-value">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content: Form + Map */}
            <div className="contact-main-grid">
                {/* Contact Form */}
                <div className="contact-form-wrapper">
                    <div className="contact-form-header">
                        <span className="contact-form-badge">{t('contact.form.badge')}</span>
                        <h2>{t('contact.form.title')}</h2>
                        <p>{t('contact.form.desc')}</p>
                    </div>

                    {submitted ? (
                        <div className="contact-success">
                            <div className="success-icon">✓</div>
                            <h3>{t('contact.form.success_title')}</h3>
                            <p>{t('contact.form.success_desc')}</p>
                            <button className="contact-submit-btn" onClick={() => setSubmitted(false)}>
                                {t('contact.form.send_another')}
                            </button>
                        </div>
                    ) : (
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="contact-form-row">
                                <div className="contact-field">
                                    <label htmlFor="contact-name">
                                        <LuUser /> {t('contact.form.name')}
                                    </label>
                                    <input
                                        id="contact-name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder={t('contact.form.name_placeholder')}
                                        required
                                    />
                                </div>
                                <div className="contact-field">
                                    <label htmlFor="contact-email">
                                        <LuMail /> {t('contact.form.email')}
                                    </label>
                                    <input
                                        id="contact-email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder={t('contact.form.email_placeholder')}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="contact-field">
                                <label htmlFor="contact-subject">
                                    <LuMessageSquare /> {t('contact.form.subject')}
                                </label>
                                <input
                                    id="contact-subject"
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder={t('contact.form.subject_placeholder')}
                                    required
                                />
                            </div>

                            <div className="contact-field">
                                <label htmlFor="contact-message">
                                    <LuMessageSquare /> {t('contact.form.message')}
                                </label>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder={t('contact.form.message_placeholder')}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={`contact-submit-btn ${sending ? 'sending' : ''}`}
                                disabled={sending}
                            >
                                {sending ? (
                                    <span className="btn-spinner" />
                                ) : (
                                    <><LuSend /> {t('contact.form.send')}</>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Map */}
                <div className="contact-map-wrapper">
                    <div className="contact-map-header">
                        <span className="contact-form-badge">{t('contact.map.badge')}</span>
                        <h2>{t('contact.map.title')}</h2>
                        <p>{t('contact.map.desc')}</p>
                    </div>
                    <div className="contact-map-frame">
                        <iframe
                            title="MoroVista Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.847!2d-7.589843!3d33.573110!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d2868f4a27f1%3A0xb3cfc6dab44ebf68!2sCasablanca%2C%20Morocco!5e0!3m2!1sen!2sma!4v1700000000000"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                    <div className="contact-social-row">
                        <a href="#" className="contact-social-btn" aria-label="Instagram">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </a>
                        <a href="#" className="contact-social-btn" aria-label="Facebook">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                        <a href="#" className="contact-social-btn" aria-label="WhatsApp">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
