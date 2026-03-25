import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateOrderPayload } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  createOrder(payload: CreateOrderPayload): Observable<unknown> {
    return this.http.post('/orders/create_order.php', payload);
  }
}
