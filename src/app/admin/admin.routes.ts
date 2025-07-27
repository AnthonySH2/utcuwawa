import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout';
import { Ventas } from './ventas/ventas';
import { Productos } from './productos/productos';
import { Reportes } from './reportes/reportes';
import { LoginAdmin } from './pages/login-admin'; // ruta correcta según tu estructura
import { AdminGuard } from './guards/admin.guard'; // te explicaré abajo cómo crearlo

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginAdmin,
    title: 'Iniciar sesión admin'
  },
  {
    path: '',
    canActivate: [AdminGuard], // proteger todo el layout
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
        redirectTo: 'productos',
        pathMatch: 'full'
      }
    ]
  }
];
