import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CartStore } from './cart.store';
import { CartService } from '../services/cart.service';
import { AddCartItemRequest, Cart, MiniCart } from '../models/cart.models';

describe('CartStore', () => {
  let store: CartStore;
  let cartService: jasmine.SpyObj<CartService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CartService', ['getMiniCart', 'addItem']);
    TestBed.configureTestingModule({
      providers: [CartStore, { provide: CartService, useValue: spy }],
    });
    store = TestBed.inject(CartStore);
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should have initial state', () => {
    expect(store.miniCart()).toBeNull();
    expect(store.itemCount()).toBe(0);
    expect(store.total()).toBe(0);
    expect(store.loading()).toBeFalse();
    expect(store.error()).toBeNull();
  });

  it('refreshMiniCart() should update miniCart on success', fakeAsync(() => {
    const mini: MiniCart = { itemCount: 3, total: 150 };
    cartService.getMiniCart.and.returnValue(of(mini));
    store.refreshMiniCart();
    tick();
    expect(store.miniCart()).toEqual(mini);
    expect(store.itemCount()).toBe(3);
    expect(store.total()).toBe(150);
    expect(store.loading()).toBeFalse();
  }));

  it('refreshMiniCart() should set error on failure', fakeAsync(() => {
    cartService.getMiniCart.and.returnValue(throwError(() => new Error('HTTP error')));
    store.refreshMiniCart();
    tick();
    expect(store.error()).toBe('HTTP error');
    expect(store.loading()).toBeFalse();
  }));

  it('addItem() should update miniCart on success', fakeAsync(() => {
    const cart: Cart = { items: [], itemCount: 2, total: 80 };
    cartService.addItem.and.returnValue(of(cart));
    const request: AddCartItemRequest = { sku: 'SKU1', name: 'Item', quantity: 1, price: 40 };
    store.addItem(request);
    tick();
    expect(store.itemCount()).toBe(2);
    expect(store.total()).toBe(80);
    expect(store.loading()).toBeFalse();
  }));

  it('addItem() should set error on failure', fakeAsync(() => {
    cartService.addItem.and.returnValue(throwError(() => new Error('Add error')));
    store.addItem({ sku: 'SKU1', name: 'Item', quantity: 1, price: 40 });
    tick();
    expect(store.error()).toBe('Add error');
    expect(store.loading()).toBeFalse();
  }));
});
