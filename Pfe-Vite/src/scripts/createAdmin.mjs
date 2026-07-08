import { db, auth } from '../firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

async function defineAdmin() {
    try {
        const email = "boss@morovista.com";
        const password = "Admin123456";
        
        console.log("Creation du compte...");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        
        console.log("Enregistrement dans la base Firestore...");
        const newUser = {
            email: email,
            name: "Super Admin",
            userType: "admin",
            id: uid
        };
        
        await setDoc(doc(db, 'utilisateurs', uid), newUser);
        console.log("=========================================");
        console.log("SUCCESS! Compte Admin créé avec succès !");
        console.log(`Email : ${email}`);
        console.log(`Password : ${password}`);
        console.log("=========================================");
        process.exit(0);
    } catch (error) {
        console.error("Erreur :", error.message);
        process.exit(1);
    }
}

defineAdmin();
