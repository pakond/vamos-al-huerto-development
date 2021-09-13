import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

import { Planta } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class PlantacionService {

  plantacion: AngularFireList<any>;


  constructor(private db: AngularFireDatabase) { }

  guardarPlanta(parcelaKey: string, planta: Planta) {
    // obtener ref de plantacion
    const ref = this.db.database.ref().child('plantacion');
    // guardar planta en la plantacion
    ref.child(parcelaKey).push(planta);
    //console.log(planta);
  }

  obtenerCultivos(parcelaKey: string) {
    // devuelve todas las parcelas de firebase
    return this.plantacion = this.db.list('plantacion/' + parcelaKey);
  }

  obtenerCultivosActivos(parcelaKey: string) {
    // devuelve todas las parcelas de firebase
    return this.plantacion = this.db.list('plantacion/' + parcelaKey, ref => ref.orderByChild('fechaCosechado').equalTo(null));
  }
  eliminarPlantacion(parcelaKey: string) {
    // eliminar una plantacion
    this.db.object('plantacion/' + parcelaKey).remove();
  }

  async cosecharPlanta(parcelaKey: string, fil: number, col: number) {
    const plantaKey = await this.getPlantaKeyByPosicion(parcelaKey, fil, col);
    await this.db.object('plantacion/' + parcelaKey + '/' + plantaKey).update({fechaCosechado: Date.now()});
  }

  async getPlantaKeyByPosicion(parcelaKey: string, fil: number, col: number): Promise<string> {
    const ref = this.db.database.ref()
      .child('plantacion')
      .child(parcelaKey)
      .orderByChild('posicionHorizontal')
      .equalTo(col);

      let plantaKey: string;
      return ref.once('value').then( (snapshot) => {
        snapshot.forEach(data => {
          const planta = data.toJSON() as Planta;
          if (planta.posicionVertical === fil) {
            plantaKey = data.key;
            console.log('cosechar: ', planta.especie);
          }
        });
        //console.log('plantaKey', plantaKey);
        return plantaKey;
      });
    }
  
    // getNumPlantasByEspecie(nombre: string) {
    //   // cuenta el numero de plantas plantadas de una especie
    //   let count = 0
    //   this.db.list('plantacion', ref => ref.orderByChild('especie').equalTo(nombre)).snapshotChanges().subscribe(item => {
    //     item.forEach(() => {
    //       count++;
    //     })
    //   });
    //   return count
    // }
}
