import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { ProductStore } from '../../store/product.store';

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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const sku = this.decodeSku(this.route.snapshot.queryParamMap.get('sku'));
    this.store.loadProduct(id, sku);
  }

  onVariantSelect(sku: string): void {
    this.store.selectVariant(sku);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sku: this.encodeSku(sku) },
      queryParamsHandling: 'merge',
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
