import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from 'fs';

const firebaseConfig = {
  apiKey: "AIzaSyBjF8-LZ8zxnZgaeYUud_17JZIfLTWT8Qg",
  authDomain: "morrovista-agence.firebaseapp.com",
  projectId: "morrovista-agence",
  storageBucket: "morrovista-agence.firebasestorage.app",
  messagingSenderId: "171936152266",
  appId: "1:171936152266:web:b0f12ab2086944b58d1233",
  measurementId: "G-ZX3K0PQC3X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const collections = [
    'hotels', 'restaurant', 'localServices', 'tours', 
    'city', 'PhoneN', 'place', 'siteComments', 
    'stadium', 'transport', 'utilisateurs'
];

async function exportData() {
    const allData = {};

    for (const collName of collections) {
        console.log(`Exporting ${collName}...`);
        try {
            const querySnapshot = await getDocs(collection(db, collName));
            allData[collName] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log(`Successfully exported ${allData[collName].length} documents from ${collName}.`);
        } catch (error) {
            console.error(`Error exporting ${collName}:`, error.message);
            allData[collName] = [];
        }
    }

    fs.writeFileSync('data_export.json', JSON.stringify(allData, null, 2));
    console.log('Export complete! Data saved to data_export.json');
}

exportData();
