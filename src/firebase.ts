import { Bucket } from "@google-cloud/storage";
import admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
import path from "path";

const serviceAccount = path.resolve(
  "secrets/superherodatabase-a38b1-firebase-adminsdk-fbsvc-53fcad6686.json"
);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "superherodatabase-a38b1.firebasestorage.app",
});
export const bucket: Bucket = getStorage().bucket() as any;
