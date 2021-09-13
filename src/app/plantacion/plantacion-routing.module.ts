import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlantacionPage } from './plantacion.page';

const routes: Routes = [
  {
    path: '',
    component: PlantacionPage
  },
  {
    path: ':nombre',
    component: PlantacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlantacionPageRoutingModule {}
