export const environment = {
  production: true,
  firebase: {
    apiKey: 'AIzaSyBmbSgXrS29Pmw8q3ISWY3eH5vkwHMxWqU',
    authDomain: 'vamos-al-huerto.firebaseapp.com',
    databaseURL: 'https://vamos-al-huerto-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'vamos-al-huerto',
    storageBucket: 'vamos-al-huerto.appspot.com',
    messagingSenderId: '1061779991576',
    appId: '1:1061779991576:web:a82ec329b746b3d2cbe76d',
    measurementId: 'G-P8RSMCE5T0'
  },
  // coje el idioma del localstorage, si no hay coje español por defecto
  language: localStorage.getItem('language') || 'Español'
};
