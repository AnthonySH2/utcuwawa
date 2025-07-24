import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout';
import { Ventas } from './ventas/ventas';
import { Productos } from './productos/productos';
import { Reportes } from './reportes/reportes';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: 'ventas',
        component: Ventas,
        title: 'Ventas'
      },
      {
        path: 'productos',
        component: Productos,
        title: 'Productos'
      },
      {
        path: 'reportes',
        component: Reportes,
        title: 'Reportes'
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
