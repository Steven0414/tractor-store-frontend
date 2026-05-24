import { TitleCasePipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryFilter } from '../../core/models/catalog.models';
import { CatalogStore } from '../../store/catalog.store';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [TitleCasePipe, CurrencyPipe],
  templateUrl: './category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent implements OnInit {
  readonly store = inject(CatalogStore);
  private readonly route = inject(ActivatedRoute);

  readonly filters: CategoryFilter[] = ['all', 'classic', 'autonomous'];

  ngOnInit(): void {
    const filter = (this.route.snapshot.paramMap.get('filter') ?? 'all') as CategoryFilter;
    this.store.loadCategoriesByFilter(filter);
  }

  applyFilter(filter: CategoryFilter): void {
    this.store.loadCategoriesByFilter(filter);
  }
}
