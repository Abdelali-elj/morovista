import { db, auth } from '../firebase.js';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

const SOUVENIRS_TO_ADD = [
    {
        name: 'Premium Leather Pouf — Tan Babouches',
        tag: 'Cuir & Babouches',
        category: 'Artisanat',
        origin: 'Marrakech',
        price: 280,
        badge: '100% Cuir',
        description: 'Handcrafted from genuine premium goat leather, naturally cured in the ancient tanneries of Marrakech. Soft, durable, and stitched with traditional silk thread.',
        image: '/img1.jpeg'
    },
    {
        name: 'Fassi Handcrafted Tajine',
        tag: 'Céramique & Tajine',
        category: 'Cuisine & Art',
        origin: 'Fès',
        price: 190,
        badge: 'Bestseller',
        description: 'An authentic clay tajine hand-painted by Fassi pottery artists. Designed with heat-resistant clay to slow-cook delicious, aromatic tagines on embers.',
        image: '/img2.jpeg'
    },
    {
        name: 'Berber Hand-Woven Kilim Rug',
        tag: 'Tapis & Textiles',
        category: 'Décoration',
        origin: 'Ouarzazate',
        price: 850,
        badge: 'Pièce Unique',
        description: 'Flat-woven kilim rug representing tribal symbols and ancestral tales of High Atlas Berber families. Hand-dyed with natural saffron and madder roots.',
        image: '/img3.jpeg'
    },
    {
        name: 'Engraved Moroccan Teapot',
        tag: 'Thé & Service',
        category: 'Tradition',
        origin: 'Casablanca',
        price: 320,
        badge: 'Premium',
        description: 'A traditional brass teapot with hand-hammered arabesque designs. Perfect for serving the signature Moroccan mint tea with a touch of elegance.',
        image: '/img4.jpeg'
    }
];

async function populate() {
    try {
        console.log("Authenticating as admin...");
        try {
            await signInWithEmailAndPassword(auth, "boss@morovista.com", "Admin123456");
            console.log("Authenticated successfully!");
        } catch (authError) {
            console.warn("Authentication skipped or failed (will try unauthenticated):", authError.message);
        }

        console.log("Cleaning up existing souvenirs in Firestore...");
        const snapshot = await getDocs(collection(db, 'souvenirs'));
        for (const docSnap of snapshot.docs) {
            await deleteDoc(doc(db, 'souvenirs', docSnap.id));
        }
        console.log("Existing souvenirs cleaned up.");

        console.log("Adding new high-fidelity souvenirs to Firestore...");
        for (const product of SOUVENIRS_TO_ADD) {
            const docRef = await addDoc(collection(db, 'souvenirs'), product);
            console.log(`Added product: ${product.name} (ID: ${docRef.id})`);
        }

        console.log("=========================================");
        console.log("SUCCESS! Souvenirs populated successfully!");
        console.log("=========================================");
        process.exit(0);
    } catch (e) {
        console.error("Error populating souvenirs:", e);
        process.exit(1);
    }
}

populate();
