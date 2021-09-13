import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Especie, Foto } from 'src/app/interfaces';
import { EspeciesService } from '../especies.service';

import { PhotoService } from '../photo.service';
import { Router } from '@angular/router';
import { ActionSheetController, ToastController } from '@ionic/angular';

import { Chooser } from '@ionic-native/chooser/ngx';

@Component({
  selector: 'app-add-especie',
  templateUrl: './add-especie.page.html',
  styleUrls: ['./add-especie.page.scss'],
  providers: [
    Chooser // added class in the providers
  ]
})
export class AddEspeciePage implements OnInit {
  especie: Especie[];
  // Categoria : Especie['categorias'];
  categorias: any = ['Fruta', 'Verdura', 'Flor', 'Tuberculo', 'Legumbre'];
  // Luz: Especie['luz']
  luces: any = ['Soleado', 'Sombra', 'Semisombra'];
  meses: any = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  iconos: any = [
    {imageUrl:'004-bell-pepper.svg'},
    {imageUrl:'005-melon-1.svg'},
    {imageUrl:'046-tomato.svg'},
    {imageUrl:'010-corn.svg'},
    {imageUrl:'011-garlic.svg'},
    {imageUrl:'012-carrot-1.svg'},
    {imageUrl:'013-peas.svg'},
    {imageUrl:'014-berries.svg'},
    {imageUrl:'016-artichoke.svg'},
    {imageUrl:'017-cabbage.svg'},
    {imageUrl:'019-watermelon-1.svg'},
    {imageUrl:'024-lettuce-1.svg'},
    {imageUrl:'022-potato.svg'},
    {imageUrl:'025-pumpkin.svg'},
    {imageUrl:'026-onion-2.svg'},
    {imageUrl:'029-lettuce.svg'},
    {imageUrl:'031-beet.svg'},
    {imageUrl:'033-cucumber.svg'},
    {imageUrl:'034-strawberry.svg'},
    {imageUrl:'038-chili.svg'},
    {imageUrl:'040-radish.svg'},
    {imageUrl:'043-eggplant.svg'},
    {imageUrl:'045-broccoli.svg'},
  ];

  defaultEspacio = '30';
  submitted = false;
  public addEspecieForm: FormGroup;
  foto: Foto;
  defaultPhotoSizeMax = 200;
  fotos: string[] = [];  // lista de datos de fotos

  constructor(public formBuilder: FormBuilder,
      private especiesService: EspeciesService,
      private chooser: Chooser,
      public photoService: PhotoService,
      private router: Router,
      public actionSheetController: ActionSheetController,
      private toastController: ToastController,
      ) {}

  async ngOnInit() {
    this.addEspecieForm = this.formBuilder.group({
      nombre: ['', [Validators.required,Validators.minLength(3)]],
      descripcion: [''],
      categoria: [''],
      espacio: ['',[Validators.required]],
      profundidad: [''],
      riego: [''],
      luz: [''],
      mesesPlantacion: [''],
      tiempoCultivo: ['',[Validators.required, Validators.pattern('^[0-9]+$')] ],
      icono: [''],
    });
    this.addEspecieForm.get('espacio').setValue(this.defaultEspacio);
  }

  get errorControl() {return this.addEspecieForm.controls;}

  async addEspecie() {
    this.submitted = true;
    if (!this.addEspecieForm.valid) {
      console.log('Please provide all the required values!');
      //console.log(this.addEspecieForm.value);
      return false;
    } else {
      //console.log(this.addEspecieForm.value);
      // crear especie
      const newEspecie = this.addEspecieForm.value as Especie;

      // añadir especies con fotos
      const e = await this.especiesService.addEspecie(newEspecie);
      this.fotos.forEach(elem => {
        //console.log('añadiendo foto: ', elem.substring(1, 4));
        this.photoService.addFotoDb(e.key, elem);
      });

      const toast = await this.toastController.create({
        message: 'Especie añadida.',
        duration: 2000
      });
      toast.present();
      this.router.navigate(['/especies']);
    }
  }

  async addPhoto() {
    const capturedPhoto = await this.photoService.tomarFoto();
    if (capturedPhoto) {
      const fotoData = await this.photoService.compressImage(capturedPhoto.dataUrl, this.defaultPhotoSizeMax);
      this.fotos.push(fotoData);
      console.log('Tamaño:', Math.round((fotoData.length - 22)*3/4) / 1000, 'KB');
    }
  }

  public async showActionSheet( photo: string, position: number){
    const actionSheet = await this.actionSheetController.create({
      header: 'Fotos',
      buttons: [{
        text: 'Borrar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('foto', position);
          this.fotos.splice(position, 1);
        }
      },{
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }
    ]
    });
    await actionSheet.present();
  }

  listaFotos() {
    return this.fotos;
  }

  cancel(){
    this.router.navigate(['/especies']);
  }
}
