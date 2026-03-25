import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface CustomOrderPayload {
  name:      string;
  phone:     string;
  email:     string;
  city:      string;
  message:   string;
  imageUrls: string[];
}

@Injectable({ providedIn: 'root' })
export class CustomOrderService {
  private readonly http = inject(HttpClient);

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ url: string }>('/uploads/upload_reference_image.php', formData).pipe(
      map(res => res.url),
    );
  }

  submitOrder(payload: CustomOrderPayload): Observable<unknown> {
    return this.http.post('/orders/create_custom_order.php', payload);
  }
}
