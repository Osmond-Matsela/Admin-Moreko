import admin from "firebase-admin";
const serviceAccount = require("../../service-keys.json");
// Use existing app if initialized, otherwise initialize
const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();

export const adminDb = admin.firestore(app);