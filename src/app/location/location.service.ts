import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Geolocation } from '@capacitor/geolocation';
import { Posicion } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  pos: { lat: number; lng: number };

  constructor(private db: AngularFireDatabase) {}

  async getLocation(): Promise<[number, number, number] | null> {
    const pos = await Geolocation.getCurrentPosition();
    console.log(
      'service: ',
      pos.coords.latitude,
      pos.coords.longitude,
      pos.coords.accuracy
    );
    return [pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy];
  }

  async setPosicion(pos: Posicion, key: string) {
    const posDbObject: AngularFireObject<Posicion> = this.db.object('posicion_parcela/' + key);
    await posDbObject.set(pos);
  }

  deleteGeo(key: string) {
    // elmina posicion_parcela dada la key de una parcela
    this.db.object('posicion_parcela/' + key).remove();
  }

}
