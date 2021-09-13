// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
