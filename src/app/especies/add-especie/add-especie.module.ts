import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEspeciePageRoutingModule } from './add-especie-routing.module';

import { AddEspeciePage } from './add-especie.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddEspeciePageRoutingModule,
  ],
  declarations: [AddEspeciePage]
})
export class AddEspeciePageModule {}
