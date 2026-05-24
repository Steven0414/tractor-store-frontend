import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HomeData, Product, Store } from '../models/catalog.models';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/catalog';

  getHome(): Observable<HomeData> {
    return this.http.get<HomeData>(`${this.baseUrl}/home`);
  }

  getCategoriesByFilter(filter: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/categories/${filter}`);
  }

  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.baseUrl}/stores`);
  }
}
