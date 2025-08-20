// backend/src/config/firebaseAdmin.js
const admin = require("firebase-admin");
const path = require("path");

// service account key file (download from Firebase console -> Project Settings -> Service Accounts)
const serviceAccount = require(path.join(__dirname, "../../serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;