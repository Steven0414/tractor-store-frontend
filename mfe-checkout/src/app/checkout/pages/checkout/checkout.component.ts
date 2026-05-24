import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { CartStore } from '../../../cart/store/cart.store';
import { OrderStore } from '../../../order/store/order.store';
import { CartService } from '../../../cart/services/cart.service';
import { Cart } from '../../../cart/models/cart.models';

interface CheckoutForm {
  firstName: AbstractControl<string>;
  lastName: AbstractControl<string>;
  email: AbstractControl<string>;
  phone: AbstractControl<string>;
  address: AbstractControl<string>;
  city: AbstractControl<string>;
  postalCode: AbstractControl<string>;
  paymentMethod: AbstractControl<string>;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent implements OnInit {
  readonly cartStore = inject(CartStore);
  readonly orderStore = inject(OrderStore);
  private readonly cartService = inject(CartService);
  private readonly fb = inject(FormBuilder);

  cart: Cart | null = null;

  form: FormGroup<CheckoutForm> = this.fb.group<CheckoutForm>({
    firstName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    lastName:  this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    email:     this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    phone:     this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/^\+?[0-9\s\-]{7,15}$/)]),
    address:   this.fb.nonNullable.control('', [Validators.required, Validators.minLength(5)]),
    city:      this.fb.nonNullable.control('', Validators.required),
    postalCode:this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/^[A-Z0-9\-]{3,10}$/i)]),
    paymentMethod: this.fb.nonNullable.control('credit_card', Validators.required),
  });

  ngOnInit(): void {
    this.cartService.getCart().subscribe(cart => (this.cart = cart));
  }

  get isFormDirty(): boolean {
    return this.form.dirty;
  }

  onSubmit(): void {
    if (this.form.invalid || !this.cart?.items?.length) return;
    this.orderStore.placeOrder(this.form.getRawValue(), this.cart.items);
  }

  fieldError(field: keyof CheckoutForm): string | null {
    const ctrl = this.form.get(field as string);
    if (!ctrl || !ctrl.invalid || !ctrl.touched) return null;
    if (ctrl.hasError('required')) return 'Este campo es obligatorio.';
    if (ctrl.hasError('email')) return 'Ingresa un email válido.';
    if (ctrl.hasError('minlength')) return `Mínimo ${ctrl.errors?.['minlength']?.requiredLength} caracteres.`;
    if (ctrl.hasError('pattern')) return 'Formato inválido.';
    return 'Valor inválido.';
  }
}
