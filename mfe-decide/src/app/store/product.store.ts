import { Injectable, computed, inject, signal } from '@angular/core';
import { ProductService } from '../core/services/product.service';
import {
  ProductDetail,
  ProductDetailState,
  ProductVariant,
} from '../core/models/product.models';

@Injectable({ providedIn: 'root' })
export class ProductStore {
  private readonly productService = inject(ProductService);

  // --- State ---
  private readonly _state = signal<ProductDetailState>({
    product: null,
    selectedSku: null,
    loading: false,
    error: null,
  });

  // --- Selectors ---
  readonly product = computed(() => this._state().product);
  readonly selectedSku = computed(() => this._state().selectedSku);
  readonly loading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);

  readonly selectedVariant = computed((): ProductVariant | null => {
    const product = this._state().product;
    const sku = this._state().selectedSku;
    if (!product || !sku) return product?.variants[0] ?? null;
    return product.variants.find((v) => v.sku === sku) ?? product.variants[0] ?? null;
  });

  // --- Actions ---
  loadProduct(id: string, initialSku: string | null): void {
    this._patchState({ loading: true, error: null });
    this.productService.getProduct(id).subscribe({
      next: (product: ProductDetail) => {
        const firstSku = product.variants[0]?.sku ?? null;
        const sku =
          initialSku && product.variants.some((v) => v.sku === initialSku)
            ? initialSku
            : firstSku;
        this._patchState({ product, selectedSku: sku, loading: false });
      },
      error: (err: Error) =>
        this._patchState({ error: err.message, loading: false }),
    });
  }

  selectVariant(sku: string): void {
    this._patchState({ selectedSku: sku });
  }

  clearError(): void {
    this._patchState({ error: null });
  }

  reset(): void {
    this._patchState({ product: null, selectedSku: null, loading: false, error: null });
  }

  private _patchState(partial: Partial<ProductDetailState>): void {
    this._state.update((s) => ({ ...s, ...partial }));
  }
}
