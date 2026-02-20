import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import {HomeComponent} from './features/home/home.component';
import {Footer} from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, Footer],
  template: `
    <app-header />
    <router-outlet />
  `,
  styles: []
})
export class App {
  title = 'GDG UTBM';
}
