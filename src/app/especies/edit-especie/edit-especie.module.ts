import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditEspeciePageRoutingModule } from './edit-especie-routing.module';

import { EditEspeciePage } from './edit-especie.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditEspeciePageRoutingModule
  ],
  declarations: [EditEspeciePage]
})
export class EditEspeciePageModule {}
