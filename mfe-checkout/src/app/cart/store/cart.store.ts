import { Injectable, computed, inject, signal } from '@angular/core';
import { CartService } from '../services/cart.service';
import { AddCartItemRequest, CartState, MiniCart } from '../models/cart.models';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly cartService = inject(CartService);

  // --- State ---
  private readonly _state = signal<CartState>({
    miniCart: null,
    loading: false,
    error: null,
  });

  // --- Selectors ---
  readonly miniCart = computed(() => this._state().miniCart);
  readonly itemCount = computed(() => this._state().miniCart?.itemCount ?? 0);
  readonly total = computed(() => this._state().miniCart?.total ?? 0);
  readonly loading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);

  // --- Actions ---
  refreshMiniCart(): void {
    this._patchState({ loading: true, error: null });
    this.cartService.getMiniCart().subscribe({
      next: (miniCart: MiniCart) => this._patchState({ miniCart, loading: false }),
      error: (err: Error) => this._patchState({ error: err.message, loading: false }),
    });
  }

  addItem(request: AddCartItemRequest): void {
    this._patchState({ loading: true, error: null });
    this.cartService.addItem(request).subscribe({
      next: (cart) =>
        this._patchState({
          miniCart: { itemCount: cart.itemCount, total: cart.total },
          loading: false,
        }),
      error: (err: Error) => this._patchState({ error: err.message, loading: false }),
    });
  }

  private _patchState(partial: Partial<CartState>): void {
    this._state.update((s) => ({ ...s, ...partial }));
  }
}
