import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditEspeciePage } from './edit-especie.page';

const routes: Routes = [
  {
    path: ':nombre',
    component: EditEspeciePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditEspeciePageRoutingModule {}
