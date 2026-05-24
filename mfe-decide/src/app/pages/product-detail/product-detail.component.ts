import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  effect,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { ProductStore } from '../../store/product.store';
import { InventoryStore } from '../../inventory/store/inventory.store';
import { CartService } from '../../cart/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe, TitleCasePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit {
  readonly store = inject(ProductStore);
  readonly inventoryStore = inject(InventoryStore);
  private readonly cartService = inject(CartService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor() {
    // Re-check inventory whenever the selected SKU changes (handles initial auto-select too)
    effect(() => {
      const sku = this.store.selectedSku();
      if (sku) {
        this.inventoryStore.checkInventory(sku);
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const sku = this.decodeSku(this.route.snapshot.queryParamMap.get('sku'));
    this.store.loadProduct(id, sku);
  }

  onVariantSelect(sku: string): void {
    this.store.selectVariant(sku);
    this.inventoryStore.checkInventory(sku);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sku: this.encodeSku(sku) },
      queryParamsHandling: 'merge',
    });
  }

  onAddToCart(): void {
    const variant = this.store.selectedVariant();
    const product = this.store.product();
    if (!variant || !product) return;

    this.cartService
      .addItem({
        sku: variant.sku,
        name: `${product.name} – ${variant.color} / ${variant.motor}`,
        quantity: 1,
        price: variant.price,
      })
      .subscribe({
        next: () =>
          document.dispatchEvent(new CustomEvent('checkout:cart-updated')),
        error: (err: Error) => console.error('Error adding to cart:', err.message),
      });
  }

  /** Encodes the SKU for safe inclusion in a query param */
  private encodeSku(sku: string): string {
    return encodeURIComponent(sku);
  }

  /** Decodes a SKU retrieved from a query param */
  private decodeSku(raw: string | null): string | null {
    if (!raw) return null;
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }
}
