import { Injectable, computed, inject, signal } from '@angular/core';
import { OrderService } from '../services/order.service';
import { OrderState, PlaceOrderRequest } from '../models/order.models';
import { CartItem } from '../../cart/models/cart.models';

@Injectable({ providedIn: 'root' })
export class OrderStore {
  private readonly orderService = inject(OrderService);

  private readonly _state = signal<OrderState>({
    loading: false,
    error: null,
    confirmed: false,
    orderId: null,
    total: null,
  });

  readonly loading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);
  readonly confirmed = computed(() => this._state().confirmed);
  readonly orderId = computed(() => this._state().orderId);
  readonly total = computed(() => this._state().total);

  placeOrder(formValue: Omit<PlaceOrderRequest, 'items'>, cartItems: CartItem[]): void {
    const request: PlaceOrderRequest = {
      ...formValue,
      items: cartItems.map(i => ({
        sku: i.sku,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      })),
    };

    this._patch({ loading: true, error: null });
    this.orderService.placeOrder(request).subscribe({
      next: res => {
        this._patch({ loading: false, confirmed: true, orderId: res.orderId, total: res.total });
        document.dispatchEvent(new CustomEvent('checkout:cart-updated'));
      },
      error: problem => this._patch({ loading: false, error: problem }),
    });
  }

  reset(): void {
    this._state.set({ loading: false, error: null, confirmed: false, orderId: null, total: null });
  }

  private _patch(partial: Partial<OrderState>): void {
    this._state.update(s => ({ ...s, ...partial }));
  }
}
