import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddCartItemRequest } from '../models/cart.models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/cart';

  addItem(request: AddCartItemRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/items`, request, { withCredentials: true });
  }
}
