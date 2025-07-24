import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { importProvidersFrom } from '@angular/core';
import { SidebarModule, DropdownModule } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(SidebarModule, DropdownModule),
    IconSetService,
    provideHttpClient(),
    provideAnimationsAsync()
  ]
};
