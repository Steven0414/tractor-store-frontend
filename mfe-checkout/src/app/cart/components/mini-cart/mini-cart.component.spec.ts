import { ComponentFixture, TestBed } from '@angular/core/testing';
import { computed } from '@angular/core';
import { MiniCartComponent } from './mini-cart.component';
import { CartStore } from '../../store/cart.store';

describe('MiniCartComponent', () => {
  let fixture: ComponentFixture<MiniCartComponent>;
  let component: MiniCartComponent;
  let storeSpy: jasmine.SpyObj<CartStore>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CartStore', ['refreshMiniCart'], {
      miniCart: computed(() => null),
      itemCount: computed(() => 0),
      total: computed(() => 0),
      loading: computed(() => false),
      error: computed(() => null),
    });

    await TestBed.configureTestingModule({
      imports: [MiniCartComponent],
      providers: [{ provide: CartStore, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(MiniCartComponent);
    component = fixture.componentInstance;
    storeSpy = TestBed.inject(CartStore) as jasmine.SpyObj<CartStore>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit() should call store.refreshMiniCart()', () => {
    expect(storeSpy.refreshMiniCart).toHaveBeenCalled();
  });

  it('ngOnDestroy() should remove the event listener', () => {
    spyOn(document, 'removeEventListener');
    component.ngOnDestroy();
    expect(document.removeEventListener).toHaveBeenCalledWith(
      'checkout:cart-updated',
      jasmine.any(Function)
    );
  });

  it('should call refreshMiniCart when checkout:cart-updated fires', () => {
    storeSpy.refreshMiniCart.calls.reset();
    document.dispatchEvent(new CustomEvent('checkout:cart-updated'));
    expect(storeSpy.refreshMiniCart).toHaveBeenCalled();
  });
});
