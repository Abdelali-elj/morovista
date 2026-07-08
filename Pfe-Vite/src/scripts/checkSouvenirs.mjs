import { db, auth } from '../firebase.js';
import { collection, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

async function check() {
    try {
        console.log("Authenticating...");
        await signInWithEmailAndPassword(auth, "boss@morovista.com", "Admin123456");
        console.log("Authenticated!");

        console.log("Reading souvenirs...");
        const snapshot = await getDocs(collection(db, 'souvenirs'));
        console.log(`Found ${snapshot.docs.length} souvenirs:`);
        snapshot.docs.forEach(doc => {
            console.log(`ID: ${doc.id} -> Name: ${doc.data().name}, Image: ${doc.data().image}`);
        });
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

check();
