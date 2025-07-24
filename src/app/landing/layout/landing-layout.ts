import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-landing-layout',
  templateUrl: './landing-layout.html',
  styleUrls: ['./landing-layout.scss'],
  imports: [CommonModule, RouterOutlet, RouterLink]
})
export class LandingLayout {}
