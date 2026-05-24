import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { OrderStore } from './order.store';
import { OrderService } from '../services/order.service';
import { CartItem } from '../../cart/models/cart.models';

describe('OrderStore', () => {
  let store: OrderStore;
  let orderService: jasmine.SpyObj<OrderService>;

  const cartItems: CartItem[] = [
    { sku: 'SKU1', name: 'Item 1', quantity: 2, price: 25, subtotal: 50 },
  ];

  const formValue = {
    firstName: 'John', lastName: 'Doe', email: 'john@example.com',
    phone: '1234567', address: '123 Main St', city: 'City',
    postalCode: '12345', paymentMethod: 'credit_card',
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('OrderService', ['placeOrder']);
    TestBed.configureTestingModule({
      providers: [OrderStore, { provide: OrderService, useValue: spy }],
    });
    store = TestBed.inject(OrderStore);
    orderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should have initial state', () => {
    expect(store.loading()).toBeFalse();
    expect(store.error()).toBeNull();
    expect(store.confirmed()).toBeFalse();
    expect(store.orderId()).toBeNull();
    expect(store.total()).toBeNull();
  });

  it('placeOrder() should set confirmed state on success', fakeAsync(() => {
    orderService.placeOrder.and.returnValue(of({ orderId: 'ORD-1', status: 'confirmed', total: 50 }));
    store.placeOrder(formValue, cartItems);
    tick();
    expect(store.confirmed()).toBeTrue();
    expect(store.orderId()).toBe('ORD-1');
    expect(store.total()).toBe(50);
    expect(store.loading()).toBeFalse();
  }));

  it('placeOrder() should dispatch checkout:cart-updated event on success', fakeAsync(() => {
    orderService.placeOrder.and.returnValue(of({ orderId: 'ORD-1', status: 'confirmed', total: 50 }));
    let eventFired = false;
    document.addEventListener('checkout:cart-updated', () => (eventFired = true), { once: true });
    store.placeOrder(formValue, cartItems);
    tick();
    expect(eventFired).toBeTrue();
  }));

  it('placeOrder() should set error on failure', fakeAsync(() => {
    const error = { title: 'Error', status: 500 };
    orderService.placeOrder.and.returnValue(throwError(() => error));
    store.placeOrder(formValue, cartItems);
    tick();
    expect(store.error()).toEqual(error);
    expect(store.loading()).toBeFalse();
  }));

  it('reset() should restore initial state', fakeAsync(() => {
    orderService.placeOrder.and.returnValue(of({ orderId: 'ORD-1', status: 'confirmed', total: 50 }));
    store.placeOrder(formValue, cartItems);
    tick();
    store.reset();
    expect(store.confirmed()).toBeFalse();
    expect(store.orderId()).toBeNull();
    expect(store.total()).toBeNull();
    expect(store.error()).toBeNull();
  }));
});
