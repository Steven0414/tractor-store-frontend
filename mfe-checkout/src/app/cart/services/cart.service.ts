import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddCartItemRequest, Cart, MiniCart } from '../models/cart.models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/cart';

  getMiniCart(): Observable<MiniCart> {
    return this.http.get<MiniCart>(`${this.baseUrl}/mini`, { withCredentials: true });
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.baseUrl, { withCredentials: true });
  }

  addItem(request: AddCartItemRequest): Observable<Cart> {
    return this.http.post<Cart>(`${this.baseUrl}/items`, request, { withCredentials: true });
  }
}
