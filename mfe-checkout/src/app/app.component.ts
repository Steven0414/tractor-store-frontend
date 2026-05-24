import { Component } from '@angular/core';
import { MiniCartComponent } from './cart/components/mini-cart/mini-cart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MiniCartComponent],
  template: `<app-mini-cart></app-mini-cart>`,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'mfe-checkout';
}
