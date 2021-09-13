
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChartsModule } from 'ng2-charts';

import { ListEspeciesPageRoutingModule } from './list-especies-routing.module';
import { ListEspeciesPage } from './list-especies.page';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ListEspeciesPageRoutingModule,
    ChartsModule,
  ],
  declarations: [ListEspeciesPage, ModalComponent]
})
export class ListEspeciesPageModule {}
