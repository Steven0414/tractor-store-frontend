import { CanDeactivateFn } from '@angular/router';
import { CheckoutComponent } from '../pages/checkout/checkout.component';

/**
 * Prevents accidental navigation away from the checkout form
 * when the user has entered data but hasn't confirmed the order yet.
 */
export const unsavedChangesGuard: CanDeactivateFn<CheckoutComponent> = (component) => {
  if (component.orderStore.confirmed()) {
    return true;
  }
  if (component.isFormDirty) {
    return window.confirm(
      '¿Seguro que deseas salir? Los datos del formulario se perderán.'
    );
  }
  return true;
};
