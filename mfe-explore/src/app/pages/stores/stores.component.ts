import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '../../core/models/catalog.models';
import { CatalogStore } from '../../store/catalog.store';

@Component({
  selector: 'app-stores',
  standalone: true,
  imports: [],
  templateUrl: './stores.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoresComponent implements OnInit {
  readonly store = inject(CatalogStore);
  readonly searchQuery = signal('');

  readonly filteredStores = () => {
    const q = this.searchQuery().toLowerCase();
    return this.store.stores().filter(
      (s: Store) =>
        s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
    );
  };

  ngOnInit(): void {
    this.store.loadStores();
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }
}
