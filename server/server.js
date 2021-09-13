var sys = require("util");
var admin = require("firebase-admin");
var firebase = require("firebase");
var serviceAccount = require("./vamos-al-huerto-firebase-adminsdk-x56q3-dba412de2a.json");

var config = {
  apiKey: 'AIzaSyBmbSgXrS29Pmw8q3ISWY3eH5vkwHMxWqU',
  authDomain: 'vamos-al-huerto.firebaseapp.com',
  databaseURL: 'https://vamos-al-huerto-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'vamos-al-huerto',
  storageBucket: 'vamos-al-huerto.appspot.com',
  messagingSenderId: '1061779991576',
  appId: '1:1061779991576:web:a82ec329b746b3d2cbe76d',
  measurementId: 'G-P8RSMCE5T0'
}


async function main() {
  // init firebase (acceso a la db)
  await firebase.initializeApp(config);

  // init admin (messaging)
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://vamos-al-huerto-default-rtdb.europe-west1.firebasedatabase.app"
  });
  
  // autentificacion
  var email = "admin@vamosalhuerto.org";
  var password = "000000";
  await firebase.auth().signInWithEmailAndPassword(email, password);
  console.log("autentificado");
  
  // recoger tokens
  var refToken = await firebase.database().ref('token');
  await refToken.on('child_added', async function(snapshot) {
    console.log("Encontrado token: ", snapshot.val().toString().substring(0,100) + '...');
    await enviarMsg(snapshot.key, snapshot.val().toString(),refToken);

  });
}

async function enviarMsg (key, token, ref) {
  // detectar nuevas especies en la tabla
  var dbRef = await firebase.database().ref('especie');
  var newItems = false
  await dbRef.on('child_added', async function(snapshot) {
    if (!newItems) { return }
    especie = snapshot.toJSON();
    console.log("Añadida especie: ", especie.nombre);

    // "notification" con nombre especie nueva y "data" con mombre y descripcion si la hay
    var payload = {
      notification: {
        title: "Añadida especie nueva",
        body: "Nueva especie: "+especie.nombre.toString()
      },
      data: {
        nombre: especie.nombre,
        descripcion: (especie.descripcion) ? especie.descripcion : '',
      }
    };
    // enviar mensaje
    await admin.messaging().sendToDevice(token, payload)
      .then(async function(response) {
          if (response.results[0].error) {
              console.log("Firebase error. Borrando:", token.substring(0,100) + '...');//, response.results[0].error);
              // borrar token de la bd
              ref.child(key).remove();
          } else {
            console.log("Éxito enviando mensaje a ", token.substring(0,100) + '...');
          }
      })
      .catch(function(error) {
          console.log("Error enviando mensaje:", error);
      });

  });

  await dbRef.once('value', function() {
    newItems = true;
  })
}

main();

