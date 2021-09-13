import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEspeciePage } from './add-especie.page';

const routes: Routes = [
  {
    path: '',
    component: AddEspeciePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEspeciePageRoutingModule {}
