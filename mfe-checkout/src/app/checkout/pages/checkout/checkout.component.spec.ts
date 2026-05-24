import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { computed } from '@angular/core';
import { of } from 'rxjs';
import { CheckoutComponent } from './checkout.component';
import { CartStore } from '../../../cart/store/cart.store';
import { OrderStore } from '../../../order/store/order.store';
import { CartService } from '../../../cart/services/cart.service';
import { Cart } from '../../../cart/models/cart.models';

describe('CheckoutComponent', () => {
  let fixture: ComponentFixture<CheckoutComponent>;
  let component: CheckoutComponent;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let orderStoreSpy: jasmine.SpyObj<OrderStore>;

  const mockCart: Cart = {
    items: [{ sku: 'SKU1', name: 'Item', quantity: 1, price: 50, subtotal: 50 }],
    itemCount: 1,
    total: 50,
  };

  beforeEach(async () => {
    const cartSpy = jasmine.createSpyObj('CartService', ['getCart']);
    cartSpy.getCart.and.returnValue(of(mockCart));

    const orderSpy = jasmine.createSpyObj('OrderStore', ['placeOrder'], {
      confirmed: computed(() => false),
      loading: computed(() => false),
      error: computed(() => null),
      orderId: computed(() => null),
      total: computed(() => null),
    });

    const cartStoreSpy = jasmine.createSpyObj('CartStore', ['refreshMiniCart'], {
      miniCart: computed(() => null),
      itemCount: computed(() => 0),
      total: computed(() => 0),
      loading: computed(() => false),
      error: computed(() => null),
    });

    await TestBed.configureTestingModule({
      imports: [CheckoutComponent],
      providers: [
        { provide: CartService, useValue: cartSpy },
        { provide: OrderStore, useValue: orderSpy },
        { provide: CartStore, useValue: cartStoreSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    orderStoreSpy = TestBed.inject(OrderStore) as jasmine.SpyObj<OrderStore>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit() should load cart data', fakeAsync(() => {
    tick();
    expect(component.cart).toEqual(mockCart);
  }));

  it('isFormDirty should return false on pristine form', () => {
    expect(component.isFormDirty).toBeFalse();
  });

  it('isFormDirty should return true when form is dirty', () => {
    component.form.markAsDirty();
    expect(component.isFormDirty).toBeTrue();
  });

  it('onSubmit() should not call placeOrder when form is invalid', () => {
    component.onSubmit();
    expect(orderStoreSpy.placeOrder).not.toHaveBeenCalled();
  });

  it('onSubmit() should call placeOrder when form is valid and cart has items', () => {
    component.form.setValue({
      firstName: 'John', lastName: 'Doe', email: 'john@example.com',
      phone: '1234567', address: '123 Main St', city: 'City',
      postalCode: '12345', paymentMethod: 'credit_card',
    });
    component.onSubmit();
    expect(orderStoreSpy.placeOrder).toHaveBeenCalled();
  });

  it('fieldError() should return null for valid untouched field', () => {
    expect(component.fieldError('firstName')).toBeNull();
  });

  it('fieldError() should return required message for touched empty field', () => {
    const ctrl = component.form.get('firstName');
    ctrl?.markAsTouched();
    expect(component.fieldError('firstName')).toBe('Este campo es obligatorio.');
  });

  it('fieldError() should return email message for invalid email', () => {
    const ctrl = component.form.get('email');
    ctrl?.setValue('not-an-email');
    ctrl?.markAsTouched();
    expect(component.fieldError('email')).toBe('Ingresa un email válido.');
  });

  it('fieldError() should return minlength message for too-short value', () => {
    const ctrl = component.form.get('firstName');
    ctrl?.setValue('A');
    ctrl?.markAsTouched();
    expect(component.fieldError('firstName')).toBe('Mínimo 2 caracteres.');
  });

  it('fieldError() should return pattern message for invalid phone', () => {
    const ctrl = component.form.get('phone');
    ctrl?.setValue('abc');
    ctrl?.markAsTouched();
    expect(component.fieldError('phone')).toBe('Formato inválido.');
  });
});
