import { Component } from '@angular/core';
import { FooterComponent } from '@coreui/angular';

@Component({
  standalone: true,
  selector: 'app-default-footer',
  templateUrl: './default-footer.component.html',
  styleUrls: ['./default-footer.component.scss']
})
export class DefaultFooterComponent extends FooterComponent {
  constructor() {
    super();
  }
}
