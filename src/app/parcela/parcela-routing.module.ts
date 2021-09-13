import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParcelaPage } from './parcela.page';

const routes: Routes = [
  {
    path: '',
    component: ParcelaPage
  },
  {
    path: 'plantacion',
    loadChildren: () => import('../plantacion/plantacion.module').then(m => m.PlantacionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParcelaPageRoutingModule {}
