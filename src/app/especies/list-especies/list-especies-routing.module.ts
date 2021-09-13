import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListEspeciesPage } from './list-especies.page';

const routes: Routes = [
  {
    path: '',
    component: ListEspeciesPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListEspeciesPageRoutingModule {}
