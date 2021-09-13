import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

import { Parcela, Posicion } from '../interfaces';
import { LocationService } from '../location/location.service';
import { PlantacionService } from '../plantacion/plantacion.service';
import { AuthenticationService } from '../shared/authentication-service';

@Injectable({
  providedIn: 'root'
})
export class ParcelaService {

  parcelas: AngularFireList<any>;
  parcela: Parcela;

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthenticationService,
    private plantacionService: PlantacionService,
    private geoService: LocationService
  ) {
  }

  async getParcelaByNombre(nombre: string): Promise<Parcela> {
    const ref = this.db.database.ref().child('parcela').orderByChild('nombre').equalTo(nombre).limitToFirst(1);
    return ref.once('value').then( (snapshot) => {
        snapshot.forEach(data => {
          this.parcela = data.toJSON() as Parcela;
          this.parcela.$key = data.key;
          //console.log('parcela', data.key, this.parcela);
          });
          return this.parcela;
        });
  }

  async getPosicion(key: string): Promise<Posicion> {
    let k;
    const ref = this.db.database.ref().child('posicion_parcela').orderByKey().equalTo(key).limitToFirst(1);
    const x = await ref.once('value').then((snapshot) => {
      snapshot.forEach((data) => {
        k = data.toJSON() as Posicion;
      });
      return k;
    });
    return (x) ? x as Posicion : null;
  }

  guardarParcela(parcela: Parcela) {
    // guarda parcela en firebase
    this.parcelas.push({
      nombre: parcela.nombre,
      alto: parcela.alto,
      ancho: parcela.ancho,
      // aado el uid del usuario que crea la parcela en este campo
      owner: this.authService.getUid,
    });
  }

  listarParcelas() {
    // devuelve todas las parcelas de firebase de un usuario
    const uid = this.authService.getUid;
    return this.parcelas = this.db.list('parcela', ref => ref.orderByChild('owner').equalTo(uid));
  }

  // actualizarParcela(parcela: Parcela) {

  //   this.parcelas.update(parcela.$key, {
  //     nombre: parcela.nombre,
  //     alto: parcela.alto,
  //     ancho: parcela.ancho,
  //   });
  // }

  async actualizarParcelaGeo(parcela: Parcela, lat, lng) {
    await this.parcelas.update(parcela.$key, {
      // nombre: parcela.nombre,
      // alto: parcela.alto,
      // ancho: parcela.ancho,
      lat,
      lng
    });
  }

  eliminarParcela($key: string) {
    // elmina la plantacion de la parcela
    this.plantacionService.eliminarPlantacion($key);
    // elimina el location de la parcela
    this.geoService.deleteGeo($key);
    // elmina una parcela dada su key
    this.parcelas.remove($key);
  }

}
