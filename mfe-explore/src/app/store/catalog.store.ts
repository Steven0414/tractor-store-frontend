import { Injectable, computed, inject, signal } from '@angular/core';
import { CatalogService } from '../core/services/catalog.service';
import {
  CatalogState,
  CategoryFilter,
  HomeData,
  Product,
  Store,
} from '../core/models/catalog.models';

@Injectable({ providedIn: 'root' })
export class CatalogStore {
  private readonly catalogService = inject(CatalogService);

  // --- State (WritableSignals) ---
  private readonly _state = signal<CatalogState>({
    homeData: null,
    products: [],
    stores: [],
    activeFilter: 'all',
    loading: false,
    error: null,
  });

  // --- Selectors (Computed) ---
  readonly homeData = computed(() => this._state().homeData);
  readonly products = computed(() => this._state().products);
  readonly stores = computed(() => this._state().stores);
  readonly activeFilter = computed(() => this._state().activeFilter);
  readonly loading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);

  readonly filteredProducts = computed(() => {
    const filter = this._state().activeFilter;
    const products = this._state().products;
    if (filter === 'all') return products;
    return products.filter((p) => p.category === filter);
  });

  // --- Actions ---
  loadHome(): void {
    this._patchState({ loading: true, error: null });
    this.catalogService.getHome().subscribe({
      next: (homeData: HomeData) =>
        this._patchState({ homeData, loading: false }),
      error: (err: Error) =>
        this._patchState({ error: err.message, loading: false }),
    });
  }

  loadCategoriesByFilter(filter: CategoryFilter): void {
    this._patchState({ loading: true, error: null, activeFilter: filter });
    this.catalogService.getCategoriesByFilter(filter).subscribe({
      next: (products: Product[]) =>
        this._patchState({ products, loading: false }),
      error: (err: Error) =>
        this._patchState({ error: err.message, loading: false }),
    });
  }

  loadStores(): void {
    this._patchState({ loading: true, error: null });
    this.catalogService.getStores().subscribe({
      next: (stores: Store[]) => this._patchState({ stores, loading: false }),
      error: (err: Error) =>
        this._patchState({ error: err.message, loading: false }),
    });
  }

  setFilter(filter: CategoryFilter): void {
    this._patchState({ activeFilter: filter });
  }

  clearError(): void {
    this._patchState({ error: null });
  }

  private _patchState(partial: Partial<CatalogState>): void {
    this._state.update((s) => ({ ...s, ...partial }));
  }
}
