import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
  } from '@capacitor/push-notifications';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { tap } from 'rxjs/operators';
import { AlertController, Platform, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  platform: Platform;
  token = null;

  constructor(
    platform: Platform,
    private db: AngularFireDatabase,
    private afMessaging: AngularFireMessaging,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
    ) {
    this.platform = platform;
  }

  async initPush() {
    //console.log(this.platform.platforms());
    if (this.platform.is('pwa')) {
      console.log('PWA!!');
      const toast = await this.toastCtrl.create({
        message: 'PWA!!',
        duration: 2000,
      });
      toast.present();
      this.setPwaPushNotifications();
    } else if (this.platform.is('hybrid')) {
      console.log('Hybrid!!');
      this.setAndroidPushNotifications();
    } else if (this.platform.is('mobileweb')) {
      console.log('Mobile web!!');
    }
  }

  setPwaPushNotifications() {
    this.requestPermission();
  }

  requestPermission() {
    this.requestPermissionService().subscribe(
      async (token) => {
        console.log('Got your token: ' + token);
        // const toast = await this.toastCtrl.create({
        //   message: 'Got your token: ' + token,
        //   duration: 2000,
        // });
        // toast.present();
        this.listenForMessages();
      },
      async (err) => {
        console.log('Error getting token');
        // const alert = await this.alertCtrl.create({
        //   header: 'Error',
        //   message: err,
        //   buttons: ['OK'],
        // });
        // await alert.present();
      }
    );
  }

  requestPermissionService() {
    return this.afMessaging.requestToken.pipe(
      tap(async (token: string) => {
        const existe = await this.existeToken(token);
        if (!existe) {
          await this.db.database.ref().child('token').ref.push(token);
          //console.log('Push registration success, token: ' + token);
        } else {
          //console.log('ya existe token');
        }
      })
    );
  }

  listenForMessages() {
    this.getMessages().subscribe(async (msg: any) => {
      //console.log('listenForMessages');
      const alert = await this.alertCtrl.create({
        header: msg.notification.title,
        subHeader: msg.notification.body,
        message: msg.data.info,
        buttons: ['OK'],
      });
      await alert.present();
    });
  }

  getMessages() {
    return this.afMessaging.messages;
  }

  async deleteToken() {
    this.deleteTokenService();
    console.log('Token removed');
  }

  deleteTokenService() {
    if (this.token) {
      this.afMessaging.deleteToken(this.token);
      this.token = null;
    }
  }

  async setAndroidPushNotifications() {
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(async result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        //PushNotifications.register();
        await PushNotifications.addListener('registration', async (token: Token) => {
          const existe = await this.existeToken(token.value);
          console.log('existe:', existe);

          if (!existe) {
            await this.db.database.ref().child('token').ref.push(token.value);
            console.log('Push registration success, token: ' + token.value);
          } else {
            //console.log('ya existe token');
          }
        });

        PushNotifications.addListener('registrationError', (error: any) => {
          console.log('Error on registration: ' + JSON.stringify(error));
        });

        PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotificationSchema) => {
          const alert = await this.alertCtrl.create({
            header: 'Notificación:',
            message: notification.title + '\n' + notification.body,
            buttons: ['OK'],
          });
          await alert.present();

          //alert(notification.title + '\n' + notification.body);
          console.log('pushNotificationReceived:', notification);
        });

        PushNotifications.addListener('pushNotificationActionPerformed', async (action: ActionPerformed) => {
          let msg = '\t• ' + action.notification.data.nombre;
          if (action.notification.data.descripcion) {
              msg += '\n\t• ' +  action.notification.data.descripcion;
          }
          //alert(msg);
          const alert = await this.alertCtrl.create({
            header: 'Detalles:',
            message: msg,
            buttons: ['OK'],
          });
          await alert.present();
          console.log('pushNotificationActionPerformed:', action.notification.data);
        });

      } else {
        console.log('Permiso de Push no aceptado.');
      }
    });
  }

  async existeToken(token: string): Promise<boolean> {
    const ref = this.db.database.ref().child('token').orderByValue().equalTo(token);
    let encontrado = false;
    return ref.once('value').then( (snapshot) => {
      snapshot.forEach(data => {
        const tokenBd = data.val();
        //console.log('token-data:', tokenBd);
        encontrado = encontrado || (tokenBd === token);
      });
      return encontrado;
    });
  }

}
