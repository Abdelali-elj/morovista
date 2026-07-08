import { db, auth } from '../firebase.js';
import { doc, updateDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

const SOUVENIRS_DATA = {
    "UPg4nVoifoGxGNkDhpYR": {
        name: 'MoroVista Mosaic Tea Mug',
        category: 'Mugs & Céramique',
        origin: 'Maroc',
        price: 149,
        badge: 'Édition Limitée',
        description: 'Mug en céramique orné de motifs zellige traditionnels marocains — bleu, rouge et turquoise — livré dans son écrin MoroVista. Livré avec son filtre infuseur et son sous-verre assorti, idéal pour savourer un thé à la menthe.',
        image: '/img1.jpeg',
        tag: 'Mugs & Artisanat',
    },
    "bDEHjI7Wu06W1hmsaw9c": {
        name: 'Porte-Clés MoroVista',
        category: 'Accessoires',
        origin: 'Maroc',
        price: 79,
        badge: 'Bestseller',
        description: "Porte-clés en métal émaillé aux couleurs du Maroc : palmiers, pin de localisation rouge et montagnes enneigées avec l'inscription MOROVISTA. Un souvenir solide et élégant à emporter partout.",
        image: '/img2.jpeg',
        tag: 'Porte-Clés & Bijoux',
    },
    "uHYXNFaUuQASG8r4P7CK": {
        name: 'Mystery Box — MoroVista',
        category: 'Coffrets Cadeaux',
        origin: 'Maroc',
        price: 399,
        badge: 'Surprise !',
        description: "Une boîte mystère de luxe ornée de motifs arabesques dorés découpés à la main. À l'intérieur : une sélection surprise d'artisanat authentique marocain choisi par nos artisans. Idéal comme cadeau.",
        image: '/img3.jpeg',
        tag: 'Coffrets & Cadeaux',
    },
    "SnrU1LTHCoJRnkujl1q6": {
        name: '"Go To Morocco" Mug',
        category: 'Mugs Humour',
        origin: 'Maroc',
        price: 99,
        badge: 'Fun & Voyage',
        description: '"I Don\'t Need Therapy, I Just Need To Go To Morocco" — le mug parfait pour tout voyageur amoureux du Maroc. Un cadeau original et drôle avec le logo MoroVista.',
        image: '/img4.jpeg',
        tag: 'Mugs & Humour',
    }
};

async function update() {
    try {
        console.log("Authenticating...");
        await signInWithEmailAndPassword(auth, "boss@morovista.com", "Admin123456");
        console.log("Authenticated!");

        console.log("Updating souvenirs in Firestore...");
        for (const [id, data] of Object.entries(SOUVENIRS_DATA)) {
            console.log(`Updating document ID: ${id} ...`);
            const docRef = doc(db, 'souvenirs', id);
            await updateDoc(docRef, data);
            console.log(`Updated document ID: ${id} successfully!`);
        }
        console.log("All souvenirs updated successfully!");
        process.exit(0);
    } catch (e) {
        console.error("Error updating souvenirs:", e);
        process.exit(1);
    }
}

update();
