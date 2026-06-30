/* eslint-env serviceworker */
/* global firebase */

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyBmBIazQntYBp8Ljr5IeHekFg6AKa3F-Ng",
  authDomain: "primesys-track-fcm.firebaseapp.com",
  databaseURL: "https://primesys-track-fcm.firebaseio.com",
  projectId: "primesys-track-fcm",
  storageBucket: "primesys-track-fcm.firebasestorage.app",
  messagingSenderId: "740167304232",
  appId: "1:740167304232:web:d9f918b5bc12042a06211d"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});