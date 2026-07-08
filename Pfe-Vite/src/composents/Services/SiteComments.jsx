import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaStar } from 'react-icons/fa';
import {
    LuChevronLeft,
    LuChevronRight,
    LuX,
    LuShoppingBag,
    LuMapPin,
    LuHeart,
    LuCompass,
    LuSunrise,
    LuSparkles,
    LuCamera,
    LuMountain,
    LuWaves,
    LuGlobe,
    LuBadgeCheck,
    LuFlame,
    LuTag,
    LuPackage,
    LuSend,
    LuGem,
} from 'react-icons/lu';
import { FaQuoteLeft } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { db } from '../../firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────
   SOUVENIR CATALOGUE
   Each item = one slider card
────────────────────────────────────────────── */
const SOUVENIRS = [
    {
        id: 1,
        name: 'MoroVista Mosaic Tea Mug',
        category: 'Mugs & Céramique',
        origin: 'Maroc',
        price: 149,
        badge: 'Édition Limitée',
        description: 'Mug en céramique orné de motifs zellige traditionnels marocains — bleu, rouge et turquoise — livré dans son écrin MoroVista. Idéal pour savourer un thé à la menthe avec l\'élégance des artisans du Maroc.',
        image: '/img1.jpeg',
        tag: 'Mugs & Artisanat',
    },
    {
        id: 2,
        name: 'Porte-Clés MoroVista',
        category: 'Accessoires',
        origin: 'Maroc',
        price: 79,
        badge: 'Bestseller',
        description: 'Porte-clés en métal émaillé aux couleurs du Maroc : palmiers, pin de localisation rouge et montagnes enneigées avec l\'inscription MOROVISTA. Un souvenir solide et élégant à emporter partout.',
        image: '/img2.jpeg',
        tag: 'Porte-Clés & Bijoux',
    },
    {
        id: 3,
        name: 'Mystery Box — MoroVista',
        category: 'Coffrets Cadeaux',
        origin: 'Maroc',
        price: 399,
        badge: 'Surprise !',
        description: 'Une boîte mystère de luxe ornée de motifs arabesques dorés découpés à la main. À l\'intérieur : une sélection surprise d\'artisanat authentique marocain choisi par nos artisans. Idéal comme cadeau.',
        image: '/img3.jpeg',
        tag: 'Coffrets & Cadeaux',
    },
    {
        id: 4,
        name: '"Go To Morocco" Mug',
        category: 'Mugs Humour',
        origin: 'Maroc',
        price: 99,
        badge: 'Fun & Voyage',
        description: '"I Don\'t Need Therapy, I Just Need To Go To Morocco" — le mug parfait pour tout voyageur amoureux du Maroc. Un cadeau original et drôle avec le logo MoroVista.',
        image: '/img4.jpeg',
        tag: 'Mugs & Humour',
    },
];

export default function SiteComments() {
    const { t, i18n } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animateKey, setAnimateKey] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [inquiryName, setInquiryName] = useState('');
    const [inquiryMsg, setInquiryMsg] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [toast, setToast] = useState(null); // { name: string }
    const [souvenirsList, setSouvenirsList] = useState(SOUVENIRS);
    const sectionRef = useRef(null);
    const modalRef = useRef(null);

    const isAr = i18n.language === 'ar';
    const isEn = i18n.language === 'en';

    const titleHeadline    = isAr ? 'إبعث المغرب معك.' : isEn ? 'Bring Morocco home.' : 'Ramenez le Maroc chez vous.';
    const subtitleHeadline = isAr ? 'تذكارات أصيلة.' : isEn ? 'Authentic souvenirs.' : 'Souvenirs authentiques.';
    const badgeLabel       = isAr ? 'الأكثر مبيعاً' : isEn ? 'Top Pick' : 'Coup de cœur';
    const originLabel      = isAr ? 'المنشأ' : isEn ? 'ORIGIN' : 'PROVENANCE';
    const priceLabel       = isAr ? 'السعر' : isEn ? 'PRICE' : 'PRIX';

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'souvenirs'), (snapshot) => {
            const dbSouvenirs = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name || '',
                    category: data.category || '',
                    origin: data.origin || '',
                    price: Number(data.price) || 0,
                    badge: data.badge || '',
                    description: data.description || '',
                    image: data.image || '',
                    tag: data.tag || '',
                };
            });
            if (dbSouvenirs.length > 0) {
                setSouvenirsList(dbSouvenirs);
            } else {
                setSouvenirsList(SOUVENIRS);
            }
        }, (error) => {
            console.error("Error listening to souvenirs:", error);
            setSouvenirsList(SOUVENIRS);
        });

        return () => unsubscribe();
    }, []);

    // Lock body scroll when modal open
    useEffect(() => {
        document.body.style.overflow = showModal ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [showModal]);

    // Animate modal entrance
    useEffect(() => {
        if (showModal && modalRef.current) {
            gsap.fromTo(
                modalRef.current,
                { opacity: 0, scale: 0.92, y: 24 },
                { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out' }
            );
        }
    }, [showModal]);

    useLayoutEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from('.sv-section-header', {
                y: 30, opacity: 0, duration: 0.8, ease: 'power2.out',
                scrollTrigger: { trigger: '.sv-section-header', start: 'top 90%', once: true }
            });
            gsap.from('.sv-product-card', {
                y: 42, opacity: 0, duration: 0.95, ease: 'power3.out',
                scrollTrigger: { trigger: '.sv-showcase-container', start: 'top 86%', once: true }
            });
        }, sectionRef.current);
        return () => ctx.revert();
    }, []);

    const handlePrev = () => {
        setAnimateKey(p => p + 1);
        setCurrentIndex(p => (p === 0 ? souvenirsList.length - 1 : p - 1));
    };
    const handleNext = () => {
        setAnimateKey(p => p + 1);
        setCurrentIndex(p => (p === souvenirsList.length - 1 ? 0 : p + 1));
    };

    const closeModal = () => {
        if (modalRef.current) {
            gsap.to(modalRef.current, {
                opacity: 0, scale: 0.93, y: 16, duration: 0.25, ease: 'power2.in',
                onComplete: () => { setShowModal(false); }
            });
        } else {
            setShowModal(false);
        }
    };

    const handleInquiry = async (e) => {
        e.preventDefault();
        if (!inquiryName.trim() || !inquiryMsg.trim()) return;
        const senderName = inquiryName.trim();
        setIsSending(true);
        await new Promise(r => setTimeout(r, 1200)); // simulate send
        setIsSending(false);
        setInquiryName('');
        setInquiryMsg('');
        // Close modal immediately, show toast outside
        setShowModal(false);
        setToast({ name: senderName });
        setTimeout(() => setToast(null), 6000);
    };

    const item = souvenirsList[currentIndex] || souvenirsList[0] || SOUVENIRS[0];

    return (
        <>
            {/* ══════════ TOP TICKER ══════════ */}
            <div className="rv-ticker-wrap" aria-hidden="true">
                <div className="rv-ticker-track">
                    {[0, 1].map((copy) => (
                        <div className="rv-ticker-inner" key={copy}>
                            <span className="rv-ticker-item"><LuGem className="rv-tick-icon" />{isAr ? 'تذكارات أصيلة' : isEn ? 'Authentic Moroccan Crafts' : 'Artisanat Marocain Authentique'}</span>
                            <span className="rv-ticker-sep"><FaStar color="#d97706" size={10} /></span>
                            <span className="rv-ticker-item"><LuHeart className="rv-tick-icon rv-tick-icon--red" />{isAr ? 'مصنوع يدوياً' : isEn ? 'Handmade with Love' : 'Fait Main avec Amour'}</span>
                            <span className="rv-ticker-sep"><FaStar color="#d97706" size={10} /></span>
                            <span className="rv-ticker-item"><LuMapPin className="rv-tick-icon" />{isAr ? 'من قلب المغرب' : isEn ? 'Straight from the Medina' : 'Depuis la Médina'}</span>
                            <span className="rv-ticker-sep"><FaStar color="#d97706" size={10} /></span>
                            <span className="rv-ticker-item"><LuSunrise className="rv-tick-icon" />{isAr ? 'حرفيون أمازيغيون' : isEn ? 'Amazigh Artisans' : 'Artisans Amazighs'}</span>
                            <span className="rv-ticker-sep"><FaStar color="#d97706" size={10} /></span>
                            <span className="rv-ticker-item"><LuSparkles className="rv-tick-icon rv-tick-icon--gold" />{isAr ? 'هدايا لا تُنسى' : isEn ? 'Gifts They Will Never Forget' : 'Cadeaux Inoubliables'}</span>
                            <span className="rv-ticker-sep"><FaStar color="#d97706" size={10} /></span>
                            <span className="rv-ticker-item"><LuCompass className="rv-tick-icon" />{isAr ? 'قطع فريدة' : isEn ? 'One-of-a-Kind Pieces' : 'Pièces Uniques'}</span>
                            <span className="rv-ticker-sep"><FaStar color="#d97706" size={10} /></span>
                            <span className="rv-ticker-item"><LuTag className="rv-tick-icon rv-tick-icon--red" />{isAr ? 'أسعار المدينة' : isEn ? 'Souk Prices · No Bargaining Needed' : 'Prix Souk · Sans Marchandage'}</span>
                            <span className="rv-ticker-sep"><FaStar color="#d97706" size={10} /></span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ══════════ MAIN SOUVENIRS SECTION ══════════ */}
            <section className={`sv-showcase-section ${isAr ? 'rtl' : ''}`} id="souvenirs" ref={sectionRef}>
                
                {/* Section Header */}
                <div className="sv-section-header">
                    <span className="sv-header-eyebrow">
                        {isAr ? 'موروڤيستا أرتيزانا' : isEn ? 'MoroVista Boutique' : 'Artisanat MoroVista'}
                    </span>
                    <h2 className="sv-header-title">{titleHeadline}</h2>
                    <p className="sv-header-subtitle">{subtitleHeadline}</p>
                    <div className="sv-header-line"></div>
                </div>

                <div className="sv-showcase-container">
                    <div className="sv-product-card" key={animateKey}>

                        {/* Left — Product Image Area */}
                        <div className="sv-image-col">
                            <div className="sv-image-wrapper">
                                <img src={item.image} alt={item.name} loading="lazy" />
                                
                                {/* Luxury Category Tag */}
                                <div className="sv-category-tag">
                                    <LuPackage size={12} />
                                    <span>{item.tag}</span>
                                </div>
                                
                                {/* Luxury Price Tag */}
                                <div className="sv-price-tag">
                                    <span className="sv-price-val">{item.price}</span>
                                    <span className="sv-price-curr">MAD</span>
                                </div>
                            </div>
                        </div>

                        {/* Right — Product Info / Specs Area */}
                        <div className="sv-details-col">
                            
                            {/* Product Header (Name + Badge) */}
                            <div className="sv-product-header">
                                <h3 className="sv-product-title">{item.name}</h3>
                                {item.badge && (
                                    <span className="sv-product-badge">{item.badge}</span>
                                )}
                            </div>

                            {/* Product Story/Description */}
                            <p className="sv-product-desc">"{item.description}"</p>

                            {/* Product Specifications Grid */}
                            <div className="sv-specs-grid">
                                <div className="sv-spec-item">
                                    <span className="sv-spec-label">
                                        {isAr ? 'المنشأ' : isEn ? 'Origin' : 'Provenance'}
                                    </span>
                                    <span className="sv-spec-value">
                                        <LuMapPin size={12} className="sv-spec-icon" />
                                        {item.origin}
                                    </span>
                                </div>
                                <div className="sv-spec-item">
                                    <span className="sv-spec-label">
                                        {isAr ? 'الصنف' : isEn ? 'Category' : 'Catégorie'}
                                    </span>
                                    <span className="sv-spec-value">
                                        <LuGem size={12} className="sv-spec-icon" />
                                        {item.category}
                                    </span>
                                </div>
                                <div className="sv-spec-item">
                                    <span className="sv-spec-label">
                                        {isAr ? 'الصناعة' : isEn ? 'Craft' : 'Fabrication'}
                                    </span>
                                    <span className="sv-spec-value">
                                        <LuSparkles size={12} className="sv-spec-icon" />
                                        {isAr ? 'صناعة يدوية 100%' : isEn ? '100% Handmade' : '100% Fait Main'}
                                    </span>
                                </div>
                                <div className="sv-spec-item">
                                    <span className="sv-spec-label">
                                        {isAr ? 'الضمان' : isEn ? 'Authenticity' : 'Authenticité'}
                                    </span>
                                    <span className="sv-spec-value">
                                        <LuBadgeCheck size={12} className="sv-spec-icon sv-spec-icon--green" />
                                        {isAr ? 'أصلي معتمد' : isEn ? 'Certified Authentic' : 'Certifié Authentique'}
                                    </span>
                                </div>
                            </div>

                            {/* Divider Line */}
                            <div className="sv-details-divider"></div>

                            {/* Actions & Navigation Controls */}
                            <div className="sv-actions-row">
                                <button className="sv-buy-button" onClick={() => setShowModal(true)}>
                                    <LuShoppingBag size={18} />
                                    <span>{isAr ? 'طلب أو استفسار' : isEn ? 'Order or Inquire' : 'Commander ou Renseigner'}</span>
                                </button>
                                
                                <div className="sv-nav-controls">
                                    <button className="sv-arrow-btn" onClick={handlePrev} aria-label="Previous item">
                                        <LuChevronLeft size={18} />
                                    </button>
                                    
                                    {/* Mini pagination dots inside navigation */}
                                    <div className="sv-mini-dots">
                                        {souvenirsList.map((_, i) => (
                                            <span 
                                                key={i} 
                                                className={`sv-mini-dot ${i === currentIndex ? 'active' : ''}`}
                                                onClick={() => { setAnimateKey(p => p + 1); setCurrentIndex(i); }}
                                            />
                                        ))}
                                    </div>

                                    <button className="sv-arrow-btn" onClick={handleNext} aria-label="Next item">
                                        <LuChevronRight size={18} />
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </section>

            {/* ══════════ BOTTOM TICKER ══════════ */}
            <div className="rv-ticker-wrap rv-ticker-wrap--bottom" aria-hidden="true">
                <div className="rv-ticker-track rv-ticker-track--reverse">
                    {[0, 1].map((copy) => (
                        <div className="rv-ticker-inner" key={copy}>
                            <span className="rv-ticker-item"><LuCamera className="rv-tick-icon rv-tick-icon--amber" />{isAr ? 'صور لا تُنسى' : isEn ? 'Capture Every Moment' : 'Chaque Instant Capturé'}</span>
                            <span className="rv-ticker-sep"><FaStar color="#2d6a4f" size={10} /></span>
                            <span className="rv-ticker-item"><LuMountain className="rv-tick-icon rv-tick-icon--amber" />{isAr ? 'جبال الأطلس' : isEn ? 'Atlas Mountain Crafts' : 'Artisanat de l\'Atlas'}</span>
                            <span className="rv-ticker-sep"><FaStar color="#2d6a4f" size={10} /></span>
                            <span className="rv-ticker-item"><LuWaves className="rv-tick-icon rv-tick-icon--amber" />{isAr ? 'زيت أركان طبيعي' : isEn ? 'Natural Argan Beauty' : 'Beauté Argan Naturelle'}</span>
                            <span className="rv-ticker-sep"><FaStar color="#2d6a4f" size={10} /></span>
                            <span className="rv-ticker-item"><LuGlobe className="rv-tick-icon rv-tick-icon--amber" />{isAr ? 'شحن دولي' : isEn ? 'Worldwide Shipping Available' : 'Livraison Internationale'}</span>
                            <span className="rv-ticker-sep"><FaStar color="#2d6a4f" size={10} /></span>
                            <span className="rv-ticker-item"><LuBadgeCheck className="rv-tick-icon rv-tick-icon--amber" />{isAr ? 'ضمان الجودة' : isEn ? 'Quality Guaranteed' : 'Qualité Garantie'}</span>
                            <span className="rv-ticker-sep"><FaStar color="#2d6a4f" size={10} /></span>
                            <span className="rv-ticker-item"><LuFlame className="rv-tick-icon rv-tick-icon--amber" />{isAr ? 'روائح الصحراء' : isEn ? 'Sahara Scents & Spices' : 'Épices & Parfums Sahara'}</span>
                            <span className="rv-ticker-sep"><FaStar color="#2d6a4f" size={10} /></span>
                            <span className="rv-ticker-item"><LuCamera className="rv-tick-icon rv-tick-icon--amber" />{isAr ? 'ألوان المدينة' : isEn ? 'Medina Colours & Zellige' : 'Couleurs & Zellige'}</span>
                            <span className="rv-ticker-sep"><FaStar color="#2d6a4f" size={10} /></span>
                            <span className="rv-ticker-item"><LuGem className="rv-tick-icon rv-tick-icon--amber" />{isAr ? 'ذهب عائلي' : isEn ? 'Heirloom Pieces' : 'Pièces de Collection'}</span>
                            <span className="rv-ticker-sep"><FaStar color="#2d6a4f" size={10} /></span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ══════════ INQUIRY MODAL ══════════ */}
            {showModal && (
                <div className="review-modal-backdrop" onClick={(e) => e.target === e.currentTarget && closeModal()}>
                    <div className="review-modal" ref={modalRef}>

                        {/* Modal header */}
                        <div className="review-modal-header">
                            <div>
                                <span className="review-modal-eyebrow">MoroVista Boutique</span>
                                <h3 className="review-modal-title">
                                    {isAr ? 'اطلب أو استفسر الآن' : isEn ? `Order — ${item.name}` : `Commander — ${item.name}`}
                                </h3>
                            </div>
                            <button className="review-modal-close" onClick={closeModal} aria-label="Fermer">
                                <LuX />
                            </button>
                        </div>

                        <form onSubmit={handleInquiry} className="review-modal-form">
                                {/* Product recap */}
                                <div className="sv-modal-product-recap">
                                    <img src={item.image} alt={item.name} className="sv-recap-img" />
                                    <div className="sv-recap-info">
                                        <strong>{item.name}</strong>
                                        <span><LuMapPin size={11} /> {item.origin}</span>
                                        <span className="sv-recap-price">{item.price} MAD</span>
                                    </div>
                                </div>

                                <div className="rmf-row">
                                    <div className="rmf-group">
                                        <label>{isAr ? 'اسمك' : isEn ? 'Your Name' : 'Votre Nom'} <span>*</span></label>
                                        <input
                                            type="text"
                                            placeholder={isEn ? 'Ex: Sophie D.' : 'Ex: Mohammed A.'}
                                            value={inquiryName}
                                            onChange={e => setInquiryName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="rmf-group">
                                        <label>{isAr ? 'المنتج المطلوب' : isEn ? 'Product' : 'Produit'}</label>
                                        <input type="text" value={item.name} readOnly />
                                    </div>
                                </div>

                                <div className="rmf-group rmf-group--full">
                                    <label>{isAr ? 'رسالتك' : isEn ? 'Your Message' : 'Votre message'} <span>*</span></label>
                                    <textarea
                                        placeholder={isEn ? 'Quantity, delivery city, any questions...' : 'Quantité, ville de livraison, vos questions...'}
                                        value={inquiryMsg}
                                        onChange={e => setInquiryMsg(e.target.value)}
                                        required
                                        rows={4}
                                    />
                                </div>

                                <div className="review-modal-footer">
                                    <div className="rmf-stars">
                                        <span>
                                            <LuPackage size={14} style={{ marginRight: 6, color: '#c0241a' }} />
                                            {isAr ? 'مواد طبيعية 100%' : isEn ? '100% Natural Materials' : '100% Matières Naturelles'}
                                        </span>
                                    </div>
                                    <button type="submit" className="rmf-submit" disabled={isSending}>
                                        {isSending
                                            ? <span className="rmf-spinner" />
                                            : <><LuSend /> {isAr ? 'إرسال الطلب' : isEn ? 'Send Request' : 'Envoyer la demande'}</>
                                        }
                                    </button>
                                </div>
                            </form>
                    </div>
                </div>
            )}

            {/* ══════════ ORDER SUCCESS TOAST ══════════ */}
            {toast && (
                <div className="sv-toast" role="alert" aria-live="polite">
                    <div className="sv-toast-icon">✓</div>
                    <div className="sv-toast-body">
                        <strong className="sv-toast-title">
                            {isAr ? `شكراً، ${toast.name}!` : isEn ? `Thank you, ${toast.name}!` : `Merci, ${toast.name} !`}
                        </strong>
                        <span className="sv-toast-msg">
                            {isAr
                                ? 'تم إرسال طلبك بنجاح. سيتواصل معك فريق الدعم قريباً.'
                                : isEn
                                ? 'Your order has been sent! Our support team will contact you shortly.'
                                : 'Votre commande a bien été envoyée ! Notre équipe support vous contactera bientôt.'}
                        </span>
                    </div>
                    <button className="sv-toast-close" onClick={() => setToast(null)} aria-label="Fermer">
                        <LuX size={14} />
                    </button>
                </div>
            )}
        </>
    );
}
