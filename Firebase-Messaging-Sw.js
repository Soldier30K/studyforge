// firebase-messaging-sw.js - MUST be at the root, next to StudyForge HTML
// This is what shows the notification when the tab is CLOSED.
// Uses Firebase compat SDK so it works in a service worker (no modules).
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCzZEtP0VPAT1yLDoyx3Zawj4xqtj692JQ",
  authDomain: "studyforge-d79bc.firebaseapp.com",
  projectId: "studyforge-d79bc",
  storageBucket: "studyforge-d79bc.firebasestorage.app",
  messagingSenderId: "363581171749",
  appId: "1:363581171749:web:cb18409dbb4645fb4a77cc"
});

const messaging = firebase.messaging();

// Background push (tab closed / browser in background)
messaging.onBackgroundMessage(function(payload) {
  const title = (payload.notification && payload.notification.title) || 'StudyForge — Quest Due';
  const body = (payload.notification && payload.notification.body) || 'A custom quest is due!';
  const options = {
    body: body,
    icon: 'StudyForge_Icon.png',
    badge: 'StudyForge_Icon.png',
    data: payload.data || {},
    tag: (payload.data && payload.data.questId) ? 'sf-quest-' + payload.data.questId : 'sf-quest'
  };
  self.registration.showNotification(title, options);
});

// Tap notification -> open StudyForge
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
