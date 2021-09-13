import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlantacionPageRoutingModule } from './plantacion-routing.module';

import { PlantacionPage } from './plantacion.page';
import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlantacionPageRoutingModule,
    CalendarModule
  ],
  declarations: [PlantacionPage]
})
export class PlantacionPageModule {}
