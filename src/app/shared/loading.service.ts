import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {


  constructor(public loadingController: LoadingController) {  }

  // Simple loader
  async presentLoading() {
    const loading = await this.loadingController.create({
        message: 'Cargando...'
    });
    await loading.present();
    //console.log('Open Loader');
  }

  // Dismiss loader
  async dismissLoading() {
    await this.loadingController.dismiss();
    //console.log('Close Loader');

  }

  /* // Simple loader
  async presentLoading() {
    this.loadingController.create({
      message: 'Cargando...'
    }).then((response) => {
        response.present();
    });
  }

  // Dismiss loader
  async dismissLoading() {
    this.loadingController.dismiss().then((response) => {
      console.log('Loader closed!', response);
    }).catch((err) => {
      console.log('Error occured : ', err);
    });
  } */

}
