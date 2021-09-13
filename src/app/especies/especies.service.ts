import { Injectable } from '@angular/core';
import { Especie } from '../interfaces';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { AuthenticationService } from '../shared/authentication-service';

@Injectable({
  providedIn: 'root'
})

export class EspeciesService {

  especiesList: AngularFireList<Especie>;
  especieRef: AngularFireObject<Especie>;
  private dbPath = '/especie/';

  constructor(private db: AngularFireDatabase,
    private authService: AuthenticationService
    ) {
    this.especiesList = this.getEspeciesList(); //this.db.list(this.dbPath, ref => ref.orderByChild('nombre'));
  }

  // Add
  async addEspecie(especie: Especie){
    return await this.especiesList.push(especie);
  }

  // Get single object
  getEspecie(key: string) {
    this.especieRef = this.db.object(this.dbPath + key);
    return this.especieRef;
  }

  // Get List
  getEspeciesList(): AngularFireList<Especie> {
    return this.db.list(this.dbPath, ref => ref.orderByChild('nombre'));
  }

  // Update
  async updateEspecie(especie: Especie) {
     await this.especieRef.update({
      nombre: especie.nombre,
      espacio: especie.espacio,
      descripcion: especie.descripcion,
      categoria: especie.categoria,
      profundidad: especie.profundidad,
      riego: especie.riego,
      luz: especie.luz,
      mesesPlantacion: especie.mesesPlantacion,
      tiempoCultivo: especie.tiempoCultivo,
      icono: especie.icono,
    });
  }

  // Delete
  async deleteEspecie(key: string) {
    // borrar especie
    const especieRef = this.db.object(this.dbPath + key);
    await especieRef.remove();
    // borrar fotos
    const fotosRef = this.db.object('imagenes_especies/' + key);
    await fotosRef.remove();
  }

  async getEspecieByNombre(nombre: string): Promise<Especie> {
    let e: Especie;
    const ref = this.db.database.ref().child('especie').orderByChild('nombre').equalTo(nombre).limitToFirst(1);
    return await ref.once('value').then( (snapshot) => {
        snapshot.forEach(data => {
          e = data.toJSON() as Especie;
          e.$key = data.key;
          });
          return e;
        });
  }

  async getIconoEspecie(nombre): Promise <string> {
    // recoger icono de la especie 'nombre'
    const e = await this.getEspecieByNombre(nombre);
    //console.log('ICONO:', e.icono);
    return new Promise(resolve => {
      //console.log('ICONO:', e.icono);
      try {
      resolve(e.icono);
      } catch (err) {
        console.log(`This block should catch any
          instantiation errors.`, e, nombre);
      }
    });
  }

  // cuenta el numero de plantas plantadas de una especie para un usuario
  async getNumPlantasByEspecie(nombre: string) {
    let count = 0;
    const listaParcelas = [];
    const uid = this.authService.getUid;

    // obtener las parcelas
    const refParcela = this.db.database.ref('parcela');
    await refParcela.once('value', (parcelas) => {
      //console.log('parcelas:', parcelas.val());
      parcelas.forEach((parcela) => {
        //console.log('parcela:', parcela.val());
        // usar solo las parcelas del usuario
        if (parcela.val().owner === uid) {
          listaParcelas.push(parcela.key);
          //console.log('parcela del usuario:', parcela.key, parcela.val());
        }
      });
    });
    // obtener todas las plantaciones de las parcelas del usuario
    const refPlantacion = this.db.database.ref('plantacion');
    await refPlantacion.once('value', (snapshot) => {
      snapshot.forEach((plantacionSnapshot) => {

        if (listaParcelas.includes(plantacionSnapshot.key)) {
          // iteramos sobre las plantas de la plantacion
          plantacionSnapshot.forEach((plantaSnapshot) => {
            //console.log('planta: ', plantaSnapshot.val());
            // solo nos interesan las que coinciden con nombre y estan activas
            if (plantaSnapshot.val().especie === nombre && !plantaSnapshot.val().fechaCosechado) {
              count++;
            }
          });
          //console.log('sumatorio de plantas de ', nombre, 'en la plantacion', plantacionSnapshot.key, ': ', count);
        }
      });
      //console.log('count:', nombre, count);
    });
    //console.log('Total plantas de ' + nombre + ': ', count);
    return count;
  }
}
