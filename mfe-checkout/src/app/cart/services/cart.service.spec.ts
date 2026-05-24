import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CartService } from './cart.service';
import { AddCartItemRequest, Cart, MiniCart } from '../models/cart.models';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getMiniCart() should GET /api/cart/mini', () => {
    const mock: MiniCart = { itemCount: 2, total: 100 };
    service.getMiniCart().subscribe(res => expect(res).toEqual(mock));
    const req = httpMock.expectOne('/api/cart/mini');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('getCart() should GET /api/cart', () => {
    const mock: Cart = { items: [], itemCount: 0, total: 0 };
    service.getCart().subscribe(res => expect(res).toEqual(mock));
    const req = httpMock.expectOne('/api/cart');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('addItem() should POST /api/cart/items', () => {
    const request: AddCartItemRequest = { sku: 'SKU1', name: 'Item', quantity: 1, price: 50 };
    const mock: Cart = { items: [], itemCount: 1, total: 50 };
    service.addItem(request).subscribe(res => expect(res).toEqual(mock));
    const req = httpMock.expectOne('/api/cart/items');
    expect(req.request.method).toBe('POST');
    req.flush(mock);
  });
});
