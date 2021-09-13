import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {

  constructor(
    private updates: SwUpdate,
    public alertController: AlertController
              //private utils: UtilsService
    ) {
    this.updates.available.subscribe(event => {
      this.showAppUpdateAlert();
    });
  }

  async showAppUpdateAlert() {
    const header = 'Actualización disponible!';
    const message = 'Confirma la actualización.';

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header,
      message,
      buttons: [
        {
          text: 'No, gracias.',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si, claro!',
          handler: () => {
            console.log('Actualizando ...');
            this.updates.activateUpdate().then(() => document.location.reload());
          }
        }
      ]
    });
    await alert.present();
  }

}
