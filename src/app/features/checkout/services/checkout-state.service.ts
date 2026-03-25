import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { CreateOrderPayload } from '../../../shared/models';
import { Country, CountryService } from './country.service';
import { OrderService } from './order.service';

@Injectable({ providedIn: 'root' })
export class CheckoutStateService {
  private readonly countryService = inject(CountryService);
  private readonly orderService   = inject(OrderService);

  private readonly _countries    = signal<Country[]>([]);
  private readonly _isLoading    = signal(false);
  private readonly _isSubmitting = signal(false);

  readonly countries    = this._countries.asReadonly();
  readonly isLoading    = this._isLoading.asReadonly();
  readonly isSubmitting = this._isSubmitting.asReadonly();

  loadCountries(): void {
    if (this._countries().length > 0) return;
    this._isLoading.set(true);
    this.countryService.getCountries().subscribe({
      next:  (data) => { this._countries.set(data); this._isLoading.set(false); },
      error: ()     => this._isLoading.set(false),
    });
  }

  statesFor(countryName: string): { name: string }[] {
    return this._countries().find(c => c.name === countryName)?.states ?? [];
  }

  submit(payload: CreateOrderPayload): Observable<unknown> {
    this._isSubmitting.set(true);
    return this.orderService.createOrder(payload).pipe(
      finalize(() => this._isSubmitting.set(false)),
    );
  }
}
