import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LuAward, LuMapPin, LuUsers, LuSmile } from 'react-icons/lu';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../css/about.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Animated Counter ── */
const CounterItem = ({ target, suffix = '+', label, icon }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current) return;
        
        const countObj = { val: 0 };
        const ctx = gsap.context(() => {
            gsap.to(countObj, {
                val: target,
                duration: 2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: ref.current,
                    start: 'top 88%',
                    once: true,
                },
                onUpdate: () => {
                    setCount(Math.floor(countObj.val));
                }
            });
        }, ref);

        return () => ctx.revert();
    }, [target]);

    return (
        <div className="au-stat-item" ref={ref}>
            <div className="au-stat-icon">{icon}</div>
            <div className="au-stat-number">{count}{suffix}</div>
            <div className="au-stat-label">{label}</div>
        </div>
    );
};

/* ── Main Component ── */
export default function AboutUs() {
    const { t } = useTranslation();
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Scroll-triggered progress line width growth
            gsap.fromTo('.au-stats-progress-line',
                { width: '30px' },
                {
                    width: '100%',
                    ease: 'power1.inOut',
                    scrollTrigger: {
                        trigger: '.au-stats-bar',
                        start: 'top 75%',
                        end: 'bottom 45%',
                        scrub: 5,
                    }
                }
            );

            // Stats bar items
            gsap.from('.au-stat-item', {
                y: 24, opacity: 0, stagger: 0.1, duration: 0.75, ease: 'power3.out',
                scrollTrigger: { trigger: '.au-stats-bar', start: 'top 88%', once: true }
            });
            // Left content
            gsap.from('.au-left > *', {
                y: 28, opacity: 0, stagger: 0.12, duration: 0.85, ease: 'power3.out',
                scrollTrigger: { trigger: '.au-body', start: 'top 85%', once: true }
            });
            // Bento images
            gsap.from('.au-bento-tall, .au-bento-wide, .au-bento-sm', {
                scale: 0.96, opacity: 0, stagger: 0.1, duration: 0.9, ease: 'power2.out',
                scrollTrigger: { trigger: '.au-bento', start: 'top 88%', once: true }
            });
        }, sectionRef.current);
        return () => ctx.revert();
    }, []);

    return (
        <section className="au-section" id="about" ref={sectionRef}>
            <div className="au-container">

                {/* ── BOTTOM BODY ── */}
                <div className="au-body">

                    {/* Left panel */}
                    <div className="au-left">
                        <span className="au-eyebrow">
                            {t('about.label') || 'Choose Your Journey'}
                        </span>
                        <h2 className="au-title">
                            {t('about.heading') || 'Travel Your\nWay'}
                        </h2>
                        <p className="au-desc">
                            {t('about.desc') || 'Whether you\'re an explorer, a relaxer, or a culture lover – we have the perfect trip for you.'}
                        </p>
                        <Link
                            to="/Tours"
                            className="au-btn"
                            style={{ textDecoration: 'none' }}
                        >
                            {t('about.btn_discover') || 'Browse All Tours'}
                        </Link>
                    </div>

                    {/* Right bento image grid */}
                    <div className="au-bento">
                        {/* Tall left image */}
                        <div className="au-bento-tall">
                            <img
                                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
                                alt="Adventure Tours"
                            />
                            <div className="au-bento-label">
                                <span>{t('about.bento.adventure') || 'Adventure Tours'}</span>
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="au-bento-right">
                            {/* Wide top image */}
                            <div className="au-bento-wide">
                                <img
                                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
                                    alt="Beach Getaways"
                                />
                                <div className="au-bento-label au-bento-label--top">
                                    <span>{t('about.bento.beach') || 'Beach Getaways'}</span>
                                </div>
                            </div>

                            {/* Two small bottom images */}
                            <div className="au-bento-row">
                                <div className="au-bento-sm">
                                    <img
                                        src="https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=600&q=80"
                                        alt="Cultural Journeys"
                                    />
                                    <div className="au-bento-label">
                                        <span>{t('about.bento.cultural') || 'Cultural Journeys'}</span>
                                    </div>
                                </div>
                                <div className="au-bento-sm">
                                    <img
                                        src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80"
                                        alt="Luxury Escapes"
                                    />
                                    <div className="au-bento-label">
                                        <span>{t('about.bento.luxury') || 'Luxury Escapes'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>{/* end au-body */}

                {/* ── TOP STATS BAR ── */}
                <div className="au-stats-bar">
                    <div className="au-stats-inner">
                        <div className="au-stats-progress-line" />
                        <CounterItem target={10} suffix="+" label={t('about.stats.years') || 'Years of Experience'} icon={<LuAward />} />
                        <div className="au-stat-divider" />
                        <CounterItem target={500} suffix="+" label={t('about.stats.clients') || 'Unique Destinations'} icon={<LuMapPin />} />
                        <div className="au-stat-divider" />
                        <CounterItem target={50} suffix="K+" label={t('about.stats.cities') || 'Happy Travelers'} icon={<LuUsers />} />
                        <div className="au-stat-divider" />
                        <CounterItem target={98} suffix="%" label={t('about.stats.services') || 'Customer Satisfaction'} icon={<LuSmile />} />
                    </div>
                </div>

            </div>{/* end au-container */}
        </section>
    );
}
