import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MiniCartComponent } from './cart/components/mini-cart/mini-cart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MiniCartComponent],
  template: `
    <header class="app-header">
      <app-mini-cart></app-mini-cart>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'mfe-checkout';
}
