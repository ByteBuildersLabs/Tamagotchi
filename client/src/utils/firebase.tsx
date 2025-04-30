import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
const FIREBASE_KEY=import.meta.env.VITE_FIREBASE_KEY;

const firebaseConfig = {
    apiKey: FIREBASE_KEY,
    authDomain: "bytebeasts-test.firebaseapp.com",
    projectId: "bytebeasts-test",
    storageBucket: "bytebeasts-test.firebasestorage.app",
    messagingSenderId: "1006066833674",
    appId: "1:1006066833674:web:23c4ce8b06a634bafc02f3",
    measurementId: "G-JC5X3YXGQE"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);