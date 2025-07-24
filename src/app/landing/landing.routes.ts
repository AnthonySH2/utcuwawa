import { Routes } from '@angular/router';
import { LandingLayout } from './layout/landing-layout';
import { Home } from './pages/home/home';
import { Contacto } from './pages/contacto/contacto';
import { Colibri } from './pages/colibri/colibri';

export const LANDING_ROUTES: Routes = [
  {
    path: '',
    component: LandingLayout,
    children: [
      { path: '', component: Home,title: 'Inicio'},
      { path: 'contacto', component: Contacto, title: 'Contacto'},
      { path: 'colibri', component: Colibri, title: 'Nuestro Colibrí AR' }
    ]
  }
];
