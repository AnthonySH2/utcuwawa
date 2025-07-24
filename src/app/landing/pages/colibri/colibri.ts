import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@Component({
  standalone : true,
  selector: 'app-colibri',
  imports: [],  
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './colibri.html',
  styleUrl: './colibri.scss'
})
export class Colibri {

}
