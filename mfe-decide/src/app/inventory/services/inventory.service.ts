import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryStatus } from '../models/inventory.models';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/inventory';

  getInventory(sku: string): Observable<InventoryStatus> {
    return this.http.get<InventoryStatus>(`${this.baseUrl}/${encodeURIComponent(sku)}`);
  }
}
