import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { unsavedChangesGuard } from './unsaved-changes.guard';
import { CheckoutComponent } from '../pages/checkout/checkout.component';

describe('unsavedChangesGuard', () => {
  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  function runGuard(component: Partial<CheckoutComponent>): boolean {
    return TestBed.runInInjectionContext(() =>
      unsavedChangesGuard(component as CheckoutComponent, mockRoute, mockState, mockState)
    ) as boolean;
  }

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should return true when order is confirmed', () => {
    const component = {
      orderStore: { confirmed: () => true },
      isFormDirty: false,
    } as unknown as CheckoutComponent;
    expect(runGuard(component)).toBeTrue();
  });

  it('should return true when form is clean and not confirmed', () => {
    const component = {
      orderStore: { confirmed: () => false },
      isFormDirty: false,
    } as unknown as CheckoutComponent;
    expect(runGuard(component)).toBeTrue();
  });

  it('should open confirm dialog when form is dirty', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const component = {
      orderStore: { confirmed: () => false },
      isFormDirty: true,
    } as unknown as CheckoutComponent;
    expect(runGuard(component)).toBeTrue();
    expect(window.confirm).toHaveBeenCalled();
  });

  it('should return false when user cancels the confirm dialog', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const component = {
      orderStore: { confirmed: () => false },
      isFormDirty: true,
    } as unknown as CheckoutComponent;
    expect(runGuard(component)).toBeFalse();
  });
});
