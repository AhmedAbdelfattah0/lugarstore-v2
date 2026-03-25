import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  effect,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService } from '../../../../core/services/cart.service';
import { ToastService } from '../../../../core/services/toast.service';
import { CreateOrderPayload } from '../../../../shared/models';
import { CheckoutStateService } from '../../services/checkout-state.service';
import { LgNavbarComponent } from '../../../../shared/components/navigation/lg-navbar/lg-navbar.component';
import { LgFooterComponent } from '../../../../shared/components/navigation/lg-footer/lg-footer.component';
import { LgOrderSummaryComponent } from '../../../../shared/components/commerce/lg-order-summary/lg-order-summary.component';
import { LgSpinnerComponent } from '../../../../shared/components/ui/lg-spinner/lg-spinner.component';

@Component({
  selector: 'lg-checkout-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    LgNavbarComponent,
    LgFooterComponent,
    LgOrderSummaryComponent,
    LgSpinnerComponent,
  ],
  templateUrl: './lg-checkout-page.component.html',
  styleUrl:    './lg-checkout-page.component.scss',
})
export class LgCheckoutPageComponent {
  protected readonly state = inject(CheckoutStateService);
  protected readonly cart  = inject(CartService);
  private readonly toast   = inject(ToastService);
  private readonly router  = inject(Router);
  private readonly meta    = inject(Meta);
  private readonly title   = inject(Title);

  protected readonly form = new FormGroup({
    firstName:     new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName:      new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    country:       new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    state:         new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    streetAddress: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    city:          new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phone:         new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email:         new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    notes:         new FormControl('', { nonNullable: true }),
  });

  protected readonly selectedCountry = toSignal(
    this.form.controls.country.valueChanges,
    { initialValue: '' },
  );

  protected readonly stateOptions = computed(() =>
    this.state.statesFor(this.selectedCountry()),
  );

  constructor() {
    this.title.setTitle('Checkout — Lugar Furniture');
    this.meta.updateTag({ name: 'description', content: 'Complete your Lugar Furniture order.' });

    this.state.loadCountries();

    // Reset governorate/state when country changes
    effect(() => {
      this.selectedCountry();
      this.form.controls.state.setValue('', { emitEvent: false });
    });
  }

  protected onSubmit(): void {
    if (this.state.isSubmitting()) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const payload: CreateOrderPayload = {
      name:        `${v.firstName} ${v.lastName}`,
      phoneNumber: v.phone,
      address:     `${v.streetAddress}, ${v.city}`,
      state:       v.state,
      statusId:    2,
      date:        new Date(),
      email:       v.email,
      products:    this.cart.items().map(item => ({ productId: item.id, qty: item.qty })),
    };

    this.state.submit(payload).subscribe({
      next: () => {
        this.cart.clear();
        this.router.navigate(['/order-success']);
      },
      error: () => {
        this.toast.show('Failed to place order. Please try again.', 'error');
      },
    });
  }

  protected fieldError(controlName: keyof typeof this.form.controls): string {
    const ctrl = this.form.controls[controlName];
    if (!ctrl.invalid || !ctrl.touched) return '';
    if (ctrl.errors?.['required']) return 'This field is required';
    if (ctrl.errors?.['email'])    return 'Please enter a valid email';
    return 'Invalid value';
  }
}
