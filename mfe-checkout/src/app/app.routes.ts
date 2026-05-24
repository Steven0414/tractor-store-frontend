import { Routes } from '@angular/router';
import { unsavedChangesGuard } from './checkout/guards/unsaved-changes.guard';

export const routes: Routes = [
  {
    path: 'checkout',
    loadComponent: () =>
      import('./checkout/pages/checkout/checkout.component').then(
        m => m.CheckoutComponent
      ),
    canDeactivate: [unsavedChangesGuard],
  },
  { path: '**', redirectTo: 'checkout' },
];
