import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactMessagePayload {
  name:    string;
  email:   string;
  phone:   string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);

  sendMessage(payload: ContactMessagePayload): Observable<unknown> {
    return this.http.post('/messages/create_message.php', payload);
  }
}
