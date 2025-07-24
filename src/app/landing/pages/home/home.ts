import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <-- importa esto

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterModule], // <-- agrégalo aquí
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {}
