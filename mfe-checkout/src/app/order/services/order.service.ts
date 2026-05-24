import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PlaceOrderRequest, PlaceOrderResponse, ProblemDetail } from '../models/order.models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/orders';

  placeOrder(request: PlaceOrderRequest): Observable<PlaceOrderResponse> {
    return this.http
      .post<PlaceOrderResponse>(this.baseUrl, request, { withCredentials: true })
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => this._toProblemDetail(err))));
  }

  private _toProblemDetail(err: HttpErrorResponse): ProblemDetail {
    if (err.error && typeof err.error === 'object' && 'title' in err.error) {
      return err.error as ProblemDetail;
    }
    return {
      title: 'Error inesperado',
      detail: err.message,
      status: err.status,
    };
  }
}
