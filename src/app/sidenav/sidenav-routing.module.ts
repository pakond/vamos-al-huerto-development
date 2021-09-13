import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/authGuard-service';

import { SidenavPage } from './sidenav.page';


const routes: Routes = [
  {
    path: '',
    component: SidenavPage,
    children: [
      {
        path: '',
        redirectTo: 'parcela',
        pathMatch: 'full',
      },
      {
        path: 'parcela',
        loadChildren: () => import('../parcela/parcela.module').then(m => m.ParcelaPageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'especies',
        loadChildren: () => import('../especies/list-especies/list-especies.module').then(m => m.ListEspeciesPageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'plantacion',
        loadChildren: () => import('../plantacion/plantacion.module').then(m => m.PlantacionPageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'logout',
        loadChildren: () => import('../logout/logout.module').then(m => m.LogoutPageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'about',
        loadChildren: () => import('../about/about.module').then(m => m.AboutPageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'geolocalizacion',
        loadChildren: () => import('../location/location.module').then( m => m.LocationPageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'add-especie',
        loadChildren: () => import('../especies/add-especie/add-especie.module').then(m => m.AddEspeciePageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'especie',
        loadChildren: () => import('../especies/edit-especie/edit-especie.module').then(m => m.EditEspeciePageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule),
        canActivate: [AuthGuard],
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SidenavPageRoutingModule {}
