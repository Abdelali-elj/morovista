import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LuMapPin, LuCalendarDays, LuWallet, LuSparkles, LuHotel,
    LuUtensils, LuBus, LuLandmark, LuMountain, LuZap,
    LuChevronDown, LuCircleCheck, LuSun, LuSunset, LuMoon,
    LuPrinter, LuRefreshCw, LuClock,
    LuTrendingUp, LuArrowRight, LuArrowLeft, LuStar, LuCheck, LuMap, LuCompass, LuCloudSun
} from 'react-icons/lu';
import api from '../../api';
import './../../css/myplan.css';
import PlannerMap from './PlannerMap';

// ─── Budget allocation weights per category ─────────────────────────────────
const CATEGORY_WEIGHTS = {
    hotels:      { label: 'Hébergement',  icon: LuHotel,    color: '#6366f1', weight: 0.38 },
    restaurants: { label: 'Restauration', icon: LuUtensils, color: '#f59e0b', weight: 0.22 },
    transport:   { label: 'Transport',    icon: LuBus,      color: '#3b82f6', weight: 0.12 },
    activities:  { label: 'Activités',    icon: LuZap,      color: '#10b981', weight: 0.14 },
    monuments:   { label: 'Monuments',    icon: LuLandmark, color: '#ec4899', weight: 0.09 },
    places:      { label: 'Lieux / Sites',icon: LuMountain, color: '#f97316', weight: 0.05 },
};

// ─── Vibe weight profiles ───────────────────────────────────────────────────
const VIBE_WEIGHTS = {
    cultural: {
        hotels: 0.30, restaurants: 0.15, activities: 0.10, transport: 0.10, monuments: 0.22, places: 0.13
    },
    luxury: {
        hotels: 0.46, restaurants: 0.24, activities: 0.14, transport: 0.10, monuments: 0.03, places: 0.03
    },
    adventure: {
        hotels: 0.22, restaurants: 0.12, activities: 0.36, transport: 0.12, monuments: 0.06, places: 0.12
    },
    foodie: {
        hotels: 0.26, restaurants: 0.44, activities: 0.12, transport: 0.10, monuments: 0.04, places: 0.04
    }
};

// ─── High-Fidelity Moroccan Cities Data with Map Coordinates & Alternatives ───
const CITY_DATA = {
    'Marrakech': {
        image: '/images/marrakech.png',
        tagline: 'La perle du Sud, entre souks animés, palais majestueux et riads d\'exception.',
        hotels: {
            eco: [
                { label: 'Hostel Riad Marrakech Rouge', desc: 'Auberge colorée et conviviale près de Jemaa el-Fna.', cost: 160, rating: 4.6, img: 'https://images.unsplash.com/photo-1590519542036-c47de6196ba5?q=80&w=400&auto=format&fit=crop', x: 42, y: 42 },
                { label: 'Riad Verus Budget', desc: 'Riad traditionnel authentique et très abordable.', cost: 230, rating: 4.4, img: 'https://images.unsplash.com/photo-1580002519538-4b05a76e2737?q=80&w=400&auto=format&fit=crop', x: 38, y: 48 },
                { label: 'Riad Diana Cozy', desc: 'Un petit riad paisible et chaleureux au sud de la médina.', cost: 210, rating: 4.5, img: 'https://images.unsplash.com/photo-1548685913-fe6574340a49?q=80&w=400&auto=format&fit=crop', x: 45, y: 62 }
            ],
            medium: [
                { label: 'Riad Jardin Secret Medina', desc: 'Un havre de paix bohème chic au cœur de la Médina ancienne.', cost: 680, rating: 4.8, img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=400&auto=format&fit=crop', x: 35, y: 25 },
                { label: 'Hotel Atlas Asni Spa', desc: 'Hôtel moderne avec grande piscine dans le quartier de l\'Hivernage.', cost: 620, rating: 4.3, img: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=400&auto=format&fit=crop', x: 18, y: 60 },
                { label: 'Riad Al Rimal Medina', desc: 'Riad d\'exception doté d\'une magnifique terrasse jacuzzi face à la Koutoubia.', cost: 750, rating: 4.7, img: 'https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?q=80&w=400&auto=format&fit=crop', x: 28, y: 38 }
            ],
            premium: [
                { label: 'La Mamounia Palace Hotel', desc: 'L\'un des plus célèbres palaces du monde, luxe impérial et jardins mythiques.', cost: 4200, rating: 4.9, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=400&auto=format&fit=crop', x: 15, y: 55 },
                { label: 'Royal Mansour Marrakech', desc: 'Le summum du luxe absolu, riads privés d\'exception avec service majordome.', cost: 8900, rating: 5.0, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop', x: 22, y: 48 },
                { label: 'Amanjena Luxury Resort', desc: 'Une oasis inspirée du style andalou en bordure de la Palmeraie.', cost: 9500, rating: 4.9, img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400&auto=format&fit=crop', x: 88, y: 25 }
            ]
        },
        restaurants: {
            eco: [
                { label: 'Chez Lamine Mechoui', desc: 'Le meilleur méchoui traditionnel cuit au four d\'argile de la Médina.', cost: 65, rating: 4.7, img: 'https://images.unsplash.com/photo-1585938338392-50a312222527?q=80&w=400&auto=format&fit=crop', x: 39, y: 32 },
                { label: 'Café Clock Marrakech', desc: 'Café culturel célèbre pour son burger de chameau et ses contes.', cost: 90, rating: 4.5, img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=400&auto=format&fit=crop', x: 44, y: 30 },
                { label: 'Naranj Lebanese & Grill', desc: 'Spécialités levantines et brochettes authentiques savoureuses.', cost: 85, rating: 4.6, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop', x: 41, y: 45 }
            ],
            medium: [
                { label: 'Nomad Marrakech Rooftop', desc: 'Cuisine marocaine moderne revisitée sur une terrasse panoramique animée.', cost: 190, rating: 4.6, img: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=400&auto=format&fit=crop', x: 44, y: 28 },
                { label: 'Le Jardin Secret Bistro', desc: 'Un magnifique oasis de verdure du XVIIe siècle servant des plats locaux.', cost: 230, rating: 4.7, img: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=400&auto=format&fit=crop', x: 35, y: 22 },
                { label: 'Terrasse des Épices', desc: 'Rooftop branché servant des grillades et des desserts raffinés au chocolat.', cost: 260, rating: 4.7, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&auto=format&fit=crop', x: 37, y: 20 }
            ],
            premium: [
                { label: 'Dar Moha', desc: 'Gastronomie marocaine de haute volée servie au bord d\'un patio sublime.', cost: 580, rating: 4.9, img: 'https://images.unsplash.com/photo-1590519542036-c47de6196ba5?q=80&w=400&auto=format&fit=crop', x: 30, y: 22 },
                { label: 'La Grande Table Marocaine', desc: 'Le restaurant gastronomique phare du Royal Mansour, mets d\'exception.', cost: 1100, rating: 4.9, img: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop', x: 13, y: 58 },
                { label: 'Al Fassia Gueliz', desc: 'Restaurant gastronomique tenu exclusivement par des femmes, pastillas uniques.', cost: 520, rating: 4.8, img: 'https://images.unsplash.com/photo-1511910849309-0dcdb83958a6?q=80&w=400&auto=format&fit=crop', x: 10, y: 45 }
            ]
        },
        monuments: {
            eco: [
                { label: 'Mosquée Koutoubia', desc: 'Le minaret emblématique de Marrakech, chef-d\'œuvre almohade.', cost: 0, rating: 4.7, img: 'https://images.unsplash.com/photo-1597212618440-806262de4ee6?q=80&w=400&auto=format&fit=crop', x: 25, y: 40 },
                { label: 'Place Jemaa el-Fna', desc: 'Spectacle vivant à ciel ouvert avec charmeurs de serpents et conteurs.', cost: 0, rating: 4.8, img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400&auto=format&fit=crop', x: 38, y: 35 }
            ],
            medium: [
                { label: 'Palais Bahia', desc: 'Palais du XIXe siècle avec de superbes plafonds peints et patios fleuris.', cost: 70, rating: 4.6, img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=400&auto=format&fit=crop', x: 55, y: 65 },
                { label: 'Jardin Majorelle & Musée', desc: 'Jardin botanique bleu cobalt créé par le peintre Jacques Majorelle.', cost: 150, rating: 4.8, img: 'https://images.unsplash.com/photo-1619542402915-dcaf30e4e2a1?q=80&w=400&auto=format&fit=crop', x: 20, y: 15 },
                { label: 'Médersa Ben Youssef', desc: 'Joyau d\'art arabo-andalou, plus grande école coranique du Maroc.', cost: 70, rating: 4.8, img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400&auto=format&fit=crop', x: 38, y: 22 }
            ],
            premium: [
                { label: 'Palais Badi & Tombeaux Saadiens', desc: 'Ruines grandioses de l\'âge d\'or saadien avec audioguide VIP.', cost: 180, rating: 4.5, img: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=400&auto=format&fit=crop', x: 50, y: 75 },
                { label: 'Musée Yves Saint Laurent', desc: 'Visite guidée exclusive du musée célébrant le couturier légendaire.', cost: 250, rating: 4.8, img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400&auto=format&fit=crop', x: 18, y: 10 }
            ]
        },
        activities: {
            eco: [
                { label: 'Shopping dans les Souks', desc: 'Négociation animée dans les ruelles colorées de la Médina.', cost: 30, rating: 4.5, img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400&auto=format&fit=crop', x: 40, y: 28 },
                { label: 'Balade en Calèche Traditionnelle', desc: 'Visite panoramique des remparts de la ville au coucher du soleil.', cost: 120, rating: 4.3, img: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=400&auto=format&fit=crop', x: 35, y: 50 }
            ],
            medium: [
                { label: 'Hammam Traditionnel & Massage', desc: 'Soin corporel complet au savon noir et gommage à l\'eucalyptus.', cost: 350, rating: 4.7, img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400&auto=format&fit=crop', x: 28, y: 33 },
                { label: 'Cours de Cuisine et Tajine', desc: 'Apprenez à mijoter des tajines marocains avec des épices du marché.', cost: 450, rating: 4.9, img: 'https://images.unsplash.com/photo-1507048680080-6d07d72c56f1?q=80&w=400&auto=format&fit=crop', x: 48, y: 45 },
                { label: 'Balade à dos de Chameau', desc: 'Randonnée chamelière au milieu des palmiers centenaires de la Palmeraie.', cost: 250, rating: 4.5, img: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=400&auto=format&fit=crop', x: 80, y: 15 }
            ],
            premium: [
                { label: 'Survol en Montgolfière VIP', desc: 'Vol privé au lever du soleil sur l\'Atlas suivi d\'un petit-déjeuner sous tente caïdale.', cost: 2200, rating: 4.9, img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=400&auto=format&fit=crop', x: 75, y: 15 },
                { label: 'Quad Express Désert d\'Agafay', desc: 'Sensations fortes en quad à travers les collines rocheuses d\'Agafay.', cost: 750, rating: 4.8, img: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=400&auto=format&fit=crop', x: 80, y: 80 }
            ]
        },
        places: {
            eco: [
                { label: 'La Palmeraie de Marrakech', desc: 'Vaste palmeraie historique, idéale pour marcher au calme.', cost: 0, rating: 4.1, img: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?q=80&w=400&auto=format&fit=crop', x: 85, y: 10 }
            ],
            medium: [
                { label: 'Jardins de la Ménara', desc: 'Grand bassin d\'irrigation flanqué d\'un pavillon face à l\'Atlas enneigé.', cost: 20, rating: 4.2, img: 'https://images.unsplash.com/photo-1509060464153-44667396260f?q=80&w=400&auto=format&fit=crop', x: 10, y: 80 }
            ],
            premium: [
                { label: 'Jardin Anima André Heller', desc: 'Un parc d\'art contemporain magique avec sculptures exotiques hors de la ville.', cost: 150, rating: 4.8, img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop', x: 90, y: 95 }
            ]
        },
        transport: {
            eco: [
                { label: 'Petits Taxis Rouges de Ville', desc: 'Taxis locaux avec compteur, parfaits pour la Médina.', cost: 25, rating: 4.2, img: 'https://images.unsplash.com/photo-1580824453163-5f04b14ea1ab?q=80&w=400&auto=format&fit=crop', x: 50, y: 50 }
            ],
            medium: [
                { label: 'Grand Taxi Navette Privée', desc: 'Transfert climatisé pour les longs déplacements.', cost: 120, rating: 4.6, img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400&auto=format&fit=crop', x: 50, y: 50 }
            ],
            premium: [
                { label: 'Location Chauffeur Berline Privée', desc: 'Voiture haut de gamme avec chauffeur à votre entière disposition.', cost: 950, rating: 4.9, img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=400&auto=format&fit=crop', x: 50, y: 50 }
            ]
        }
    },
    'Fès': {
        image: '/images/fes.png',
        tagline: 'Capitale spirituelle, gardienne de la plus ancienne médina piétonne du monde.',
        hotels: {
            eco: [
                { label: 'Riad Dar Bensouda Budget', desc: 'Charme traditionnel authentique au cœur du quartier historique.', cost: 280, rating: 4.5, img: 'https://images.unsplash.com/photo-1590519542036-c47de6196ba5?q=80&w=400&auto=format&fit=crop', x: 45, y: 40 },
                { label: 'Riad Boustan Eco', desc: 'Décoration fassie somptueuse et service chaleureux à petit prix.', cost: 260, rating: 4.4, img: 'https://images.unsplash.com/photo-1580002519538-4b05a76e2737?q=80&w=400&auto=format&fit=crop', x: 48, y: 35 }
            ],
            medium: [
                { label: 'Riad Fès Relais & Châteaux', desc: 'Alliance magique entre architecture andalouse et design contemporain.', cost: 1200, rating: 4.9, img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=400&auto=format&fit=crop', x: 38, y: 48 },
                { label: 'Riad Karawan Riad', desc: 'Riad chic réaménagé en suites d\'exception dans un quartier calme.', cost: 1100, rating: 4.8, img: 'https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?q=80&w=400&auto=format&fit=crop', x: 50, y: 52 }
            ],
            premium: [
                { label: 'Palais Faraj Suites & Spa', desc: 'Un palais dominant la médina de Fès, vue à 360° et luxe exclusif.', cost: 2500, rating: 4.9, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=400&auto=format&fit=crop', x: 22, y: 68 },
                { label: 'Hotel Sahrai Boutique', desc: 'Hôtel contemporain avec piscine à débordement dominant Fès el-Bali.', cost: 2200, rating: 4.9, img: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=400&auto=format&fit=crop', x: 18, y: 70 }
            ]
        },
        restaurants: {
            eco: [
                { label: 'Cafe Clock Fes', desc: 'Lieu de rencontre branché et culturel connu pour ses spécialités marocaines.', cost: 75, rating: 4.6, img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=400&auto=format&fit=crop', x: 42, y: 38 },
                { label: 'Chez Hakim Médina', desc: 'Tajines familiaux excellents à quelques pas de la porte Bleue.', cost: 60, rating: 4.5, img: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=400&auto=format&fit=crop', x: 30, y: 40 }
            ],
            medium: [
                { label: 'Restaurant The Ruined Garden', desc: 'Mangez dans les ruines romantiques d\'un jardin secret fleuri.', cost: 210, rating: 4.7, img: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=400&auto=format&fit=crop', x: 55, y: 45 },
                { label: 'Dar Roumana Restaurant', desc: 'Cuisine méditerranéenne raffinée servie dans un superbe riad classique.', cost: 290, rating: 4.8, img: 'https://images.unsplash.com/photo-1590519542036-c47de6196ba5?q=80&w=400&auto=format&fit=crop', x: 35, y: 30 }
            ],
            premium: [
                { label: 'L\'Amandier Palais Faraj', desc: 'Cuisine fassie d\'excellence préparée par des cuisinières traditionnelles.', cost: 680, rating: 4.9, img: 'https://images.unsplash.com/photo-1592861956120-e524fc739696?q=80&w=400&auto=format&fit=crop', x: 22, y: 65 }
            ]
        },
        monuments: {
            eco: [
                { label: 'Médersa Bou Inania', desc: 'Université coranique légendaire aux boiseries sculptées.', cost: 70, rating: 4.7, img: 'https://images.unsplash.com/photo-1548685913-fe6574340a49?q=80&w=400&auto=format&fit=crop', x: 33, y: 42 }
            ],
            medium: [
                { label: 'Tannerie Chouara Historique', desc: 'Les célèbres cuves de teinture traditionnelles vieilles de 1000 ans.', cost: 50, rating: 4.6, img: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=400&auto=format&fit=crop', x: 62, y: 35 },
                { label: 'Al-Attarine Madrasa', desc: 'Madrasa historique fassie dotée d\'une ornementation andalouse extraordinaire.', cost: 70, rating: 4.8, img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400&auto=format&fit=crop', x: 50, y: 32 }
            ],
            premium: [
                { label: 'Palais Royal Fes (Bab Dekkaken)', desc: 'Portes en bronze monumentales et visite des secrets du mellah avec guide agréé.', cost: 180, rating: 4.8, img: 'https://images.unsplash.com/photo-1597212618440-806262de4ee6?q=80&w=400&auto=format&fit=crop', x: 15, y: 55 }
            ]
        },
        activities: {
            eco: [
                { label: 'Déambulation Fès El-Bali', desc: 'S\'égarer volontairement dans les 9000 ruelles labyrinthiques.', cost: 0, rating: 4.8, img: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=400&auto=format&fit=crop', x: 45, y: 45 }
            ],
            medium: [
                { label: 'Atelier Artisanat Poterie & Zellige', desc: 'Façonnez votre propre argile sous l\'œil bienveillant d\'un Maître Maâlem.', cost: 350, rating: 4.8, img: 'https://images.unsplash.com/photo-1507048680080-6d07d72c56f1?q=80&w=400&auto=format&fit=crop', x: 75, y: 60 }
            ],
            premium: [
                { label: 'Soin Hammam Impérial au Riad Fès', desc: 'Robe de gommage haut de gamme à l\'argan et massage relaxant.', cost: 850, rating: 4.9, img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400&auto=format&fit=crop', x: 38, y: 45 }
            ]
        },
        places: {
            eco: [
                { label: 'Porte Bleue Bab Boujeloud', desc: 'La porte d\'entrée majestueuse de la médina ornée de faïences bleues.', cost: 0, rating: 4.8, img: 'https://images.unsplash.com/photo-1548685913-fe6574340a49?q=80&w=400&auto=format&fit=crop', x: 28, y: 40 }
            ],
            medium: [
                { label: 'Mérinides de Fès (Panorama)', desc: 'Ruines offrant une vue plongeante époustouflante sur la médina au crépuscule.', cost: 30, rating: 4.6, img: 'https://images.unsplash.com/photo-1509060464153-44667396260f?q=80&w=400&auto=format&fit=crop', x: 45, y: 15 }
            ],
            premium: [
                { label: 'Jardin Jnan Sbil Privatisé', desc: 'Visite exclusive du plus ancien jardin public de la ville.', cost: 150, rating: 4.7, img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop', x: 20, y: 48 }
            ]
        },
        transport: {
            eco: [
                { label: 'Petits Taxis Rouges', desc: 'Taxis pour circuler rapidement d\'un point à un autre.', cost: 20, rating: 4.0, img: 'https://images.unsplash.com/photo-1580824453163-5f04b14ea1ab?q=80&w=400&auto=format&fit=crop', x: 50, y: 50 }
            ],
            medium: [
                { label: 'Grand Taxi Médina', desc: 'Trajet régulé pour les sites en hauteur comme les Mérinides.', cost: 90, rating: 4.5, img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400&auto=format&fit=crop', x: 50, y: 50 }
            ],
            premium: [
                { label: 'Véhicule de Luxe avec Guide', desc: 'Visite guidée motorisée tout confort avec chauffeur professionnel.', cost: 900, rating: 4.9, img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=400&auto=format&fit=crop', x: 50, y: 50 }
            ]
        }
    },
    'Casablanca': {
        image: '/images/casablanca.png',
        tagline: 'Métropole moderne, berceau du style art-déco et de l\'architecture majestueuse.',
        hotels: {
            eco: [
                { label: 'Hotel Kenzi Basma Eco', desc: 'Hôtel fonctionnel très bien situé dans le centre historique.', cost: 420, rating: 4.2, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop', x: 45, y: 40 }
            ],
            medium: [
                { label: 'Sofitel Tour Blanche Casa', desc: 'Chambres élégantes dominant le port et spa de premier plan.', cost: 1450, rating: 4.8, img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=400&auto=format&fit=crop', x: 50, y: 25 }
            ],
            premium: [
                { label: 'Four Seasons Hotel Casablanca', desc: 'Luxe balnéaire en bordure d\'océan, service impeccable et sérénité.', cost: 3500, rating: 4.9, img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400&auto=format&fit=crop', x: 20, y: 60 }
            ]
        },
        restaurants: {
            eco: [
                { label: 'La Sqala Café', desc: 'Cuisine traditionnelle servie dans les jardins fleuris d\'un bastion du XVIIIe siècle.', cost: 95, rating: 4.5, img: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=400&auto=format&fit=crop', x: 48, y: 32 }
            ],
            medium: [
                { label: 'Rick\'s Café Casablanca', desc: 'Reconstitution mythique du bar culte du film hollywoodien Casablanca.', cost: 280, rating: 4.6, img: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=400&auto=format&fit=crop', x: 42, y: 28 }
            ],
            premium: [
                { label: 'Le Cabestan Ocean View', desc: 'Une adresse légendaire nichée au pied de la falaise, fruits de mer d\'exception.', cost: 720, rating: 4.9, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&auto=format&fit=crop', x: 18, y: 55 }
            ]
        },
        monuments: {
            eco: [
                { label: 'Quartier des Habous', desc: 'Nouvelle médina conçue selon des plans traditionnels avec arcades.', cost: 0, rating: 4.4, img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=400&auto=format&fit=crop', x: 65, y: 70 }
            ],
            medium: [
                { label: 'Mosquée Hassan II (Visite)', desc: 'Le joyau architectural de Casa doté du plus haut minaret du globe.', cost: 130, rating: 4.9, img: 'https://images.unsplash.com/photo-1559589689-577aabd1db4f?q=80&w=400&auto=format&fit=crop', x: 38, y: 15 }
            ],
            premium: [
                { label: 'Visite Guidée Art-Déco & Hassan II', desc: 'Visite architecturale ultra-détaillée avec historien de l\'art privé.', cost: 450, rating: 4.8, img: 'https://images.unsplash.com/photo-1564507592937-25994a9015b2?q=80&w=400&auto=format&fit=crop', x: 42, y: 18 }
            ]
        },
        activities: {
            eco: [
                { label: 'Flânerie Corniche d\'Ain Diab', desc: 'Prendre l\'air marin le long de la jetée bordée de terrasses.', cost: 0, rating: 4.2, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop', x: 22, y: 75 }
            ],
            medium: [
                { label: 'Session de Surf à Ain Diab', desc: 'Apprenez à glisser sur les célèbres rouleaux de l\'Atlantique.', cost: 250, rating: 4.5, img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=400&auto=format&fit=crop', x: 20, y: 80 }
            ],
            premium: [
                { label: 'Thalassothérapie Deluxe au Spa', desc: 'Soin océanique haut de gamme complet et parcours marin chauffé.', cost: 890, rating: 4.9, img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400&auto=format&fit=crop', x: 40, y: 22 }
            ]
        },
        places: {
            eco: [
                { label: 'Place des Nations Unies', desc: 'Le centre névralgique moderne flanqué de façades élégantes.', cost: 0, rating: 4.0, img: 'https://images.unsplash.com/photo-1597212618440-806262de4ee6?q=80&w=400&auto=format&fit=crop', x: 48, y: 38 }
            ],
            medium: [
                { label: 'Parc de la Ligue Arabe', desc: 'Magnifique espace vert orné de grands palmiers royaux, propice au repos.', cost: 0, rating: 4.4, img: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?q=80&w=400&auto=format&fit=crop', x: 46, y: 44 }
            ],
            premium: [
                { label: 'Quartier Anfa Heights VIP', desc: 'Tour guidé des somptueuses villas résidentielles et jardins secrets de Casa.', cost: 220, rating: 4.6, img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop', x: 28, y: 58 }
            ]
        },
        transport: {
            eco: [
                { label: 'Tramway de Casablanca', desc: 'Moderne, écologique et idéal pour traverser la métropole.', cost: 16, rating: 4.3, img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop', x: 50, y: 50 }
            ],
            medium: [
                { label: 'Taxis Blancs Interurbains', desc: 'Grands taxis confortables pour les liaisons directes.', cost: 80, rating: 4.2, img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400&auto=format&fit=crop', x: 50, y: 50 }
            ],
            premium: [
                { label: 'Voiture avec Chauffeur Privé', desc: 'Trajets urbains VIP en SUV ou berline haut de gamme.', cost: 1100, rating: 4.9, img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=400&auto=format&fit=crop', x: 50, y: 50 }
            ]
        }
    },
    'Agadir': {
        image: '/images/agadir.png',
        tagline: 'Station balnéaire royale, baignée de soleil 300 jours par an.',
        hotels: {
            eco: [
                { label: 'Hotel Kamal Agadir', desc: 'Charmant petit hôtel familial proche du centre-ville.', cost: 240, rating: 4.2, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop', x: 42, y: 35 }
            ],
            medium: [
                { label: 'Iberostar Founty Beach', desc: 'Complexe hôtelier face à l\'océan doté d\'une immense piscine.', cost: 980, rating: 4.6, img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=400&auto=format&fit=crop', x: 22, y: 68 }
            ],
            premium: [
                { label: 'Sofitel Agadir Royal Bay Resort', desc: 'Un véritable riad de bord de mer mêlant luxe moderne et secrets d\'Orient.', cost: 2200, rating: 4.9, img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400&auto=format&fit=crop', x: 18, y: 72 }
            ]
        },
        restaurants: {
            eco: [
                { label: 'Jour et Nuit Café', desc: 'Repas populaires en terrasse ouverte face au front de mer animé.', cost: 70, rating: 4.3, img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=400&auto=format&fit=crop', x: 38, y: 55 }
            ],
            medium: [
                { label: 'Pure Passion Restaurant', desc: 'Excellente adresse gastronomique internationale située sur la Marina d\'Agadir.', cost: 260, rating: 4.7, img: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=400&auto=format&fit=crop', x: 30, y: 48 }
            ],
            premium: [
                { label: 'Le Yacht Club Agadir', desc: 'Plateaux géants de fruits de mer et poissons grillés d\'une fraîcheur absolue.', cost: 650, rating: 4.9, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&auto=format&fit=crop', x: 28, y: 45 }
            ]
        },
        monuments: {
            eco: [
                { label: 'Kasbah Agadir Oufella', desc: 'Remparts historiques dominant la baie, superbes ruines.', cost: 0, rating: 4.6, img: 'https://images.unsplash.com/photo-1597212618440-806262de4ee6?q=80&w=400&auto=format&fit=crop', x: 15, y: 22 }
            ],
            medium: [
                { label: 'Medina de Polizzi', desc: 'Reconstitution artistique et culturelle de l\'ancienne médina d\'Agadir.', cost: 40, rating: 4.5, img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=400&auto=format&fit=crop', x: 72, y: 72 }
            ],
            premium: [
                { label: 'CrocoParc Agadir Entry', desc: 'Parc zoologique tropical abritant plus de 300 crocodiles géants.', cost: 120, rating: 4.7, img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop', x: 80, y: 50 }
            ]
        },
        activities: {
            eco: [
                { label: 'Shopping au Souk El Had', desc: 'Le plus grand marché urbain d\'Afrique, idéal pour les huiles.', cost: 0, rating: 4.5, img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400&auto=format&fit=crop', x: 48, y: 48 }
            ],
            medium: [
                { label: 'Excursion Vallée du Paradis', desc: 'Randonnée magique menant à de magnifiques piscines naturelles rocheuses.', cost: 350, rating: 4.8, img: 'https://images.unsplash.com/photo-1509060464153-44667396260f?q=80&w=400&auto=format&fit=crop', x: 85, y: 25 }
            ],
            premium: [
                { label: 'Jet Ski & Balade en Yacht Privé', desc: 'Une demi-journée de glisse et de croisière le long des côtes ensoleillées.', cost: 1400, rating: 4.9, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop', x: 20, y: 55 }
            ]
        },
        places: {
            eco: [
                { label: 'Promenade de la Plage', desc: 'Grande allée de sable de 5 km bordée de cafés et palmiers.', cost: 0, rating: 4.6, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop', x: 25, y: 60 }
            ],
            medium: [
                { label: 'Jardin d\'Olhao', desc: 'Jardin paisible aux allures portugaises qui commémore les liens historiques.', cost: 0, rating: 4.1, img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop', x: 40, y: 38 }
            ],
            premium: [
                { label: 'Excursion Dunes de Massa', desc: 'Parc National de Souss-Massa abritant des oiseaux rares et dunes dorées.', cost: 320, rating: 4.7, img: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=400&auto=format&fit=crop', x: 60, y: 88 }
            ]
        },
        transport: {
            eco: [
                { label: 'Bus Urbains ALSA', desc: 'Réseau de bus économique reliant toute la métropole.', cost: 10, rating: 4.0, img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400&auto=format&fit=crop', x: 50, y: 50 }
            ],
            medium: [
                { label: 'Grands Taxis Communs', desc: 'Faciles à trouver pour relier les villes environnantes.', cost: 60, rating: 4.3, img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400&auto=format&fit=crop', x: 50, y: 50 }
            ],
            premium: [
                { label: 'Location 4x4 Climatisé', desc: 'Parfait pour partir en excursion dans l\'arrière-pays.', cost: 750, rating: 4.8, img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=400&auto=format&fit=crop', x: 50, y: 50 }
            ]
        }
    },
    'Tanger': {
        image: 'https://images.unsplash.com/photo-1579294800821-694d95e86143?q=80&w=1200&auto=format&fit=crop',
        tagline: 'Porte d\'Afrique sur l\'Europe, carrefour bohème d\'artistes et d\'écrivains.',
        hotels: {
            eco: [
                { label: 'Riad Sultan Budget', desc: 'Un petit coin de sérénité au cœur de la Kasbah historique.', cost: 320, rating: 4.4, img: 'https://images.unsplash.com/photo-1590519542036-c47de6196ba5?q=80&w=400&auto=format&fit=crop', x: 45, y: 22 }
            ],
            medium: [
                { label: 'El Minzah Hotel', desc: 'Hôtel mythique au style hispano-mauresque chargé d\'histoire.', cost: 1100, rating: 4.7, img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=400&auto=format&fit=crop', x: 38, y: 48 }
            ],
            premium: [
                { label: 'Hilton Tanger City Center', desc: 'Luxe moderne avec vue spectaculaire sur la baie et le Détroit.', cost: 1950, rating: 4.8, img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400&auto=format&fit=crop', x: 60, y: 60 }
            ]
        },
        restaurants: {
            eco: [
                { label: 'Saveur de Poisson', desc: 'Restaurant populaire atypique proposant un menu fixe de la mer unique.', cost: 110, rating: 4.6, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&auto=format&fit=crop', x: 44, y: 32 }
            ],
            medium: [
                { label: 'El Tangerino Restaurant', desc: 'Excellentes spécialités espagnoles et poissons grillés face au port.', cost: 240, rating: 4.7, img: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=400&auto=format&fit=crop', x: 42, y: 55 }
            ],
            premium: [
                { label: 'Villa de France Restaurant', desc: 'Cuisine haut de gamme dans un cadre historique sublime fréquenté par Matisse.', cost: 680, rating: 4.9, img: 'https://images.unsplash.com/photo-1592861956120-e524fc739696?q=80&w=400&auto=format&fit=crop', x: 35, y: 40 }
            ]
        },
        monuments: {
            eco: [
                { label: 'Le Musée de la Kasbah', desc: 'Ancien palais du sultan exposant de riches antiquités archéologiques.', cost: 30, rating: 4.5, img: 'https://images.unsplash.com/photo-1597212618440-806262de4ee6?q=80&w=400&auto=format&fit=crop', x: 45, y: 18 }
            ],
            medium: [
                { label: 'Les Grottes d\'Hercule (Visite)', desc: 'Des cavernes de calcaire spectaculaires s\'ouvrant sur la mer en forme de carte d\'Afrique.', cost: 60, rating: 4.7, img: 'https://images.unsplash.com/photo-1579294800821-694d95e86143?q=80&w=400&auto=format&fit=crop', x: 18, y: 78 }
            ],
            premium: [
                { label: 'Cap Spartel & Phare Impérial', desc: 'Point de rencontre de l\'Atlantique et de la Méditerranée avec guide privé.', cost: 180, rating: 4.8, img: 'https://images.unsplash.com/photo-1579294800821-694d95e86143?q=80&w=400&auto=format&fit=crop', x: 15, y: 68 }
            ]
        },
        activities: {
            eco: [
                { label: 'Pause Thé au Café Hafa', desc: 'Siroter un thé à la menthe légendaire sur des terrasses face à l\'Espagne.', cost: 15, rating: 4.7, img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=400&auto=format&fit=crop', x: 28, y: 20 }
            ],
            medium: [
                { label: 'Excursion Cité Bleue Chefchaouen', desc: 'Randonnée d\'une journée dans les ruelles bleues des montagnes du Rif.', cost: 450, rating: 4.9, img: 'https://images.unsplash.com/photo-1548685913-fe6574340a49?q=80&w=400&auto=format&fit=crop', x: 80, y: 15 }
            ],
            premium: [
                { label: 'Session de Voile Privée sur le Détroit', desc: 'Balade en voilier au coucher du soleil à la rencontre des deux mers.', cost: 1500, rating: 4.9, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop', x: 50, y: 55 }
            ]
        },
        places: {
            eco: [
                { label: 'Médina & Grand Socco', desc: 'La place centrale historique aux étals fleuris et ruelles pavées.', cost: 0, rating: 4.6, img: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=400&auto=format&fit=crop', x: 42, y: 38 }
            ],
            medium: [
                { label: 'Parc de Perdicaris (Rmilat)', desc: 'Un grand domaine forestier surplombant le Détroit, parfait pour un pique-nique chic.', cost: 0, rating: 4.8, img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop', x: 25, y: 35 }
            ],
            premium: [
                { label: 'Excursion Cité Côtière d\'Asilah', desc: 'Visite artistique des remparts portugais d\'Asilah peints par des peintres locaux.', cost: 280, rating: 4.8, img: 'https://images.unsplash.com/photo-1509060464153-44667396260f?q=80&w=400&auto=format&fit=crop', x: 20, y: 70 }
            ]
        },
        transport: {
            eco: [
                { label: 'Petits Taxis Bleus de Tanger', desc: 'Petites voitures idéales pour circuler en ville.', cost: 25, rating: 4.2, img: 'https://images.unsplash.com/photo-1580824453163-5f04b14ea1ab?q=80&w=400&auto=format&fit=crop', x: 50, y: 50 }
            ],
            medium: [
                { label: 'Navettes Touristiques de Groupe', desc: 'Circulez vers les sites éloignés comme Cap Spartel.', cost: 90, rating: 4.4, img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400&auto=format&fit=crop', x: 50, y: 50 }
            ],
            premium: [
                { label: 'Transfert Berline Premium', desc: 'Trajet tout confort à bord d\'une voiture de luxe.', cost: 850, rating: 4.9, img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=400&auto=format&fit=crop', x: 50, y: 50 }
            ]
        }
    },
    'Rabat': {
        image: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?q=80&w=1200&auto=format&fit=crop',
        tagline: 'Capitale royale verte et apaisée, joyau culturel classé à l\'UNESCO.',
        hotels: {
            eco: [
                { label: 'Riad Kalaa Budget Suites', desc: 'Une belle demeure du XVe siècle au cœur des remparts de la médina.', cost: 350, rating: 4.5, img: 'https://images.unsplash.com/photo-1590519542036-c47de6196ba5?q=80&w=400&auto=format&fit=crop', x: 42, y: 35 }
            ],
            medium: [
                { label: 'Le Pietri Urban Hotel', desc: 'Une adresse urbaine chaleureuse réputée pour ses soirées jazz.', cost: 750, rating: 4.5, img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=400&auto=format&fit=crop', x: 38, y: 48 }
            ],
            premium: [
                { label: 'Sofitel Rabat Jardin des Roses', desc: 'Luxe 5 étoiles implanté au milieu d\'une roseraie de 8 hectares.', cost: 2300, rating: 4.9, img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400&auto=format&fit=crop', x: 22, y: 65 }
            ]
        },
        restaurants: {
            eco: [
                { label: 'Dar Naji Resto', desc: 'Cuisine marocaine traditionnelle très populaire réputée pour sa Rfissa.', cost: 85, rating: 4.5, img: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=400&auto=format&fit=crop', x: 44, y: 38 }
            ],
            medium: [
                { label: 'Le Grand Comptoir', desc: 'Brasserie parisienne chic et chaleureuse du centre-ville historique.', cost: 220, rating: 4.6, img: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=400&auto=format&fit=crop', x: 42, y: 52 }
            ],
            premium: [
                { label: 'Golden Fish Sofitel', desc: 'Spécialités de poissons nobles servies sur une terrasse féerique bordant la piscine.', cost: 590, rating: 4.8, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&auto=format&fit=crop', x: 22, y: 62 }
            ]
        },
        monuments: {
            eco: [
                { label: 'Tour Hassan & Mausolée', desc: 'Le célèbre minaret inachevé gardé par la garde royale royale.', cost: 0, rating: 4.8, img: 'https://images.unsplash.com/photo-1597212618440-806262de4ee6?q=80&w=400&auto=format&fit=crop', x: 48, y: 22 }
            ],
            medium: [
                { label: 'Kasbah des Oudayas', desc: 'Forteresse médiévale aux ruelles bleues et blanches dominant le fleuve.', cost: 0, rating: 4.9, img: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?q=80&w=400&auto=format&fit=crop', x: 30, y: 40 }
            ],
            premium: [
                { label: 'Nécropole de Chellah', desc: 'Vestiges romains et médiévaux envahis de verdure et de cigognes mythiques.', cost: 70, rating: 4.6, img: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=400&auto=format&fit=crop', x: 62, y: 55 }
            ]
        },
        activities: {
            eco: [
                { label: 'Café Maure des Oudayas', desc: 'Siroter un thé avec des cornes de gazelle face au fleuve Bouregreg.', cost: 35, rating: 4.7, img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=400&auto=format&fit=crop', x: 28, y: 38 }
            ],
            medium: [
                { label: 'Balade en Barque sur le Bouregreg', desc: 'Petite traversée fluviale en barque traditionnelle en bois coloré.', cost: 120, rating: 4.6, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop', x: 35, y: 42 }
            ],
            premium: [
                { label: 'Visite Musée Mohammed VI d\'Art', desc: 'Entrée VIP et visite privée de la plus prestigieuse galerie d\'art moderne du Maroc.', cost: 180, rating: 4.8, img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop', x: 44, y: 48 }
            ]
        },
        places: {
            eco: [
                { label: 'Forêt de la Mamora', desc: 'Vaste chênaie historique idéale pour respirer au grand air.', cost: 0, rating: 4.2, img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop', x: 75, y: 20 }
            ],
            medium: [
                { label: 'Plage de Salé & Marina', desc: 'Quais modernes bordés de yachts et de restaurants branchés.', cost: 0, rating: 4.3, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop', x: 33, y: 48 }
            ],
            premium: [
                { label: 'Golf Royal Dar Es Salam', desc: 'Visite et déjeuner gastronomique dans le prestigieux club-house du golf impérial.', cost: 350, rating: 4.9, img: 'https://images.unsplash.com/photo-1597212618440-806262de4ee6?q=80&w=400&auto=format&fit=crop', x: 60, y: 75 }
            ]
        },
        transport: {
            eco: [
                { label: 'Tramway de Rabat-Salé', desc: 'Idéal pour voyager sereinement entre les deux rives du fleuve.', cost: 14, rating: 4.5, img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop', x: 50, y: 50 }
            ],
            medium: [
                { label: 'Petits Taxis Bleus locaux', desc: 'Taxis rapides avec compteurs de trajet.', cost: 20, rating: 4.3, img: 'https://images.unsplash.com/photo-1580824453163-5f04b14ea1ab?q=80&w=400&auto=format&fit=crop', x: 50, y: 50 }
            ],
            premium: [
                { label: 'Navette VIP Aéroport & Ville', desc: 'Van haut de gamme avec vitres teintées et boissons fraîches.', cost: 750, rating: 4.9, img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=400&auto=format&fit=crop', x: 50, y: 50 }
            ]
        }
    }
};

// ─── Weather Data ───────────────────────────────────────────────────────────
const WEATHER_DATA = {
    'Marrakech': { temp: '28°C / 15°C', sun: '10h de soleil', vibe: 'Chaud & Ensoleillé', bestSeason: 'Printemps / Automne' },
    'Fès':       { temp: '24°C / 12°C', sun: '9h de soleil', vibe: 'Doux & Climat Sec', bestSeason: 'Printemps / Début d\'été' },
    'Casablanca':{ temp: '22°C / 16°C', sun: '8h de soleil', vibe: 'Brise Marine Humide', bestSeason: 'Toute l\'année' },
    'Agadir':    { temp: '26°C / 17°C', sun: '11h de soleil', vibe: 'Parfait & Ensoleillé', bestSeason: 'Toute l\'année' },
    'Tanger':    { temp: '21°C / 14°C', sun: '8h de soleil', vibe: 'Venteux & Côtier', bestSeason: 'Été' },
    'Rabat':     { temp: '23°C / 14°C', sun: '9h de soleil', vibe: 'Climat Doux Tempéré', bestSeason: 'Printemps / Été' }
};

// ─── Darija Phrases ─────────────────────────────────────────────────────────
const DARIJA_PHRASES = [
    { word: 'Salam Alaykoum', phonetic: 'Sah-lahm ah-lay-koom', translation: 'Bonjour / Que la paix soit sur vous', usage: 'Salutation principale, obligatoire pour débuter un échange.' },
    { word: 'Shukran', phonetic: 'Shoo-kran', translation: 'Merci', usage: 'Indispensable pour remercier après un service, achat ou transport.' },
    { word: 'Inshallah', phonetic: 'In-shah-lah', translation: 'Si Dieu le veut', usage: 'Utilisé couramment pour parler d\'actions ou d\'espoirs futurs.' },
    { word: 'Bezaf', phonetic: 'Beh-zahf', translation: 'Beaucoup / Trop', usage: 'Ex: "Zouina bezaf" (Très joli) ou "Ghalia bezaf" (Trop cher).' },
    { word: 'Bismillah', phonetic: 'Bis-mee-lah', translation: 'Au nom de Dieu', usage: 'Dit traditionnellement avant de manger ou d\'entreprendre une tâche.' },
    { word: 'Wakha', phonetic: 'Wah-khah', translation: 'D\'accord / OK', usage: 'Pour exprimer son accord ou finaliser un arrangement.' },
    { word: 'Smahli', phonetic: 'Smah-lee', translation: 'Excusez-moi / Pardon', usage: 'Utile pour poliment passer dans la foule ou attirer l\'attention.' }
];

// ─── Packing Assistant Generator ────────────────────────────────────────────
function getPackingList(formData) {
    const list = [
        { id: 1, label: 'Passeport valide & Photocopies', category: 'essential', desc: 'Indispensable pour les vérifications hôtelières.' },
        { id: 2, label: 'Adaptateur secteur de type C / E', category: 'essential', desc: 'Prises standards marocaines.' },
        { id: 3, label: 'Dirhams en espèces (MAD)', category: 'essential', desc: 'Nécessaire pour les souks, petits taxis et pourboires.' }
    ];

    if (formData.vibe === 'adventure') {
        list.push({ id: 4, label: 'Chaussures de marche / Randonnée', category: 'gear', desc: 'Pour les pavés et excursions en nature.' });
        list.push({ id: 5, label: 'Gourde isotherme réutilisable', category: 'gear', desc: 'S\'hydrater en limitant le plastique jetable.' });
        list.push({ id: 6, label: 'Lunettes de soleil polarisées & Chapeau', category: 'protection', desc: 'Le soleil brille intensément dans le Sud.' });
    } else if (formData.vibe === 'luxury') {
        list.push({ id: 4, label: 'Tenue de soirée chic / Décontractée', category: 'wear', desc: 'Pour dîner dans les palaces ou riads sélects.' });
        list.push({ id: 5, label: 'Maillot de bain élégant', category: 'wear', desc: 'Pour profiter des piscines intérieures chauffées.' });
    } else if (formData.vibe === 'cultural') {
        list.push({ id: 4, label: 'Foulard ou étole légère', category: 'wear', desc: 'Pour couvrir les épaules et la tête dans les lieux sacrés.' });
        list.push({ id: 5, label: 'Appareil photo / Batterie externe', category: 'gear', desc: 'Pour immortaliser les zelliges et l\'architecture.' });
    }

    if (formData.includes.activities) {
        list.push({ id: 7, label: 'Crème solaire protectrice SPF 50+', category: 'protection', desc: 'Protection capitale lors des sorties extérieures.' });
    }
    if (formData.city === 'Agadir' || formData.city === 'Tanger') {
        list.push({ id: 8, label: 'Veste coupe-vent / Pull léger', category: 'wear', desc: 'Les nuits près de l\'Atlantique ou du Détroit fraîchissent.' });
    }
    
    return list;
}

const DEFAULT_CITY = CITY_DATA['Marrakech'];

function getCityData(cityName) {
    if (!cityName) return DEFAULT_CITY;
    const key = Object.keys(CITY_DATA).find(k => cityName.toLowerCase().includes(k.toLowerCase()));
    return key ? CITY_DATA[key] : DEFAULT_CITY;
}

// ─── Premium Plan generator logic with Vibe Weightings ────────────────────────
function generatePlan(formData) {
    const { city, duration, budget, includes, vibe } = formData;
    const days = parseInt(duration);
    const totalBudget = parseInt(budget);
    const cityData = getCityData(city);

    // Compute tier based on daily budget
    const dailyBudget = totalBudget / days;
    let tier = 'medium';
    if (dailyBudget < 500) {
        tier = 'eco';
    } else if (dailyBudget > 1800) {
        tier = 'premium';
    }

    // Filter categories that are included
    const selected = Object.keys(CATEGORY_WEIGHTS).filter(k => includes[k]);
    const vibeWeights = VIBE_WEIGHTS[vibe] || VIBE_WEIGHTS.cultural;
    const totalWeight = selected.reduce((s, k) => s + vibeWeights[k], 0);
    
    // Allocate budget to categories
    const budgetMap = {};
    selected.forEach(k => {
        budgetMap[k] = Math.round((vibeWeights[k] / totalWeight) * totalBudget);
    });

    // 1. Keep track of already used attractions/restaurants to make every day unique
    const usedLabels = new Set();

    // 2. Select a hotel for the entire stay (realistic and constant)
    let selectedHotel = null;
    if (includes.hotels && cityData.hotels) {
        const hotelList = cityData.hotels[tier] || cityData.hotels['medium'] || cityData.hotels['eco'] || [];
        if (hotelList.length > 0) {
            selectedHotel = {
                ...hotelList[0],
                category: 'hotels',
                iconColor: CATEGORY_WEIGHTS.hotels.color,
                icon: CATEGORY_WEIGHTS.hotels.icon
            };
        }
    }

    const dayPlans = Array.from({ length: days }, (_, i) => {
        const dayNum = i + 1;
        const morning = [];
        const afternoon = [];
        const evening = [];

        const getCategoryItem = (cat, indexOffset) => {
            if (!includes[cat] || !cityData[cat]) return null;
            
            // Search order: start with preferred tier, then fallback to others
            const searchTiers = [tier, 'medium', 'eco', 'premium'].filter(
                (t, idx, self) => self.indexOf(t) === idx
            );

            // Collect all unique items available in this category for this city across tiers
            let allItems = [];
            searchTiers.forEach(t => {
                const list = cityData[cat][t] || [];
                list.forEach(item => {
                    if (!allItems.some(x => x.label === item.label)) {
                        allItems.push({ ...item, tier: t });
                    }
                });
            });

            if (allItems.length === 0) return null;

            // Find the first item that hasn't been used yet in the plan
            let chosenItem = allItems.find(item => !usedLabels.has(item.label));

            // If everything is already used (exhausted database), fallback to standard mod offset selection
            if (!chosenItem) {
                const salt = cat.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
                const fallbackIndex = (i + indexOffset + salt) % allItems.length;
                chosenItem = allItems[fallbackIndex];
            } else {
                usedLabels.add(chosenItem.label);
            }

            return {
                ...chosenItem,
                category: cat,
                iconColor: CATEGORY_WEIGHTS[cat].color,
                icon: CATEGORY_WEIGHTS[cat].icon
            };
        };

        // Morning Itinerary: Transport + Monument + Place
        const trans = getCategoryItem('transport', 0);
        if (trans) morning.push(trans);

        const mon = getCategoryItem('monuments', 0);
        if (mon) morning.push(mon);

        const plc = getCategoryItem('places', 0);
        if (plc) morning.push(plc);

        // Afternoon Itinerary: Restaurant + Activity
        const rest = getCategoryItem('restaurants', 0);
        if (rest) afternoon.push(rest);

        const act = getCategoryItem('activities', 0);
        if (act) afternoon.push(act);

        // Evening Itinerary: Restaurant (Dinner) + Hotel (stays constant)
        const dinner = getCategoryItem('restaurants', 1);
        if (dinner) {
            // Modify dinner title and slightly premium pricing for evening vibe
            const dinnerLabel = dinner.label.startsWith('Dîner Saveur Locale —') 
                ? dinner.label 
                : `Dîner Saveur Locale — ${dinner.label}`;
            
            evening.push({
                ...dinner,
                label: dinnerLabel,
                cost: Math.round(dinner.cost * 1.1)
            });
        }

        if (selectedHotel) {
            evening.push(selectedHotel);
        }

        const dayTotal = [...morning, ...afternoon, ...evening].reduce((s, x) => s + x.cost, 0);

        return { dayNum, morning, afternoon, evening, dayTotal };
    });

    return { dayPlans, budgetMap, totalBudget, city, duration: days, tier, tagline: cityData.tagline, image: cityData.image, vibe };
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function MyPlanPlanner({ user, onPlanSaved, initialPlan }) {
    const [cities, setCities] = useState([]);
    const [step, setStep] = useState(initialPlan ? 'result' : 'form'); // 'form' | 'loading' | 'result'
    const [activeWizardStep, setActiveWizardStep] = useState(1);
    const [activeTab, setActiveTab] = useState('itinerary');
    const [loadingStep, setLoadingStep] = useState(0);
    const [generatedPlan, setGeneratedPlan] = useState(null);
    const [activeResultDay, setActiveResultDay] = useState(1);
    const resultRef = useRef(null);
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Swap flips state to trigger flip visual animations
    const [flipKey, setFlipKey] = useState('');
    const [packingChecked, setPackingChecked] = useState({});

    // Dynamic map interaction
    const [mapHoveredCity, setMapHoveredCity] = useState(null);

    // Sync initialPlan state changes
    useEffect(() => {
        if (initialPlan) {
            // Re-inject the React functional components for icons from CATEGORY_WEIGHTS
            const restoredDayPlans = initialPlan.dayPlans.map(dp => ({
                ...dp,
                morning: dp.morning.map(item => ({ ...item, icon: CATEGORY_WEIGHTS[item.category]?.icon })),
                afternoon: dp.afternoon.map(item => ({ ...item, icon: CATEGORY_WEIGHTS[item.category]?.icon })),
                evening: dp.evening.map(item => ({ ...item, icon: CATEGORY_WEIGHTS[item.category]?.icon }))
            }));

            setGeneratedPlan({
                ...initialPlan,
                dayPlans: restoredDayPlans
            });
            setStep('result');
            setActiveTab('itinerary');
        } else {
            setGeneratedPlan(null);
            setStep('form');
            setActiveWizardStep(1);
        }
    }, [initialPlan]);

    const handleSavePlan = async () => {
        if (!generatedPlan || !user) return;
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            const userId = user.uid || user.id || user.email || 'anonymous';
            
            // Clean dayPlans of React icon components which cause JSON stringify and Firestore serialization crashes
            const cleanDayPlans = generatedPlan.dayPlans.map(dp => ({
                ...dp,
                morning: dp.morning.map(({ icon, ...rest }) => rest),
                afternoon: dp.afternoon.map(({ icon, ...rest }) => rest),
                evening: dp.evening.map(({ icon, ...rest }) => rest)
            }));

            const planPayload = {
                id: `plan_${Date.now()}`,
                userId,
                userName: user.name || 'User',
                city: generatedPlan.city,
                duration: generatedPlan.duration,
                totalBudget: generatedPlan.totalBudget,
                tier: generatedPlan.tier,
                tagline: generatedPlan.tagline || '',
                image: generatedPlan.image || '',
                dayPlans: cleanDayPlans,
                vibe: generatedPlan.vibe,
                createdAt: new Date().toISOString()
            };

            // ── 1. Save to localStorage (always works, no permissions needed) ──
            const storageKey = `my_plans_${userId}`;
            const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
            existing.unshift(planPayload);
            // Keep max 20 plans
            localStorage.setItem(storageKey, JSON.stringify(existing.slice(0, 20)));

            // ── Notify parent dashboard ──
            if (onPlanSaved) onPlanSaved(planPayload);

            // ── 2. Save to Laravel Backend ──
            try {
                await api.post('/my-plans', planPayload);
            } catch (apiErr) {
                console.warn("Laravel save failed (localStorage used as fallback):", apiErr.message);
            }

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 5000);
        } catch (error) {
            console.error("Error saving plan: ", error);
            alert("Erreur lors de l'enregistrement. Veuillez réessayer.");
        } finally {
            setIsSaving(false);
        }
    };

    const [form, setForm] = useState({
        city: 'Marrakech',
        duration: '3',
        budget: '3000',
        vibe: 'cultural', // 'cultural' | 'luxury' | 'adventure' | 'foodie'
        includes: {
            hotels: true,
            restaurants: true,
            activities: true,
            transport: true,
            monuments: true,
            places: true,
        }
    });

    useEffect(() => {
        const loadCities = async () => {
            try {
                const res = await api.get('/villes');
                const data = res.data;
                setCities(data);
                if (data.length > 0) setForm(f => ({ ...f, city: data[0].nom }));
            } catch (e) {
                // fallback list
                const fallback = ['Marrakech', 'Fès', 'Casablanca', 'Agadir', 'Tanger', 'Rabat'];
                setCities(fallback.map(n => ({ id: n, nom: n })));
                setForm(f => ({ ...f, city: 'Marrakech' }));
            }
        };
        loadCities();
    }, []);

    const toggleInclude = (key) => {
        setForm(f => ({ ...f, includes: { ...f.includes, [key]: !f.includes[key] } }));
    };

    const handleSelectAll = () => {
        const allActive = Object.values(form.includes).every(Boolean);
        setForm(f => ({
            ...f,
            includes: {
                hotels: !allActive,
                restaurants: !allActive,
                activities: !allActive,
                transport: !allActive,
                monuments: !allActive,
                places: !allActive,
            }
        }));
    };

    // Quick Budget Packs click handler
    const applyBudgetPack = (ratePerDay) => {
        const total = ratePerDay * parseInt(form.duration);
        setForm(f => ({ ...f, budget: String(total) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.city || !form.budget || parseInt(form.budget) < 100) return;
        
        setStep('loading');
        setLoadingStep(0);

        // Simulation steps interval
        const stepsTimer = setInterval(() => {
            setLoadingStep(prev => {
                if (prev >= 3) {
                    clearInterval(stepsTimer);
                    return prev;
                }
                return prev + 1;
            });
        }, 1100);

        setTimeout(() => {
            const plan = generatePlan(form);
            setGeneratedPlan(plan);
            setStep('result');
            setActiveResultDay(1);
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
        }, 4600);
    };

    const handleReset = () => {
        setStep('form');
        setGeneratedPlan(null);
    };

    // Dynamic Swapping Mechanic inside results
    const handleSwapItem = (dayNum, period, idx) => {
        if (!generatedPlan) return;
        
        // Visual animation key
        const visualKey = `${dayNum}-${period}-${idx}`;
        setFlipKey(visualKey);

        setTimeout(() => {
            setGeneratedPlan(oldPlan => {
                const newDayPlans = oldPlan.dayPlans.map(d => {
                    if (d.dayNum !== dayNum) return d;
                    const targetArray = d[period];
                    if (!targetArray || !targetArray[idx]) return d;
                    const item = targetArray[idx];
                    const cat = item.category;
                    const tier = oldPlan.tier;
                    const cityData = getCityData(oldPlan.city);
                    
                    if (!cityData || !cityData[cat] || !cityData[cat][tier]) return d;
                    const list = cityData[cat][tier];
                    if (list.length <= 1) return d;
                    
                    // Cycle to next item in database
                    const currentIdx = list.findIndex(x => x.label === item.label || x.label.includes(item.label));
                    const nextIdx = (currentIdx + 1) % list.length;
                    
                    const nextItem = list[nextIdx];
                    const newItem = {
                        ...nextItem,
                        category: cat,
                        iconColor: CATEGORY_WEIGHTS[cat].color,
                        icon: CATEGORY_WEIGHTS[cat].icon
                    };

                    // Dinner adjustments if applicable
                    if (period === 'evening' && cat === 'restaurants') {
                        newItem.label = `Dîner Saveur Locale — ${newItem.label}`;
                        newItem.cost = Math.round(newItem.cost * 1.1);
                    }

                    const newPeriodArray = [...targetArray];
                    newPeriodArray[idx] = newItem;

                    // Compute new dayTotal
                    const morningList = period === 'morning' ? newPeriodArray : d.morning;
                    const afternoonList = period === 'afternoon' ? newPeriodArray : d.afternoon;
                    const eveningList = period === 'evening' ? newPeriodArray : d.evening;
                    const newDayTotal = [...morningList, ...afternoonList, ...eveningList].reduce((sum, x) => sum + x.cost, 0);

                    return {
                        ...d,
                        [period]: newPeriodArray,
                        dayTotal: newDayTotal
                    };
                });

                return {
                    ...oldPlan,
                    dayPlans: newDayPlans
                };
            });

            // clear flip state
            setTimeout(() => setFlipKey(''), 450);
        }, 150);
    };

    const selectedCount = Object.values(form.includes).filter(Boolean).length;
    const isAllSelected = selectedCount === 6;

    // Budget quick selections
    const ratePackages = [
        { label: '🎒 Sac à dos', rate: 250, desc: 'Économique' },
        { label: '🌍 Escapade', rate: 750, desc: 'Standard' },
        { label: '✨ Voyage Chic', rate: 1800, desc: 'Premium' },
        { label: '👑 Palais Royal', rate: 4500, desc: 'Luxe Impérial' }
    ];

    const currentVibeData = VIBE_WEIGHTS[form.vibe] || VIBE_WEIGHTS.cultural;
    const weather = generatedPlan ? WEATHER_DATA[generatedPlan.city] || WEATHER_DATA['Marrakech'] : null;
    const packingList = generatedPlan ? getPackingList(form) : [];

    const handlePackingCheck = (id) => {
        setPackingChecked(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Custom schematic map points path for current day
    const getActiveDayRouteSvg = () => {
        if (!generatedPlan) return null;
        const currentDayData = generatedPlan.dayPlans.find(d => d.dayNum === activeResultDay);
        if (!currentDayData) return null;

        const points = [
            ...currentDayData.morning,
            ...currentDayData.afternoon,
            ...currentDayData.evening
        ].filter(item => item.x !== undefined && item.y !== undefined);

        if (points.length === 0) return (
            <text x="250" y="150" fill="rgba(255,255,255,0.4)" textAnchor="middle" fontSize="14">
                Sélectionnez des éléments pour tracer l'itinéraire.
            </text>
        );

        // Map dimensions are 500x300
        const coordinates = points.map(p => ({
            x: Math.round((p.x / 100) * 440 + 30),
            y: Math.round((p.y / 100) * 240 + 30),
            label: p.label,
            category: p.category,
            cost: p.cost
        }));

        let pathD = `M ${coordinates[0].x} ${coordinates[0].y}`;
        for (let i = 1; i < coordinates.length; i++) {
            pathD += ` L ${coordinates[i].x} ${coordinates[i].y}`;
        }

        return (
            <>
                {/* Connecting Path Grid with Glow */}
                <path d={pathD} fill="none" stroke="rgba(201, 163, 95, 0.2)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d={pathD} fill="none" stroke="var(--travel-accent, #c9a35f)" strokeWidth="2" strokeDasharray="6,6" strokeLinecap="round" strokeLinejoin="round" />

                {/* Nodes rendering */}
                {coordinates.map((pt, idx) => {
                    const color = CATEGORY_WEIGHTS[pt.category]?.color || '#ffffff';
                    return (
                        <g key={idx} className="route-node-group" style={{ cursor: 'pointer' }}>
                            <circle cx={pt.x} cy={pt.y} r="18" fill="rgba(255, 255, 255, 0.9)" stroke={color} strokeWidth="2.5" />
                            <circle cx={pt.x} cy={pt.y} r="4" fill="#1e293b" />
                            <text x={pt.x} y={pt.y - 24} textAnchor="middle" fill="#1e293b" fontSize="10.5" fontWeight="700" className="route-node-label">
                                {idx + 1}. {pt.label.replace(/Dîner Saveur Locale — /, '').substring(0, 18)}...
                            </text>
                            <circle cx={pt.x} cy={pt.y} r="25" fill="transparent" />
                            <title>{`${pt.label} (${pt.cost > 0 ? pt.cost + ' DH' : 'Inclus/Gratuit'})`}</title>
                        </g>
                    );
                })}
            </>
        );
    };

    return (
        <div className="planner-root light-luxury-theme">
            {/* ── BACK NAVIGATION TO HOME ── */}
            <div className="planner-back-nav">
                <button 
                    className="planner-back-dashboard-btn"
                    onClick={() => navigate('/')}
                >
                    <LuArrowLeft size={16} /> <span>Retour à l'accueil</span>
                </button>
            </div>

            {/* ── HERO HEADER ── */}
            <div className="planner-hero">
                <div className="planner-hero-bg" />
                <div className="planner-hero-content animate-fade-in">
                    <div className="planner-hero-badge">
                        <LuSparkles size={14} />
                        Planificateur d'Itinéraire Intelligent
                    </div>
                    <h1>Concevez Votre Voyage de Rêve</h1>
                    <p>Façonnez un circuit marocain d'exception, combinant des hébergements raffinés, des adresses culinaires secrètes et des expériences inoubliables.</p>
                </div>
            </div>

            {/* ── FORM STEP: INTERACTIVE MULTI-STEP WIZARD ── */}
            {step === 'form' && (
                <div className="planner-wizard-container animate-fade-in">
                    
                    {/* Left Panel: Wizard Questions */}
                    <div className="planner-wizard-questions">
                        <div className="wizard-progress-bar-wrap">
                            <div className="wizard-progress-bar-fill" style={{ width: `${(activeWizardStep / 4) * 100}%` }} />
                            <div className="wizard-steps-indicators">
                                {[1, 2, 3, 4].map(s => (
                                    <button 
                                        key={s} 
                                        type="button" 
                                        className={`step-dot-btn ${activeWizardStep >= s ? 'active' : ''} ${activeWizardStep === s ? 'current' : ''}`}
                                        onClick={() => {
                                            // Allow navigating back or forward only if validated (always allowed to go back)
                                            if (s < activeWizardStep || s === 1 || (s === 2 && form.city) || (s === 3 && form.city && form.duration) || (s === 4 && form.city && form.duration && form.budget)) {
                                                setActiveWizardStep(s);
                                            }
                                        }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <form className="planner-wizard-form-card" onSubmit={handleSubmit}>
                            
                            {/* STEP 1: DESTINATION SELECTION */}
                            {activeWizardStep === 1 && (
                                <div className="wizard-step-content animate-fade-in">
                                    <label className="planner-label">
                                        <LuMap size={16} /> 1. Choisissez votre Destination sur la Carte
                                    </label>
                                    <p className="wizard-step-desc">Cliquez directement sur une ville de la carte ou sélectionnez-la dans la liste ci-dessous.</p>
                                    
                                    <div className="morocco-map-selector-container">
                                        <div className="morocco-map-svg-wrap">
                                            <svg viewBox="0 0 500 350" className="morocco-map-svg">
                                                <path 
                                                    d="M220,15 L235,18 L245,28 L255,42 L245,55 L265,65 L255,75 L285,85 L260,110 L235,100 L210,120 L160,105 L145,120 L105,175 L80,215 L50,285 L35,295 L42,280 L75,200 L115,160 L140,100 L170,70 L210,38 Z" 
                                                    fill="rgba(201, 163, 95, 0.03)" 
                                                    stroke="rgba(201, 163, 95, 0.2)" 
                                                    strokeWidth="2.5"
                                                    className="morocco-outline-path"
                                                />
                                                {[
                                                    { name: 'Tanger',     x: 215, y: 35,  tagline: 'La porte du Détroit et de l\'Europe.' },
                                                    { name: 'Rabat',      x: 172, y: 78,  tagline: 'La capitale impériale calme et arborée.' },
                                                    { name: 'Casablanca', x: 148, y: 104, tagline: 'La métropole dynamique et moderne.' },
                                                    { name: 'Fès',        x: 220, y: 88,  tagline: 'Le cœur historique et spirituel.' },
                                                    { name: 'Marrakech',  x: 128, y: 170, tagline: 'L\'effervescence magique du grand Sud.' },
                                                    { name: 'Agadir',     x: 84,  y: 222, tagline: 'La douceur océanique et sa longue baie.' }
                                                ].map(cityPin => {
                                                    const isSelected = form.city === cityPin.name;
                                                    return (
                                                        <g 
                                                            key={cityPin.name} 
                                                            onClick={() => setForm(f => ({ ...f, city: cityPin.name }))}
                                                            onMouseEnter={() => setMapHoveredCity(cityPin)}
                                                            onMouseLeave={() => setMapHoveredCity(null)}
                                                            className={`map-city-pin-group ${isSelected ? 'selected' : ''}`}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <circle cx={cityPin.x} cy={cityPin.y} r="14" className="pin-pulse" fill="rgba(192, 36, 26, 0.15)" />
                                                            <circle cx={cityPin.x} cy={cityPin.y} r="6" className="pin-core" fill={isSelected ? '#c0241a' : '#c9a35f'} />
                                                            <text 
                                                                x={cityPin.x} 
                                                                y={cityPin.y - 12} 
                                                                textAnchor="middle" 
                                                                fill={isSelected ? '#1e293b' : '#64748b'} 
                                                                fontSize="10.5" 
                                                                fontWeight={isSelected ? '800' : '600'}
                                                                className="map-city-text"
                                                            >
                                                                {cityPin.name}
                                                            </text>
                                                        </g>
                                                    );
                                                })}
                                            </svg>
                                        </div>
                                        
                                        <div className="morocco-map-info-panel">
                                            <div className="city-info-card-inner">
                                                <span className="info-eyebrow">Destination Sélectionnée</span>
                                                <h3>{form.city}</h3>
                                                <p>{getCityData(form.city).tagline}</p>
                                                
                                                <div className="city-select-alternative-dropdown">
                                                    <span className="info-sub-label">Ou changez via la liste :</span>
                                                    <div className="planner-select-wrap">
                                                        <select
                                                            className="planner-select"
                                                            value={form.city}
                                                            onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                                                            required
                                                        >
                                                            {cities.map(c => (
                                                                <option key={c.id} value={c.nom}>{c.nom}</option>
                                                            ))}
                                                        </select>
                                                        <LuChevronDown className="planner-select-icon" size={18} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: STAY DURATION & MOOD */}
                            {activeWizardStep === 2 && (
                                <div className="wizard-step-content animate-fade-in">
                                    <div className="planner-field">
                                        <label className="planner-label">
                                            <LuCalendarDays size={16} /> 2. Durée de votre Séjour
                                        </label>
                                        <p className="wizard-step-desc">Combien de jours souhaitez-vous consacrer à cette aventure ?</p>
                                        <div className="planner-duration-grid">
                                            {['1','2','3','4','5','6','7'].map(d => (
                                                <button
                                                    type="button"
                                                    key={d}
                                                    className={`planner-duration-btn ${form.duration === d ? 'active' : ''}`}
                                                    onClick={() => {
                                                        setForm(f => ({ ...f, duration: d }));
                                                        const currentTotal = parseInt(form.budget);
                                                        const currentDuration = parseInt(form.duration);
                                                        if (currentTotal && currentDuration) {
                                                            const rate = Math.round(currentTotal / currentDuration);
                                                            setForm(f => ({ ...f, budget: String(rate * parseInt(d)) }));
                                                        }
                                                    }}
                                                >
                                                    {d} {parseInt(d) > 1 ? 'Jours' : 'Jour'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="planner-field" style={{ marginTop: '28px' }}>
                                        <label className="planner-label">
                                            <LuSparkles size={16} /> 3. Style & Ambiance de Voyage
                                        </label>
                                        <p className="wizard-step-desc">Le style détermine le type d'activités et d'établissements suggérés.</p>
                                        <div className="planner-vibe-selector-grid">
                                            {[
                                                { key: 'cultural', label: '🎒 Culturel', desc: 'Monuments, histoire & savoir local' },
                                                { key: 'luxury',   label: '👑 Royal / Luxe', desc: 'Hébergements Palace & Spas haut de gamme' },
                                                { key: 'adventure',label: '🧗 Aventure & Nature', desc: 'Excursions, plein air & sensations' },
                                                { key: 'foodie',   label: '🥘 Gourmand', desc: 'Grandes tables & secrets culinaires' }
                                            ].map(v => (
                                                <button
                                                    type="button"
                                                    key={v.key}
                                                    className={`vibe-selector-btn ${form.vibe === v.key ? 'active' : ''}`}
                                                    onClick={() => setForm(f => ({ ...f, vibe: v.key }))}
                                                >
                                                    <strong>{v.label}</strong>
                                                    <span>{v.desc}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: BUDGET CONFIGURATION */}
                            {activeWizardStep === 3 && (
                                <div className="wizard-step-content animate-fade-in">
                                    <label className="planner-label">
                                        <LuWallet size={16} /> 4. Votre Budget Total (MAD)
                                    </label>
                                    <p className="wizard-step-desc">Indiquez la somme estimée globale. Nous adapterons les catégories en fonction.</p>
                                    
                                    <div className="planner-budget-wrap">
                                        <span className="planner-currency">MAD</span>
                                        <input
                                            type="number"
                                            className="planner-budget-input"
                                            placeholder="Ex: 5000"
                                            min="200"
                                            value={form.budget}
                                            onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="planner-budget-chips-section">
                                        <span className="info-sub-label">Formules suggérées basées sur votre séjour ({form.duration} jours) :</span>
                                        <div className="planner-budget-chips">
                                            {ratePackages.map((p, idx) => {
                                                const pkgTotal = p.rate * parseInt(form.duration);
                                                const isSelected = parseInt(form.budget) === pkgTotal;
                                                return (
                                                    <button
                                                        type="button"
                                                        key={idx}
                                                        className={`planner-chip ${isSelected ? 'active' : ''}`}
                                                        onClick={() => applyBudgetPack(p.rate)}
                                                    >
                                                        <strong>{pkgTotal.toLocaleString()} DH</strong>
                                                        <span className="planner-chip-tier">{p.label} (~{p.rate} DH/j)</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: ELEMENTS INCLUSION */}
                            {activeWizardStep === 4 && (
                                <div className="wizard-step-content animate-fade-in">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '8px' }}>
                                        <label className="planner-label">
                                            <LuCircleCheck size={16} /> 5. Éléments à inclure
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleSelectAll}
                                            className="planner-toggle-all-btn"
                                        >
                                            {isAllSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
                                        </button>
                                    </div>
                                    <p className="wizard-step-desc">Cochez les types de dépenses à inclure dans les calculs de budget.</p>
                                    
                                    <div className="planner-includes-grid">
                                        {Object.entries(CATEGORY_WEIGHTS).map(([key, cat]) => {
                                            const Icon = cat.icon;
                                            return (
                                                <button
                                                    type="button"
                                                    key={key}
                                                    className={`planner-include-btn ${form.includes[key] ? 'active' : ''}`}
                                                    style={{ '--cat-color': cat.color }}
                                                    onClick={() => toggleInclude(key)}
                                                >
                                                    <div className="planner-include-icon">
                                                        <Icon size={20} />
                                                    </div>
                                                    <span>{cat.label}</span>
                                                    {form.includes[key] && <LuCircleCheck className="planner-include-check" size={16} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* WIZARD ACTIONS AND CONTROLS */}
                            <div className="wizard-nav-buttons">
                                {activeWizardStep > 1 && (
                                    <button 
                                        type="button" 
                                        className="wizard-back-btn" 
                                        onClick={() => setActiveWizardStep(s => s - 1)}
                                    >
                                        Précédent
                                    </button>
                                )}
                                
                                {activeWizardStep < 4 ? (
                                    <button 
                                        type="button" 
                                        className="wizard-next-btn"
                                        disabled={activeWizardStep === 1 && !form.city}
                                        onClick={() => setActiveWizardStep(s => s + 1)}
                                    >
                                        Continuer <LuArrowRight size={16} />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="planner-submit-btn"
                                        disabled={selectedCount === 0 || !form.budget}
                                    >
                                        <LuSparkles size={20} />
                                        Générer Mon Itinéraire
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Right Panel: Live Builder Blueprint Preview */}
                    <div className="planner-wizard-preview">
                        <div className="preview-card-sticky">
                            <span className="preview-eyebrow">Votre Carnet en cours</span>
                            
                            <div className="preview-city-banner">
                                <img src={getCityData(form.city).image} alt={form.city} className="preview-city-img" />
                                <div className="preview-city-overlay" />
                                <div className="preview-city-info">
                                    <h4>{form.city}</h4>
                                    <p>{getCityData(form.city).tagline}</p>
                                </div>
                            </div>
                            
                            <div className="preview-specs-grid">
                                <div className="spec-item">
                                    <span className="spec-lbl">Destination</span>
                                    <span className="spec-val">{form.city}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-lbl">Durée</span>
                                    <span className="spec-val">{form.duration} jours</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-lbl">Style de Voyage</span>
                                    <span className="spec-val" style={{ textTransform: 'capitalize' }}>
                                        {form.vibe === 'cultural' && '🎒 Culturel'}
                                        {form.vibe === 'luxury' && '👑 Royal / Luxe'}
                                        {form.vibe === 'adventure' && '🧗 Aventure'}
                                        {form.vibe === 'foodie' && '🥘 Gourmand'}
                                    </span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-lbl">Budget Total</span>
                                    <span className="spec-val">{form.budget ? parseInt(form.budget).toLocaleString() : 0} DH</span>
                                </div>
                            </div>

                            {/* Live preview breakdown bars */}
                            <div className="preview-breakdown-live">
                                <span className="preview-section-title">Estimation par catégorie</span>
                                <div className="preview-breakdown-list">
                                    {Object.entries(CATEGORY_WEIGHTS).map(([key, cat]) => {
                                        const isIncluded = form.includes[key];
                                        if (!isIncluded) return null;
                                        
                                        // Realtime weight calculation
                                        const vibeWeights = VIBE_WEIGHTS[form.vibe] || VIBE_WEIGHTS.cultural;
                                        const selected = Object.keys(CATEGORY_WEIGHTS).filter(k => form.includes[k]);
                                        const totalWeight = selected.reduce((s, k) => s + vibeWeights[k], 0);
                                        const amount = totalWeight > 0 ? Math.round((vibeWeights[key] / totalWeight) * (parseInt(form.budget) || 0)) : 0;
                                        
                                        return (
                                            <div className="preview-breakdown-row" key={key}>
                                                <div className="pbr-label">
                                                    <span className="pbr-dot" style={{ background: cat.color }} />
                                                    <span>{cat.label}</span>
                                                </div>
                                                <span className="pbr-amount">{amount.toLocaleString()} DH</span>
                                            </div>
                                        );
                                    })}
                                    {selectedCount === 0 && (
                                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>Aucun élément coché pour le budget.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── IMMERSIVE LOADING STEP ── */}
            {step === 'loading' && (
                <div className="planner-form-section animate-fade-in">
                    <div className="planner-loading-card">
                        <div className="planner-loading-orbit">
                            <div className="orbit-circle" />
                            <div className="orbit-core"><LuSparkles /></div>
                            <div className="orbit-planet" />
                        </div>
                        
                        <h2>Création de votre carnet...</h2>
                        <p style={{ color: 'rgba(28, 28, 35, 0.7)', maxWidth: '460px', margin: '0 auto', fontSize: '0.95rem' }}>
                            Notre algorithme affine les meilleures adresses de {form.city} et structure un circuit optimal selon vos désirs.
                        </p>

                        <div className="planner-loading-steps">
                            <div className={`loading-step-item ${loadingStep === 0 ? 'active' : ''} ${loadingStep > 0 ? 'completed' : ''}`}>
                                <LuClock size={16} /> 1. Analyse du profil {form.vibe} et filtrage des adresses...
                            </div>
                            <div className={`loading-step-item ${loadingStep === 1 ? 'active' : ''} ${loadingStep > 1 ? 'completed' : ''}`}>
                                <LuHotel size={16} /> 2. Recherche d'hébergement et riads d'exception...
                            </div>
                            <div className={`loading-step-item ${loadingStep === 2 ? 'active' : ''} ${loadingStep > 2 ? 'completed' : ''}`}>
                                <LuZap size={16} /> 3. Tracé géographique des points d'intérêts sur les cartes...
                            </div>
                            <div className={`loading-step-item ${loadingStep === 3 ? 'active' : ''} ${loadingStep > 3 ? 'completed' : ''}`}>
                                <LuSparkles size={16} /> 4. Finalisation du carnet de voyage et calculs...
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── RESULT STEP: DYNAMIC TABBED DASHBOARD ── */}
            {step === 'result' && generatedPlan && (
                <div ref={resultRef} className="planner-result-section animate-fade-in">

                    {/* Parallax City Image Cover */}
                    <div className="planner-city-banner">
                        <img src={generatedPlan.image} alt={generatedPlan.city} className="planner-city-img" />
                        <div className="planner-city-overlay" />
                        <div className="planner-city-details">
                            <div className="planner-city-badge">
                                <LuSparkles size={13} />
                                Carnet Impérial · Style {generatedPlan.vibe}
                            </div>
                            <h2>{generatedPlan.city}</h2>
                            <p style={{ fontSize: '1.25rem', opacity: 0.95, maxWidth: '650px', fontWeight: '500', color: '#f1f5f9' }}>
                                {generatedPlan.tagline}
                            </p>
                        </div>
                    </div>

                    {/* Metrics Summary Bar */}
                    <div className="planner-result-summary">
                        <div className="planner-result-summary-item">
                            <LuMapPin size={20} />
                            <div>
                                <span className="prs-label">Destination</span>
                                <span className="prs-value">{generatedPlan.city}</span>
                            </div>
                        </div>
                        <div className="planner-result-summary-item">
                            <LuCalendarDays size={20} />
                            <div>
                                <span className="prs-label">Séjour</span>
                                <span className="prs-value">{generatedPlan.duration} Jours</span>
                            </div>
                        </div>
                        <div className="planner-result-summary-item">
                            <LuWallet size={20} />
                            <div>
                                <span className="prs-label">Budget Global</span>
                                <span className="prs-value">{generatedPlan.totalBudget.toLocaleString()} DH</span>
                            </div>
                        </div>
                        <div className="planner-result-summary-item">
                            <LuSparkles size={20} />
                            <div>
                                <span className="prs-label">Standard</span>
                                <span className="prs-value" style={{ textTransform: 'capitalize' }}>
                                    {generatedPlan.tier === 'eco' && '🎒 Sac à dos / Éco'}
                                    {generatedPlan.tier === 'medium' && '🌍 Standard / Chic'}
                                    {generatedPlan.tier === 'premium' && '👑 Grand Luxe'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── PORTAL NAVIGATION TABS ── */}
                    <div className="planner-portal-tabs-nav">
                        {[
                            { id: 'itinerary', label: 'Itinéraire', icon: LuCalendarDays },
                            { id: 'map', label: 'Carte & Circuit', icon: LuMap },
                            { id: 'budget', label: 'Mon Budget', icon: LuWallet },
                            { id: 'prep', label: 'Préparatifs', icon: LuCloudSun },
                            { id: 'cultural', label: 'Darija & Culture', icon: LuCompass }
                        ].map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    className={`portal-tab-btn ${isActive ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <Icon size={18} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* ── PORTAL VIEW CONTENT PANES ── */}
                    <div className="planner-portal-tab-content">
                        
                        {/* TAB 1: ITINERARY TIMELINE */}
                        {activeTab === 'itinerary' && (
                            <div className="portal-pane animate-fade-in">
                                <div className="day-plans-header-nav">
                                    <h3 className="planner-section-title">
                                        <LuCalendarDays size={20} /> Programme Jour par Jour
                                    </h3>
                                    <div className="day-selector-pills">
                                        {generatedPlan.dayPlans.map(day => (
                                            <button
                                                key={day.dayNum}
                                                type="button"
                                                className={`day-pill-btn ${activeResultDay === day.dayNum ? 'active' : ''}`}
                                                onClick={() => setActiveResultDay(day.dayNum)}
                                            >
                                                Jour {day.dayNum}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="planner-days-list">
                                    {generatedPlan.dayPlans.filter(day => day.dayNum === activeResultDay).map((day) => (
                                        <div className="planner-day-card animate-fade-in" key={day.dayNum}>
                                            
                                            {/* Card Day Header */}
                                            <div className="planner-day-header">
                                                <div className="planner-day-number">Jour {day.dayNum} — Carnet de route</div>
                                                <div className="planner-day-total">
                                                    <LuWallet size={14} />
                                                    Estimation du jour : ~ {day.dayTotal.toLocaleString()} DH
                                                </div>
                                            </div>

                                            {/* Timeline Periods */}
                                            <div className="planner-day-timeline">
                                                
                                                {/* Morning Period */}
                                                {day.morning.length > 0 && (
                                                    <div className="planner-period morning">
                                                        <div className="planner-period-label morning">
                                                            <LuSun size={15} /> Matinée
                                                        </div>
                                                        <div className="planner-period-items">
                                                            {day.morning.map((item, idx) => {
                                                                const isFlipping = flipKey === `${day.dayNum}-morning-${idx}`;
                                                                return (
                                                                    <div className={`planner-item-card ${isFlipping ? 'flipping' : ''}`} key={idx}>
                                                                        <div className="planner-item-media">
                                                                            <span className="planner-item-badge">{CATEGORY_WEIGHTS[item.category]?.label}</span>
                                                                            <span className="planner-item-rating">
                                                                                <LuStar size={12} fill="#f59e0b" style={{ border: 'none' }} /> {item.rating.toFixed(1)}
                                                                            </span>
                                                                            <img src={item.img} alt={item.label} className="planner-item-img" />
                                                                            
                                                                            <button
                                                                                type="button"
                                                                                className="item-swap-alternative-btn"
                                                                                onClick={() => handleSwapItem(day.dayNum, 'morning', idx)}
                                                                                title="Changer d'attraction"
                                                                            >
                                                                                <LuRefreshCw size={14} />
                                                                            </button>
                                                                        </div>
                                                                        <div className="planner-item-body">
                                                                            <h4 className="planner-item-title">{item.label}</h4>
                                                                            <p className="planner-item-desc">{item.desc}</p>
                                                                            <div className="planner-item-footer">
                                                                                <span className="planner-item-cost">
                                                                                    {item.cost > 0 ? `${item.cost} DH` : 'Gratuit'}
                                                                                </span>
                                                                                <span className="planner-item-time">
                                                                                    <LuClock size={12} /> Matin
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Afternoon Period */}
                                                {day.afternoon.length > 0 && (
                                                    <div className="planner-period afternoon">
                                                        <div className="planner-period-label afternoon">
                                                            <LuSunset size={15} /> Après-midi
                                                        </div>
                                                        <div className="planner-period-items">
                                                            {day.afternoon.map((item, idx) => {
                                                                const isFlipping = flipKey === `${day.dayNum}-afternoon-${idx}`;
                                                                return (
                                                                    <div className={`planner-item-card ${isFlipping ? 'flipping' : ''}`} key={idx}>
                                                                        <div className="planner-item-media">
                                                                            <span className="planner-item-badge">{CATEGORY_WEIGHTS[item.category]?.label}</span>
                                                                            <span className="planner-item-rating">
                                                                                <LuStar size={12} fill="#f59e0b" style={{ border: 'none' }} /> {item.rating.toFixed(1)}
                                                                            </span>
                                                                            <img src={item.img} alt={item.label} className="planner-item-img" />
                                                                            
                                                                            <button
                                                                                type="button"
                                                                                className="item-swap-alternative-btn"
                                                                                onClick={() => handleSwapItem(day.dayNum, 'afternoon', idx)}
                                                                                title="Changer d'attraction"
                                                                            >
                                                                                <LuRefreshCw size={14} />
                                                                            </button>
                                                                        </div>
                                                                        <div className="planner-item-body">
                                                                            <h4 className="planner-item-title">{item.label}</h4>
                                                                            <p className="planner-item-desc">{item.desc}</p>
                                                                            <div className="planner-item-footer">
                                                                                <span className="planner-item-cost">
                                                                                    {item.cost > 0 ? `${item.cost} DH` : 'Gratuit'}
                                                                                </span>
                                                                                <span className="planner-item-time">
                                                                                    <LuClock size={12} /> Midi
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Evening Period */}
                                                {day.evening.length > 0 && (
                                                    <div className="planner-period evening">
                                                        <div className="planner-period-label evening">
                                                            <LuMoon size={15} /> Soirée & Nuit
                                                        </div>
                                                        <div className="planner-period-items">
                                                            {day.evening.map((item, idx) => {
                                                                const isFlipping = flipKey === `${day.dayNum}-evening-${idx}`;
                                                                return (
                                                                    <div className={`planner-item-card ${isFlipping ? 'flipping' : ''}`} key={idx}>
                                                                        <div className="planner-item-media">
                                                                            <span className="planner-item-badge">{CATEGORY_WEIGHTS[item.category]?.label}</span>
                                                                            <span className="planner-item-rating">
                                                                                <LuStar size={12} fill="#f59e0b" style={{ border: 'none' }} /> {item.rating.toFixed(1)}
                                                                            </span>
                                                                            <img src={item.img} alt={item.label} className="planner-item-img" />
                                                                            
                                                                            <button
                                                                                type="button"
                                                                                className="item-swap-alternative-btn"
                                                                                onClick={() => handleSwapItem(day.dayNum, 'evening', idx)}
                                                                                title="Changer d'attraction"
                                                                            >
                                                                                <LuRefreshCw size={14} />
                                                                            </button>
                                                                        </div>
                                                                        <div className="planner-item-body">
                                                                            <h4 className="planner-item-title">{item.label}</h4>
                                                                            <p className="planner-item-desc">{item.desc}</p>
                                                                            <div className="planner-item-footer">
                                                                                <span className="planner-item-cost">
                                                                                    {item.cost > 0 ? `${item.cost} DH` : 'Inclus'}
                                                                                    {item.category === 'hotels' && <span>/nuit</span>}
                                                                                </span>
                                                                                <span className="planner-item-time">
                                                                                    <LuClock size={12} /> Soir
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB 2: GEOGRAPHIC CIRCUIT ROUTE MAP */}
                        {activeTab === 'map' && (
                            <div className="portal-pane map-tab-layout animate-fade-in">
                                <div className="day-route-map-card">
                                    <div className="day-route-map-header">
                                        <div className="day-route-map-title">
                                            <LuMap size={18} />
                                            <span>Carte interactive de l'itinéraire - Jour {activeResultDay}</span>
                                        </div>
                                        <div className="day-map-selector-chips">
                                            {generatedPlan.dayPlans.map(d => (
                                                <button
                                                    key={d.dayNum}
                                                    type="button"
                                                    className={`day-map-chip ${activeResultDay === d.dayNum ? 'active' : ''}`}
                                                    onClick={() => setActiveResultDay(d.dayNum)}
                                                >
                                                    J{d.dayNum}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ── REAL LEAFLET MAP ── */}
                                    <div className="day-route-map-viewport" style={{ padding: 0, background: 'transparent', border: 'none', overflow: 'hidden' }}>
                                        {(() => {
                                            const currentDayData = generatedPlan.dayPlans.find(d => d.dayNum === activeResultDay);
                                            return (
                                                <PlannerMap
                                                    city={generatedPlan.city}
                                                    dayData={currentDayData}
                                                    activeDay={activeResultDay}
                                                />
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* List of Stops on the Route */}
                                <div className="map-sidebar-stops-list">
                                    <h4>📍 Étape(s) du jour</h4>
                                    <div className="stops-list-container">
                                        {(() => {
                                            const currentDayData = generatedPlan.dayPlans.find(d => d.dayNum === activeResultDay);
                                            if (!currentDayData) return null;
                                            const points = [
                                                ...currentDayData.morning,
                                                ...currentDayData.afternoon,
                                                ...currentDayData.evening
                                            ];
                                            return points.map((pt, idx) => (
                                                <div className="stop-item-row" key={idx}>
                                                    <div className="stop-num" style={{ borderColor: CATEGORY_WEIGHTS[pt.category]?.color }}>{idx + 1}</div>
                                                    <div className="stop-details">
                                                        <h5>{pt.label.replace(/Dîner Saveur Locale — /, '')}</h5>
                                                        <span>{CATEGORY_WEIGHTS[pt.category]?.label} · {pt.cost > 0 ? `${pt.cost} DH` : 'Gratuit'}</span>
                                                    </div>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: FINANCIAL BUDGET ANALYSIS */}
                        {activeTab === 'budget' && (
                            <div className="portal-pane budget-tab-layout animate-fade-in">
                                <div className="planner-budget-breakdown">
                                    <h3 className="planner-section-title">
                                        <LuTrendingUp size={20} /> Répartition du Budget Estimé
                                    </h3>
                                    <div className="planner-budget-bars">
                                        {Object.entries(generatedPlan.budgetMap).map(([key, amount]) => {
                                            const cat = CATEGORY_WEIGHTS[key];
                                            const Icon = cat.icon;
                                            const pct = Math.round((amount / generatedPlan.totalBudget) * 100);
                                            return (
                                                <div className="planner-budget-bar-row" key={key}>
                                                    <div className="planner-budget-bar-label">
                                                        <div className="planner-budget-bar-icon" style={{ background: cat.color + '15', color: cat.color }}>
                                                            <Icon size={16} />
                                                        </div>
                                                        <span>{cat.label}</span>
                                                    </div>
                                                    <div className="planner-budget-bar-track">
                                                        <div
                                                            className="planner-budget-bar-fill"
                                                            style={{ width: `${pct}%`, background: cat.color }}
                                                        />
                                                    </div>
                                                    <div className="planner-budget-bar-amount">
                                                        <strong>{amount.toLocaleString()} DH</strong>
                                                        <span>{pct}% du budget</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Budget Tips Card */}
                                <div className="budget-advice-card">
                                    <h4>💡 Conseils de Gestion Financière</h4>
                                    <ul>
                                        <li><strong>Pourboires :</strong> Courants au Maroc. Prévoyez 5 à 10% dans les restaurants à service complet.</li>
                                        <li><strong>Taxis de Ville :</strong> Demandez toujours l'activation du compteur ("compteur s'il vous plaît") ou fixez le prix à l'avance pour éviter les malentendus.</li>
                                        <li><strong>Négociation :</strong> Dans les souks, négocier fait partie de la culture. Restez toujours courtois, souriant et proposez environ la moitié du prix initial pour démarrer la discussion.</li>
                                        <li><strong>Monnaie locale :</strong> Conservez toujours des billets de 10, 20 et 50 DH sur vous pour vos petits achats quotidiens.</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: PREPARATIONS & WEATHER */}
                        {activeTab === 'prep' && (
                            <div className="portal-pane prep-tab-layout animate-fade-in">
                                {/* Weather widget */}
                                {weather && (
                                    <div className="companion-weather-card">
                                        <div className="weather-icon-wrapper">
                                            <LuCloudSun size={32} />
                                        </div>
                                        <div className="weather-details">
                                            <span className="w-title">Météo moyenne ({generatedPlan.city})</span>
                                            <h3>{weather.temp}</h3>
                                            <p>{weather.vibe} · {weather.sun} · Meilleure saison conseillée : <strong>{weather.bestSeason}</strong></p>
                                        </div>
                                    </div>
                                )}

                                {/* Packing assistant */}
                                <div className="companion-packing-card">
                                    <h3>🧳 Assistant Bagages ({generatedPlan.vibe})</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'rgba(28, 28, 35, 0.6)', marginBottom: '16px' }}>Cochez vos bagages au fur et à mesure de vos préparatifs :</p>
                                    
                                    <div className="packing-list-checkers">
                                        {packingList.map(item => {
                                            const isChecked = !!packingChecked[item.id];
                                            return (
                                                <div 
                                                    key={item.id} 
                                                    className={`packing-item-row ${isChecked ? 'checked' : ''}`}
                                                    onClick={() => handlePackingCheck(item.id)}
                                                >
                                                    <div className="packing-checkbox">
                                                        {isChecked && <LuCheck size={12} />}
                                                    </div>
                                                    <div className="packing-item-texts">
                                                        <strong>{item.label}</strong>
                                                        <span>{item.desc}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 5: DARIJA HANDBOOK */}
                        {activeTab === 'cultural' && (
                            <div className="portal-pane cultural-tab-layout animate-fade-in">
                                <div className="planner-darija-handbook-panel">
                                    <div className="darija-panel-header">
                                        <LuCompass size={24} />
                                        <div>
                                            <h3>🗣️ Lexique Darija & Guide Culturel</h3>
                                            <p>Apprenez quelques expressions pour enrichir le dialogue et témoigner votre respect.</p>
                                        </div>
                                    </div>
                                    <div className="darija-cards-container">
                                        {DARIJA_PHRASES.map((phrase, idx) => (
                                            <div className="darija-phrase-card" key={idx}>
                                                <div className="d-card-front">
                                                    <span className="darija-arabic-word">{phrase.word}</span>
                                                    <span className="darija-phonetic">"{phrase.phonetic}"</span>
                                                </div>
                                                <div className="d-card-divider" />
                                                <div className="d-card-back">
                                                    <strong className="darija-translate">{phrase.translation}</strong>
                                                    <p className="darija-usage">{phrase.usage}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Action Buttons */}
                    <div className="planner-result-actions">
                        <button className="planner-action-btn secondary" onClick={handleReset}>
                            <LuRefreshCw size={16} /> Ajuster Mon Plan
                        </button>
                        
                        <button 
                            className={`planner-action-btn ${saveSuccess ? 'success' : 'save'}`}
                            onClick={handleSavePlan}
                            disabled={isSaving}
                            style={{
                                background: saveSuccess 
                                    ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' 
                                    : 'linear-gradient(135deg, #c0241a 0%, #8b0000 100%)',
                                color: '#ffffff',
                                boxShadow: saveSuccess 
                                    ? '0 8px 20px rgba(22, 163, 74, 0.25)' 
                                    : '0 8px 20px rgba(192, 36, 26, 0.3)',
                                opacity: isSaving ? 0.8 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: isSaving ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {isSaving ? (
                                <>
                                    <span className="planner-spinner" style={{ 
                                        width: '16px', 
                                        height: '16px', 
                                        borderRadius: '50%', 
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderTopColor: '#ffffff',
                                        animation: 'spin 1s linear infinite',
                                        display: 'inline-block'
                                    }} />
                                    Enregistrement...
                                </>
                            ) : saveSuccess ? (
                                <>
                                    <LuCircleCheck size={18} /> Plan Enregistré !
                                </>
                            ) : (
                                <>
                                    <LuSparkles size={18} /> Enregistrer ce Plan
                                </>
                            )}
                        </button>

                        <button className="planner-action-btn primary" onClick={() => window.print()}>
                            <LuPrinter size={16} /> Imprimer Mon Carnet
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
