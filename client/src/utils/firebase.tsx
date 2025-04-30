import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: 'AIzaSyC1J5BztS7F0f9JnbLH5cX6e1K1bL2sDZM',
    authDomain: "bytebeasts-test.firebaseapp.com",
    projectId: "bytebeasts-test",
    storageBucket: "bytebeasts-test.firebasestorage.app",
    messagingSenderId: "1006066833674",
    appId: "1:1006066833674:web:23c4ce8b06a634bafc02f3",
    measurementId: "G-JC5X3YXGQE"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);