import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

import { LoadingService } from '../shared/loading.service';
import { Parcela, Planta } from '../interfaces';
import { ParcelaService } from './parcela-service.service';


@Component({
  selector: 'app-parcela',
  templateUrl: './parcela.page.html',
  styleUrls: ['./parcela.page.scss'],
})
export class ParcelaPage implements OnInit {
  nombre: string;
  alto: number;
  ancho: number;
  parcelas: Parcela[];
  lat: number;
  lng: number;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private parcelaService: ParcelaService,
    private router: Router,
    private loadingService: LoadingService,
  ) {}

  ngOnInit() {
    this.listaParcelas();
  }

  async alertBorrarParcela(key: string, nombre: string) {
    // creo un alert para confirmar que quiere borrar la parcela
    const alert = await this.alertController.create({
      header: 'Eliminar parcela',
      message:
        'Seguro que quiere eliminar la parcela <strong>' +
        nombre +
        '</strong>?.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: async (data) => {
            this.eliminarParcela(key);
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  async alertAnadirParcela() {
    // creo un alert para pedir los datos de la parcela
    const alert = await this.alertController.create({
      header: 'Añadir parcela',
      message:
        'Porfavor introduce el nombre y las dimensiones para crear la parcela.',
      // inputs para recojer los datos de la parecela
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre',
          attributes: {
            minlength: 4,
            autofocus: true,
          },
        },
        {
          name: 'alto',
          type: 'number',
          placeholder: 'Alto en metros',
          min: 1,
          max: 100,
        },
        {
          name: 'ancho',
          type: 'number',
          placeholder: 'Ancho en metros',
          min: 1,
          max: 100,
        },
      ],
      // botones para el alert
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Añadir',
          handler: async (data) => {
            this.nombre = data.nombre;
            this.alto = data.alto;
            this.ancho = data.ancho;
            await this.anadirParcela();
          },
        },
      ],
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
  }

  async listaParcelas() {
    // lista todas las parcelas
    await this.loadingService.presentLoading();
    this.parcelaService
      .listarParcelas()
      .snapshotChanges()
      .subscribe( (item) => {
        this.parcelas = [];
        item.forEach((elem) => {
          const p = elem.payload.toJSON() as Parcela;
          p.$key = elem.key;
          //console.log('p:',p);
          this.parcelas.push(p);
        });
      });
    await this.loadingService.dismissLoading();

  }

  async anadirParcela() {
    // valida los datos de la parcela introducidos por el usuario y llama al servicio para crear la parecela
    if (this.nombre.length < 3) {
      // Si la longitud es menor que 3 avisamos con un toast de que es corto
      const toast = await this.toastController.create({
        message: 'El nombre de la parcela es muy corto.',
        duration: 3000
      });
      toast.present();
    } else if (!this.alto || !this.ancho) {
      // Si no introducen numeros en alto y ancho avisamos con un toast
      const toast = await this.toastController.create({
        message: 'El alto y el ancho debe ser un numero.',
        duration: 3000
      });
      toast.present();
    } else if (Math.sign(this.alto) === -1 || Math.sign(this.ancho) === -1) {
      // Si introducen numeros negativos en alto y ancho avisamos con un toast
      const toast = await this.toastController.create({
        message: 'El alto y el ancho debe ser un numero positivo.',
        duration: 3000
      });
      toast.present();
    }
    // Las comas Ionic las transforma a . automaticamente.
    else {
      // si todo es correcto creo la parcela
      const parcela: Parcela = {
        $key: '',
        nombre: this.nombre,
        ancho: this.ancho,
        alto: this.alto,
        owner: '',
      };
      this.parcelaService.guardarParcela(parcela);
      const toast = await this.toastController.create({
        message: 'Parcela añadida.',
        duration: 2000
      });
      toast.present();
    }
  }

  async eliminarParcela(key: string) {
    // elimina una parcela y crea un toast para informar
    this.parcelaService.eliminarParcela(key);
    const toast = await this.toastController.create({
      message: 'Parcela elminada.',
      duration: 2000
    });
    toast.present();
  }

  irParcela(nombre: string) {
    //console.log('ir a parcela: ', nombre);
    this.router.navigate(['/plantacion/', nombre]);
  }

  async geoParcela(nombre: string) {
    const parcela: Parcela = await this.parcelaService.getParcelaByNombre(nombre);
    //console.log('parcela::', nombre, parcela);
    this.router.navigate(['/geolocalizacion/', nombre]);
  }
}
