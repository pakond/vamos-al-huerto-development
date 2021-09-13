import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, ToastController } from '@ionic/angular';

import { Especie, Foto } from 'src/app/interfaces';
import { LoadingService } from 'src/app/shared/loading.service';
import { EspeciesService } from '../especies.service';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-edit-especie',
  templateUrl: './edit-especie.page.html',
  styleUrls: ['./edit-especie.page.scss'],
})

export class EditEspeciePage implements OnInit {
 // especie: Especie[];
 especie: Especie;
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
  public changeEspecieForm: FormGroup;
  foto: Foto;
  defaultPhotoSizeMax = 200;
  fotos: Foto[] = [];
  fotosABorrar: string[] = [];  // lista de keys de fotos
  fotosAAnadir: string[] = [];  // lista de datos de fotos
  isDataAvailable = false;

  constructor(public formBuilder: FormBuilder,
      private especiesService: EspeciesService,
      //private chooser: Chooser,
      public photoService: PhotoService,
      private router: Router,
      private activeRoute: ActivatedRoute,
      public actionSheetController: ActionSheetController,
      private loadingService: LoadingService,
      // private toastController: ToastController,
      //private modalController: ModalController,
      ) {}

  async ngOnInit() {
    await this.loadingService.presentLoading();

    const nombre = this.activeRoute.snapshot.paramMap.get('nombre');
    this.especie = await this.especiesService.getEspecieByNombre(nombre);
    this.photoService.getFotos(this.especie.$key);

    this.updateEspacieData();
    this.fotos = this.photoService.fotos;

    this.especiesService.getEspecie(this.especie.$key).valueChanges().subscribe(data =>{
      this.changeEspecieForm.setValue(data);
    });
    await this.loadingService.dismissLoading();
    this.isDataAvailable = true;
  }

  get errorControl() {return this.changeEspecieForm.controls;}

  async updateEspacieData(){
    this.changeEspecieForm = this.formBuilder.group({
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
  }

  async addPhoto() {
    const capturedPhoto = await this.photoService.tomarFoto();
    if (capturedPhoto) {
      const fotoData = await this.photoService.compressImage(capturedPhoto.dataUrl, this.defaultPhotoSizeMax);
      this.fotosAAnadir.push(fotoData);
      this.fotos.push({$key: '', data: fotoData});
      console.log('Tamaño:', Math.round((fotoData.length - 22)*3/4) / 1000, 'KB');
    }
  }

  public async showActionSheet(key: string, position: number){
    const actionSheet = await this.actionSheetController.create({
      header: 'Fotos',
      buttons: [{
        text: 'Borrar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.fotosABorrar.push(key);
          this.fotos.splice(position, 1);
          //console.log('fotos a borrar', this.fotosABorrar);
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

  async changeEspecie(especie: Especie){
    this.submitted = true;
    if (!this.changeEspecieForm.valid) {
      console.log('Please provide all the required values!');
      //console.log(this.changeEspecieForm.value);
      return false;
    } else {
      await this.especiesService.updateEspecie(this.changeEspecieForm.value);
      this.fotosAAnadir.forEach(elem => {
        //console.log('añadiendo foto: ', elem.substring(1, 4));
        this.photoService.addFotoDb(especie.$key, elem);
      });
      this.fotosABorrar.forEach(elem => {
        //console.log('borrando foto: ', elem);
        this.photoService.removeFotoDb(especie.$key, elem);
      });
      this.router.navigate(['/especies']);
    }
  }
  cancel(){
    this.router.navigate(['/especies']);
   }
}
