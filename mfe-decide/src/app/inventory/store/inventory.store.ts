import { Injectable, computed, inject, signal } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { InventoryState, InventoryStatus } from '../models/inventory.models';

@Injectable({ providedIn: 'root' })
export class InventoryStore {
  private readonly inventoryService = inject(InventoryService);

  // --- State ---
  private readonly _state = signal<InventoryState>({
    sku: null,
    quantity: 0,
    available: false,
    loading: false,
    error: null,
  });

  // --- Selectors ---
  readonly sku = computed(() => this._state().sku);
  readonly quantity = computed(() => this._state().quantity);
  readonly available = computed(() => this._state().available);
  readonly loading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);

  // --- Actions ---
  checkInventory(sku: string): void {
    this._patchState({ loading: true, error: null, sku });
    this.inventoryService.getInventory(sku).subscribe({
      next: (status: InventoryStatus) =>
        this._patchState({
          quantity: status.quantity,
          available: status.available,
          loading: false,
        }),
      error: (err: Error) =>
        this._patchState({ error: err.message, loading: false, available: false, quantity: 0 }),
    });
  }

  reset(): void {
    this._patchState({ sku: null, quantity: 0, available: false, loading: false, error: null });
  }

  private _patchState(partial: Partial<InventoryState>): void {
    this._state.update((s) => ({ ...s, ...partial }));
  }
}
