
import { Especie } from 'src/app/interfaces';

import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { PhotoService } from '../../photo.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  especie: Especie;
  fotos = [];
  meses = [];

  constructor(
    private modalController: ModalController,
    public photoService: PhotoService
  ) { }

  ngOnInit() {
    this.meses = Object.values(this.especie.mesesPlantacion);
    this.listaFotos();
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  listaFotos() {
    this.photoService.getFotos(this.especie.$key);
    this.fotos = this.photoService.fotos;
  }

}
