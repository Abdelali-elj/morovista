import React, { useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    LuArrowLeftRight,
    LuBuilding2,
    LuCloudSun,
    LuMapPinned,
    LuPhoneCall,
    LuTrophy,
    LuUtensils,
    LuCar,
    LuStore,
    LuBadgeCheck,
    LuCompass,
    LuWifi
} from "react-icons/lu";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
    const { t } = useTranslation();
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Header animation
            gsap.fromTo(".services-header h2, .services-header .subtitle", 
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: ".services-header",
                        start: "top 95%",
                        toggleActions: "play none none none"
                    }
                }
            );

            // Grid cards animations
            gsap.fromTo(".service-card-mini", 
                { y: 30, opacity: 0, scale: 0.9 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    stagger: {
                        each: 0.04,
                        from: "start"
                    },
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".services-grid-3x3",
                        start: "top 98%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }, sectionRef.current);

        return () => ctx.revert();
    }, []);

    return (
        <section className="services-section" ref={sectionRef}>
            <div className="services-container">
                <img src="/bg5.png" alt="" className="services-bg" />
                <div className="services-content">
                    <div className="services-header" style={{ marginBottom: '2.5rem' }}>
                        <span className="services-tagline">{t('services.tagline', 'MoroVista Experience')}</span>
                        <h2>{t('services.title', 'Explore Our Services')}</h2>
                        <p className="subtitle">{t('services.subtitle', 'Everything you need to explore Morocco easily and safely')}</p>
                    </div>
                    <div className="services-content-layout">
                        <div className="services-grid-3x3">
                            {/* Card 1: Hotels */}
                            <Link to="/Hotels" className="service-card-mini">
                                <div className="card-top-icon-badge">
                                    <LuBuilding2 className="icon" />
                                </div>
                                <div className="card-bg-wrapper">
                                    <div className="card-bg-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800')" }} />
                                    <div className="card-dark-overlay" />
                                </div>
                                <div className="card-content-overlay">
                                    <div className="card-bottom-info">
                                        <div className="card-title-row">
                                            <h3>{t('services.grid.hotels', 'Hotels')}</h3>
                                            <span className="card-count-badge">{t('services.count.hotels', '520+ Hotels')}</span>
                                        </div>
                                        <p className="card-desc">{t('services.desc.hotels', 'Find the best stays across Morocco')}</p>
                                    </div>
                                </div>
                            </Link>

                            {/* Card 2: Restaurants */}
                            <Link to="/Restaurant" className="service-card-mini">
                                <div className="card-top-icon-badge">
                                    <LuUtensils className="icon" />
                                </div>
                                <div className="card-bg-wrapper">
                                    <div className="card-bg-img" style={{ backgroundImage: "url('https://i.pinimg.com/736x/a1/5a/c9/a15ac963073c86b1f8c606171e96047c.jpg')" }} />
                                    <div className="card-dark-overlay" />
                                </div>
                                <div className="card-content-overlay">
                                    <div className="card-bottom-info">
                                        <div className="card-title-row">
                                            <h3>{t('services.grid.restaurants', 'Restaurants')}</h3>
                                            <span className="card-count-badge">{t('services.count.restaurants', '340+ Restaurants')}</span>
                                        </div>
                                        <p className="card-desc">{t('services.desc.restaurants', 'Savor authentic Moroccan flavors')}</p>
                                    </div>
                                </div>
                            </Link>

                            {/* Card 3: Stadiums */}
                            <Link to="/Stadium" className="service-card-mini">
                                <div className="card-top-icon-badge">
                                    <LuTrophy className="icon" />
                                </div>
                                <div className="card-bg-wrapper">
                                    <div className="card-bg-img" style={{ backgroundImage: "url('https://i.pinimg.com/736x/2f/eb/6a/2feb6a19f8ae3a3cbfd6e447d64c1dcc.jpg')" }} />
                                    <div className="card-dark-overlay" />
                                </div>
                                <div className="card-content-overlay">
                                    <div className="card-bottom-info">
                                        <div className="card-title-row">
                                            <h3>{t('services.grid.stadiums', 'Stadiums')}</h3>
                                            <span className="card-count-badge">{t('services.count.stadiums', '25+ Stadiums')}</span>
                                        </div>
                                        <p className="card-desc">{t('services.desc.stadiums', 'Discover top sporting complexes')}</p>
                                    </div>
                                </div>
                            </Link>

                            {/* Card 4: Places */}
                            <Link to="/Places" className="service-card-mini">
                                <div className="card-top-icon-badge">
                                    <LuMapPinned className="icon" />
                                </div>
                                <div className="card-bg-wrapper">
                                    <div className="card-bg-img" style={{ backgroundImage: "url('https://i.pinimg.com/1200x/ab/02/44/ab024490d6f080530c0da81877240166.jpg')" }} />
                                    <div className="card-dark-overlay" />
                                </div>
                                <div className="card-content-overlay">
                                    <div className="card-bottom-info">
                                        <div className="card-title-row">
                                            <h3>{t('services.grid.places', 'Places')}</h3>
                                            <span className="card-count-badge">{t('services.count.places', '180+ Monuments')}</span>
                                        </div>
                                        <p className="card-desc">{t('services.desc.places', 'Explore historic architectural wonders')}</p>
                                    </div>
                                </div>
                            </Link>

                            {/* Card 5: Currency */}
                            <Link to="/Exchange" className="service-card-mini">
                                <div className="card-top-icon-badge">
                                    <LuArrowLeftRight className="icon" />
                                </div>
                                <div className="card-bg-wrapper">
                                    <div className="card-bg-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=800')" }} />
                                    <div className="card-dark-overlay" />
                                </div>
                                <div className="card-content-overlay">
                                    <div className="card-bottom-info">
                                        <div className="card-title-row">
                                            <h3>{t('services.grid.currency', 'Currency')}</h3>
                                            <span className="card-count-badge">{t('services.count.currency', 'Active Rates')}</span>
                                        </div>
                                        <p className="card-desc">{t('services.desc.currency', 'Real-time currency exchange rates')}</p>
                                    </div>
                                </div>
                            </Link>

                            {/* Card 6: Weather */}
                            <Link to="/Weather" className="service-card-mini">
                                <div className="card-top-icon-badge">
                                    <LuCloudSun className="icon" />
                                </div>
                                <div className="card-bg-wrapper">
                                    <div className="card-bg-img" style={{ backgroundImage: "url('https://i.pinimg.com/1200x/ef/a6/a7/efa6a7bc6daaa15788de210a5cacd219.jpg')" }} />
                                    <div className="card-dark-overlay" />
                                </div>
                                <div className="card-content-overlay">
                                    <div className="card-bottom-info">
                                        <div className="card-title-row">
                                            <h3>{t('services.grid.weather', 'Weather')}</h3>
                                            <span className="card-count-badge">{t('services.count.weather', 'Live Forecast')}</span>
                                        </div>
                                        <p className="card-desc">{t('services.desc.weather', 'Live weather updates by city')}</p>
                                    </div>
                                </div>
                            </Link>

                            {/* Card 7: Emergency */}
                            <Link to="/PhoneList" className="service-card-mini">
                                <div className="card-top-icon-badge">
                                    <LuPhoneCall className="icon" />
                                </div>
                                <div className="card-bg-wrapper">
                                    <div className="card-bg-img" style={{ backgroundImage: "url('https://i.pinimg.com/736x/ab/0c/cf/ab0ccf8f4e7f8a9dbdfffeccff512ab4.jpg')" }} />
                                    <div className="card-dark-overlay" />
                                </div>
                                <div className="card-content-overlay">
                                    <div className="card-bottom-info">
                                        <div className="card-title-row">
                                            <h3>{t('services.grid.emergency', 'Emergency')}</h3>
                                            <span className="card-count-badge">{t('services.count.emergency', '24/7 Support')}</span>
                                        </div>
                                        <p className="card-desc">{t('services.desc.emergency', 'Quick access to emergency hotlines')}</p>
                                    </div>
                                </div>
                            </Link>

                            {/* Card 8: Transport */}
                            <Link to="/Transport" className="service-card-mini">
                                <div className="card-top-icon-badge">
                                    <LuCar className="icon" />
                                </div>
                                <div className="card-bg-wrapper">
                                    <div className="card-bg-img" style={{ backgroundImage: "url('https://i.pinimg.com/1200x/54/ac/52/54ac529144778a4566a5a9bc588139cf.jpg')" }} />
                                    <div className="card-dark-overlay" />
                                </div>
                                <div className="card-content-overlay">
                                    <div className="card-bottom-info">
                                        <div className="card-title-row">
                                            <h3>{t('services.grid.transport', 'Transport')}</h3>
                                            <span className="card-count-badge">{t('services.count.transport', '85+ Vehicles')}</span>
                                        </div>
                                        <p className="card-desc">{t('services.desc.transport', 'Secure car rental & private shuttles')}</p>
                                    </div>
                                </div>
                            </Link>

                            {/* Card 9: Local Services */}
                            <Link to="/LocalServices" className="service-card-mini">
                                <div className="card-top-icon-badge">
                                    <LuStore className="icon" />
                                </div>
                                <div className="card-bg-wrapper">
                                    <div className="card-bg-img" style={{ backgroundImage: "url('https://i.pinimg.com/736x/4b/f5/a8/4bf5a801477466ede9d0c2b1d5b20378.jpg')" }} />
                                    <div className="card-dark-overlay" />
                                </div>
                                <div className="card-content-overlay">
                                    <div className="card-bottom-info">
                                        <div className="card-title-row">
                                            <h3>{t('services.grid.local_services', 'Local Services')}</h3>
                                            <span className="card-count-badge">{t('services.count.local_services', '150+ Services')}</span>
                                        </div>
                                        <p className="card-desc">{t('services.desc.local_services', 'Essential services & guides near you')}</p>
                                    </div>
                                </div>
                            </Link>

                            {/* Card 10: Activities For Fun 🎯 */}
                            <Link to="/Activities" className="service-card-mini">
                                <div className="card-top-icon-badge">
                                    <LuCompass className="icon" />
                                </div>
                                <div className="card-bg-wrapper">
                                    <div className="card-bg-img" style={{ backgroundImage: "url('https://i.pinimg.com/1200x/e2/5d/da/e25dda7fed91145d50caba66f263f615.jpg')", backgroundPosition: "center 60%" }} />
                                    <div className="card-dark-overlay" />
                                </div>
                                <div className="card-content-overlay">
                                    <div className="card-bottom-info">
                                        <div className="card-title-row">
                                            <h3>{t('services.grid.fun_activities', 'Activities For Fun')}</h3>
                                            <span className="card-count-badge">{t('services.count.fun_activities', '100+ Activities')}</span>
                                        </div>
                                        <p className="card-desc">{t('services.desc.fun_activities', 'Adventures, tours & authentic local experiences')}</p>
                                    </div>
                                </div>
                            </Link>

                            {/* Card 11: Visa Requirements 🛂 */}
                            <Link to="/Visa" className="service-card-mini">
                                <div className="card-top-icon-badge">
                                    <LuBadgeCheck className="icon" />
                                </div>
                                <div className="card-bg-wrapper">
                                    <div className="card-bg-img" style={{ backgroundImage: "url('https://i.pinimg.com/736x/eb/9f/4b/eb9f4b90d02e415077b0260fb3466828.jpg')", backgroundPosition: "center 60%" }} />
                                    <div className="card-dark-overlay" />
                                </div>
                                <div className="card-content-overlay">
                                    <div className="card-bottom-info">
                                        <div className="card-title-row">
                                            <h3>{t('services.grid.visa_requirements', 'Visa Requirements')}</h3>
                                            <span className="card-count-badge">{t('services.count.visa_requirements', 'Official Guide')}</span>
                                        </div>
                                        <p className="card-desc">{t('services.desc.visa_requirements', 'Check entry rules, documents & visa exemptions')}</p>
                                    </div>
                                </div>
                            </Link>

                            {/* Card 12: eSIM & Internet 📶 */}
                            <Link to="/Esim" className="service-card-mini">
                                <div className="card-top-icon-badge">
                                    <LuWifi className="icon" />
                                </div>
                                <div className="card-bg-wrapper">
                                    <div className="card-bg-img" style={{ backgroundImage: "url('https://i.pinimg.com/736x/6d/65/c1/6d65c19580be00184199818d5b7efb51.jpg')", backgroundPosition: "center 60%" }} />
                                    <div className="card-dark-overlay" />
                                </div>
                                <div className="card-content-overlay">
                                    <div className="card-bottom-info">
                                        <div className="card-title-row">
                                            <h3>{t('services.grid.esim_internet', 'eSIM & Internet')}</h3>
                                            <span className="card-count-badge">{t('services.count.esim_internet', 'Instant Connect')}</span>
                                        </div>
                                        <p className="card-desc">{t('services.desc.esim_internet', 'High-speed local eSIM plans for hassle-free travel')}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
