importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCAH3JSPltdvmP-AaPG7pJaqlsFe1rCF9A",
    authDomain: "mirai-logistics.firebaseapp.com",
    projectId: "mirai-logistics",
    storageBucket: "mirai-logistics.appspot.com",
    messagingSenderId: "165717162890",
    appId: "1:165717162890:web:f73655ac23dfe90369a673",
    measurementId: "G-6WPYJKBEGL"
});
const messaging = firebase.messaging();