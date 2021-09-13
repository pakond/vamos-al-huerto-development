import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocationService } from './location.service';
import * as Leaflet from 'leaflet';
import 'leaflet.locatecontrol';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastController } from '@ionic/angular';

import { ParcelaService } from '../parcela/parcela-service.service';
import { Parcela, Posicion } from '../interfaces';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit, OnDestroy {
  acc = 0;
  map: Leaflet.Map;
  marker: Leaflet.Marker;
  circle: Leaflet.Circle;
  parcela: Parcela;
  posicionParcela: Posicion = { lat: 0, lng: 0 };

  constructor(
    private locationService: LocationService,
    private route: ActivatedRoute,
    private location: Location,
    private parcelaService: ParcelaService,
    private toastController: ToastController,

  ) {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = Leaflet.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });
    Leaflet.Marker.prototype.options.icon = iconDefault;
  }

  async ngOnInit() {
    const nombreParcela = this.route.snapshot.paramMap.get('nombre');
    this.parcela = await this.parcelaService.getParcelaByNombre(nombreParcela);
    const p = await this.parcelaService.getPosicion(this.parcela.$key);
    if (p) {
      this.posicionParcela = p;
    } else {
      await this.getLocation();
    }
  }

  async ionViewDidEnter() {
    await this.mapa();
    this.ponerMarcador();
  }

  async getLocation() {
    const coords = await this.locationService.getLocation();
    if (coords) {
      this.posicionParcela = { lat: coords[0], lng: coords[1] };
      this.acc = coords[2];
      //console.log('controller:', this.posicionParcela, this.acc);
    }
  }

  async mapa() {
    //to prevent errors
    if (this.map) {
      //to remove any initialization of a previous map
      this.map.off();
      this.map.remove();
    }
    //for original view
    const original = Leaflet.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { maxZoom: 19 }
    );
    //for satellite view
    const satellite = Leaflet.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19 }
    );
    const wmsLayer = Leaflet.tileLayer.wms(
      'https://geoserveis.icgc.cat/icc_mapesbase/wms/service?',
      {
        layers: 'mtc500m,mtc250m,mtc5m', // TODO: solo carga el ultimo
        maxZoom: 19,
      }
    );

    this.map = Leaflet.map('mapId', {
      center: [this.posicionParcela.lat, this.posicionParcela.lng],
      zoom: 17,
      attributionControl: false,
      layers: [satellite, original, wmsLayer],
    });
    const baseMaps = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      WMS: wmsLayer,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Satelite: satellite,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Original: original,
    };
    Leaflet.control.layers(baseMaps).addTo(this.map);
    Leaflet.control.scale().addTo(this.map);
    Leaflet.control
      .locate({
        flyTo: true,
      })
      .addTo(this.map);
  }

  ponerMarcador() {
    this.map.setView([this.posicionParcela.lat, this.posicionParcela.lng], 18);
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = new Leaflet.Marker(
      [this.posicionParcela.lat, this.posicionParcela.lng],
      { draggable: true }
    );
    this.map.addLayer(this.marker);
    this.marker.bindPopup(this.parcela.nombre).openPopup();

    this.marker.on('drag', (e) => {
      const latlng = e.target.getLatLng();
      this.posicionParcela.lat = latlng.lat;
      this.posicionParcela.lng = latlng.lng;
    });
  }

  async fixLocation() {
    console.log('fixLocation', this.posicionParcela);
    this.locationService.setPosicion(this.posicionParcela, this.parcela.$key);
    const toast = await this.toastController.create({
      message: 'Ubicación de la parcela ' + this.parcela.nombre + ' actualizada',
      duration: 2000,
    });
    toast.present();
    this.map.off();
    this.location.back();
  }

  removeMap() {
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
  }

  ngOnDestroy() {
    this.removeMap();
  }
}
