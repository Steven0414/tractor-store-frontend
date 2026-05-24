import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-mini-cart',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './mini-cart.component.html',
  styleUrl: './mini-cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniCartComponent implements OnInit, OnDestroy {
  readonly store = inject(CartStore);

  private readonly _onCartUpdated = () => this.store.refreshMiniCart();

  ngOnInit(): void {
    this.store.refreshMiniCart();
    document.addEventListener('checkout:cart-updated', this._onCartUpdated);
  }

  ngOnDestroy(): void {
    document.removeEventListener('checkout:cart-updated', this._onCartUpdated);
  }
}
