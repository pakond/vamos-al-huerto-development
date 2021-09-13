import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { CalendarModal, CalendarModalOptions } from 'ion2-calendar';

import { EspeciesService } from '../especies/especies.service';
import { Especie, Parcela, Planta } from '../interfaces';
import { ParcelaService } from '../parcela/parcela-service.service';
import { PlantacionService } from './plantacion.service';

@Component({
  selector: 'app-plantacion',
  templateUrl: './plantacion.page.html',
  styleUrls: ['./plantacion.page.scss'],
})
export class PlantacionPage implements OnInit {
  parcela: Parcela;
  casilla: string[][];
  listaEsp = [];
  espAPlantar: string;

  fechasPlantas: number[] = [];
  tiemposCultivos: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private parcelaService: ParcelaService,
    private especiesService: EspeciesService,
    private plantacionService: PlantacionService,
    private toastController: ToastController,
    public modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    this.listaEspecies();
    await this.getParcela();
    this.inicializarParcela();
  }

  crearArray2D(rows, cols) {
    rows = rows * 10;
    cols = cols * 10;
    const array = new Array(rows);
    for (let i = 0; i < rows; i++) {
      array[i] = new Array(cols);
      for (let j = 0; j < cols; j++) {
        array[i][j] = '';
      }
    }
    return array;
  }

  inicializarParcela() {
    // dimensionar el array
    this.casilla = this.crearArray2D(this.parcela.alto, this.parcela.ancho);
    //console.log(this.casilla);
    const plantacion = this.plantacionService.obtenerCultivosActivos(this.parcela.$key);
    plantacion.snapshotChanges().subscribe((item) => {
      item.forEach(async (elem) => {
        const planta = elem.payload.toJSON() as Planta;
        this.fechasPlantas.push(planta.fechaPlantado);
        // coje la especie segun el nombre
        const especie = await this.especiesService.getEspecieByNombre(planta.especie);
        if (especie) {
          //console.log('especie:', especie);
          this.tiemposCultivos.push(planta.fechaPlantado + (especie.tiempoCultivo * 24 * 60 * 60 * 1000));
          const icono = await this.especiesService.getIconoEspecie(planta.especie);
          //console.log('icono',planta.especie, ':', icono);
          // TODO: pasar <img> a la template
          this.casilla[planta.posicionVertical][planta.posicionHorizontal] =
            (icono) ?  '<img src="./assets/iconos-svg/'+icono+'"/>' : planta.especie;
        }
      });
    });
  }

  async getParcela() {
    const nombre = this.route.snapshot.paramMap.get('nombre');
    await this.parcelaService.getParcelaByNombre(nombre).then((parc) => {
      this.parcela = parc;
      //console.log('comp:', parc);
    });
  }

  listaEspecies() {
    return this.especiesService
      .getEspeciesList()
      .valueChanges()
      .subscribe((item) => {
        item.forEach((elem) => {
          //console.log('elem', elem);
          this.listaEsp.push(elem as Especie);
        });
        //console.log('especies:', item);
      });
  }

  async plantar(fil: number, col: number) {
    if (this.espAPlantar === '0') {
      // eliminar planta de la parcela
      await this.cosecharPlanta(fil, col);
      return;
    }

    if (!this.casilla[fil][col]) {
      if (this.espAPlantar !== undefined) {
        console.log('plantar:', fil, col, this.espAPlantar);
        const planta: Planta = {
          especie: this.espAPlantar,
          fechaPlantado: Date.now(),
          posicionVertical: fil,
          posicionHorizontal: col,
        };
        this.casilla[fil][col] = this.espAPlantar;
        //console.log(planta);
        this.plantacionService.guardarPlanta(this.parcela.$key, planta);
        const toast = await this.toastController.create({
          message: 'Planta añadida',
          duration: 2000,
        });
        toast.present();
      } else {
        const toast = await this.toastController.create({
          message: 'No hay especie seleccionada',
          duration: 2000,
        });
        toast.present();
      }
    } else {
      const toast = await this.toastController.create({
        message: 'Espacio ocupado',
        duration: 2000,
      });
      toast.present();
    }
  }
  async cosecharPlanta(fil: number, col: number) {
    if (this.casilla[fil][col]) {
      await this.plantacionService.cosecharPlanta(this.parcela.$key, fil, col);
      const toast = await this.toastController.create({
        message: 'Planta eliminada',
        duration: 2000,
      });
      toast.present();
      this.inicializarParcela();
    } else {
      const toast = await this.toastController.create({
        message: 'No hay planta en esta posición',
        duration: 2000,
      });
      toast.present();
    }
  }

  selEspecie() {
    //console.log(this.espAPlantar);
  }

  async calendario() {

    this.fechasPlantas.sort();
    this.tiemposCultivos.sort();

    const dateRange: {
      from: Date;
      to: Date;
    } = {
      from: new Date(this.fechasPlantas[0]),
      to: new Date(this.tiemposCultivos[this.tiemposCultivos.length - 1])
    };
    const options: CalendarModalOptions = {
      pickMode: 'range',
      title: this.parcela.nombre,
      defaultDateRange: dateRange
    };

    const myCalendar =  await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();
  }

}
