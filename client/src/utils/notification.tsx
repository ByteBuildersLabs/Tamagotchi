import { messaging } from "./firebase.tsx";
import { getToken } from "firebase/messaging";
import { Account } from "starknet";



export async function requestNotificationPermission(account: any,client:any,playerAddress: string) {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {

      const token = await getToken(messaging, {
        vapidKey: "BDxvVGSyhGggzz7fxjb4pTrpBAiK6Aa4pIprLCu14ZvsD-EjexIFABznJpW0lXV5A57OMgqclcn8-SPgeilKS2g",
      });
      console.log("Notification permission granted. FCM Token:", token);
      console.log("Player Address:", playerAddress);
      await client.player.emitPlayerPushToken(account as Account, token);
    } else {
      console.log("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
}