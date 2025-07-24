import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { ColorModeService } from '@coreui/angular';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  title = 'Utcuwawa Regalos Web';
  readonly #iconSetService = inject(IconSetService);
  readonly #colorModeService = inject(ColorModeService);
  readonly #titleService = inject(Title);

  constructor() {
    this.#titleService.setTitle(this.title);
    // iconSet singleton
    this.#iconSetService.icons = { ...iconSubset };
    // this.#colorModeService.localStorageItemName.set('coreui-free-angular-admin-template-theme-default');
    this.#colorModeService.localStorageItemName.set('coreui-theme-default'); 
    this.#colorModeService.eventName.set('ColorSchemeChange');
  }

}
