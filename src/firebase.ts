import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Bucket } from "@google-cloud/storage"; // import type

import admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
import path from "path";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZ8Iw1C9uM0yz9RN6faGz11TEfXxd4158",
  authDomain: "superherodatabase-a38b1.firebaseapp.com",
  projectId: "superherodatabase-a38b1",
  storageBucket: "superherodatabase-a38b1.firebasestorage.app",
  messagingSenderId: "328100113974",
  appId: "1:328100113974:web:134144b172f19fe2ca3297",
  measurementId: "G-MBV17WJGKX",
};

const serviceAccount = path.resolve(
  "superherodatabase-a38b1-firebase-adminsdk-fbsvc-53fcad6686.json"
);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "superherodatabase-a38b1.firebasestorage.app", // ⚠️ must be .appspot.com
});
export const bucket: Bucket = getStorage().bucket() as any;
// Initialize Firebase
