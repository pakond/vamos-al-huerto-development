import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Foto } from '../interfaces';

@Injectable({
  providedIn: 'root'
})

export class PhotoService {

  fotos: Foto[] = [];
  refLista: AngularFireList<string>;

  constructor(private db: AngularFireDatabase) {}

  // comprime imagen src a max pixels
  compressImage(src: string, max: number): Promise<string> {
    return new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const elem = document.createElement('canvas');
        if (img.width > img.height) {
          elem.width = max;
          elem.height = max * img.height / img.width;
        } else {
          elem.width = max * img.width / img.height;
          elem.height = max;
        }
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, elem.width, elem.height);
        const data = ctx.canvas.toDataURL();
        res(data);
      };
      img.onerror = error => rej(error);
    });
  }

  async tomarFoto(): Promise<Photo> {
    const options = {
      resultType: CameraResultType.DataUrl, //.Base64,
      source: CameraSource.Camera, // automatically take a new photo with the camera
      //quality: 100, // highest quality (0 to 100)
      preserveAspectRatio: true,
    };
    // Take a photo
    try {
      const f = await Camera.getPhoto(options);
      return f;
    } catch (err) {
      console.log('foto cancelada');
    }
  }

  removeFotoDb(espKey: string, key: string) {
    this.refLista = this.db.list('imagenes_especies/' + espKey);
    this.refLista.remove(key);
  }

  getFotos(espKey: string) {
    this.fotos = [];
    this.db.list('imagenes_especies/' + espKey).snapshotChanges().subscribe((item) => {
      item.forEach((elem) => {
        const fotoKey = elem.key;
        const fotoData = elem.payload.toJSON().toString();
        const f = {$key: fotoKey, data: fotoData} as Foto;
        this.fotos.push(f);
        //console.log(f);
      });
    });
    //console.log(this.fotos);
  }

  addFotoDb(espKey: string, data: string) {
    this.refLista = this.db.list('imagenes_especies/' + espKey);
    this.refLista.push(data);
  }

}
