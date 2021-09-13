importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-messaging.js');
//require('./environments/environment';

// firebase.initializeApp(environment.firebase);
// var messaging = firebase.messaging();


firebase.initializeApp({
  apiKey: 'AIzaSyBmbSgXrS29Pmw8q3ISWY3eH5vkwHMxWqU',
  authDomain: 'vamos-al-huerto.firebaseapp.com',
  databaseURL: 'https://vamos-al-huerto-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'vamos-al-huerto',
  storageBucket: 'vamos-al-huerto.appspot.com',
  messagingSenderId: '1061779991576',
  appId: '1:1061779991576:web:a82ec329b746b3d2cbe76d',
});
var messaging = firebase.messaging();
