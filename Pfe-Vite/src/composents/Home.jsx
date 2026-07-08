import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { LuChevronUp, LuArrowUpRight, LuFacebook, LuTwitter, LuInstagram, LuChevronDown, LuShieldCheck, LuCompass, LuStar } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../css/home.css";

gsap.registerPlugin(ScrollTrigger);

export default function Home({ onDiscover }) {
    const { t, i18n } = useTranslation();
    const heroRef = useRef(null);
    const bgRef = useRef(null);
    const titleRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Content Entrance
            const tl = gsap.timeline({ delay: 0.2 });

            tl.fromTo(".hero-nadi-badge", {
                y: 20,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out"
            })
            .fromTo(".welcome-title", {
                y: 40,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power4.out"
            }, "-=0.4")
            .fromTo(".welcome-subtitle", {
                y: 30,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.6")
            .fromTo(".hero-feature-item", {
                y: 20,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
                clearProps: "all"
            }, "-=0.4")
            .fromTo(".hero-action-btn", {
                scale: 0.8,
                opacity: 0
            }, {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                ease: "back.out(1.7)"
            }, "-=0.2");

            // Sidebar entrance
            gsap.from(".hero-social-sidebar > *", {
                x: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out",
                delay: 1.5,
                clearProps: "all"
            });
        }, heroRef.current);

        return () => ctx.revert();
    }, []);

    const isAr = i18n.language === 'ar';

    return (
        <div className={`pg1 ${isAr ? 'rtl' : ''}`} id="home" style={{ position: 'relative' }} ref={heroRef}>
            <div className="home-hero">
                <div
                    className="hero-bg-layer active"
                    ref={bgRef}
                    style={{ 
                        backgroundImage: `url("/bg final.jfif")`, 
                        opacity: 1, 
                        transform: 'none' 
                    }}
                />
                
                <div className="home-welcome-overlay">
                    <div className="welcome-container">
                        <div className="hero-nadi-badge">
                            <span className="badge-dot"></span>
                            {t('home.hero_badge')}
                        </div>
                        <h1 
                            className="welcome-title" 
                            ref={titleRef}
                            dangerouslySetInnerHTML={{ __html: t('home.hero_title') }}
                        />
                        <p className="welcome-subtitle">
                            {t('home.hero_desc')}
                        </p>

                        <div className="hero-features-row">
                            <div className="hero-feature-item">
                                <div className="feature-icon-box">
                                    <LuShieldCheck />
                                </div>
                                <div className="feature-text">
                                    <span className="feature-label">{t('home.hero_feat_luxury')}</span>
                                </div>
                            </div>
                            <div className="hero-feature-item">
                                <div className="feature-icon-box">
                                    <LuCompass />
                                </div>
                                <div className="feature-text">
                                    <span className="feature-label">{t('home.hero_feat_authentic')}</span>
                                </div>
                            </div>
                            <div className="hero-feature-item">
                                <div className="feature-icon-box">
                                    <LuStar />
                                </div>
                                <div className="feature-text">
                                    <span className="feature-label">{t('home.hero_feat_tailored')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* The original bottom-left cutout with the button */}
                <div className="hero-cutout">
                    <button className="hero-action-btn" onClick={onDiscover}>
                        {t('home.hero_btn')}
                    </button>
                </div>

                {/* Vertical Social & Scroll Sidebar (Right) */}
                <div className="hero-social-sidebar">
                    <div className="social-circle">
                        <LuFacebook />
                    </div>
                    <div className="social-circle">
                        <LuTwitter />
                    </div>
                    <div className="social-circle">
                        <LuInstagram />
                    </div>

                    <div className="scroll-indicator-wrapper">
                        <span className="scroll-text">{t('home.hero_scroll')}</span>
                        <div className="scroll-line-vertical"></div>
                        <LuChevronDown className="scroll-arrow-icon" />
                    </div>
                </div>

            </div>
        </div>
    );
}

export function ScrollTopButton() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setShow(window.scrollY > 200);
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!show) return null;

    return (
        <button
            className="scroll-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
        >
            <LuChevronUp />
        </button>
    );
}
