import { messaging } from "./firebase.tsx";
import { getToken } from "firebase/messaging";
import { Account } from "starknet";
const FIREBASE_VAPID_KEY=import.meta.env.VITE_FIREBASE_VAPID_KEY;


export async function requestNotificationPermission(account: any,client:any) {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {

      const token = await getToken(messaging, {
        vapidKey: FIREBASE_VAPID_KEY,
      });
      console.log("Notification permission granted. FCM Token:", token);
      await client.player.emitPlayerPushToken(account as Account, token);
    } else {
      console.log("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
}