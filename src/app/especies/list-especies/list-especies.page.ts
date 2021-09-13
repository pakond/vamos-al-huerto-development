import { Especie } from './../../interfaces';
import { ModalComponent } from './modal/modal.component';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController, ModalController, PopoverController  } from '@ionic/angular';
import { LoadingService } from 'src/app/shared/loading.service';
import { EspeciesService } from '../especies.service';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';


@Component({
  selector: 'app-list',
  templateUrl: './list-especies.page.html',
  styleUrls: ['./list-especies.page.scss'],
})
export class ListEspeciesPage implements OnInit {

  especiesArray = [];

  // Bar ESPECIES
  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
          ticks: {
              beginAtZero: true
          }
      }]
    }
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = false;
  barChartPlugins = [];
  colors: Color[] = [
    {
      backgroundColor: '#00ff00'
    }
  ];
  barChartData: ChartDataSets[] = [{ data: [] }];

  constructor(
    private especiesService: EspeciesService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingService: LoadingService,
    private modalController: ModalController,
    private popoverController: PopoverController

    ) { }

  ngOnInit() {

    this.getList();
  }

  async getList() {
    //console.log('lista especies');
    await this.loadingService.presentLoading();
    this.especiesService.getEspeciesList().snapshotChanges()
    .subscribe(async data => {
      this.especiesArray = [];
      this.barChartLabels = [];
      this.barChartData[0].data = [];

      data.forEach(async (item) => {
        const e = item.payload.toJSON() as Especie;
        e.$key = item.key;
        this.especiesArray.push(e);
        // añade los labels del grafico con el nombre de la especies
        this.barChartLabels.push(e.nombre);
        // busca la especie y cuenta cuantas hay plantadas
        const num = await this.especiesService.getNumPlantasByEspecie(e.nombre);
        // añade el numero a los datos de la grafica
        this.barChartData[0].data.push(num);
      });
    }, (err) => {
      console.log('err', err);
    });
    await this.loadingService.dismissLoading();
  }

  anadirEspecie() {
    this.router.navigate(['add-especie']);
  }

  editarEspecie(nombre: string) {
    this.router.navigate(['especie', nombre]);
  }

  //------------Borrar especie-----------------------------
  async alertBorrarEspecie(key: string, nombre: string) {
  // creo un alert para confirmar que quiere borrar la especie
  const alert = await this.alertController.create({
    header: 'Eliminar especie',
    message:
      'Seguro que quiere eliminar la especie <strong>' + nombre + '</strong>?.',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
      },
      {
        text: 'Eliminar',
        handler: async (data) => {
          this.eliminarEspecie(key);
        },
      },
    ],
  });
  await alert.present();
  const { role } = await alert.onDidDismiss();
  }

  async eliminarEspecie(key: string) {
    // elimina una especie y crea un toast para informar
    this.especiesService.deleteEspecie(key);
    const toast = await this.toastController.create({
      message: 'Especie elminada.',
      duration: 2000
    });
    toast.present();
  }

  //--------------------------MODAL-----------------------------
  async createModal(especie: Especie) {
      const modal = await this.modalController.create({
        component: ModalComponent,
        componentProps:{
          especie
        }
      });
      await modal.present();
  }

}
