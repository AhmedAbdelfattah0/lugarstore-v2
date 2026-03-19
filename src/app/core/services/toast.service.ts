import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'success' | 'error' | 'wishlist' | 'info';

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private nextId = 0;

  show(message: string, variant: ToastVariant = 'info', duration = 3000): void {
    const id = ++this.nextId;
    this._toasts.update(toasts => [...toasts, { id, message, variant, duration }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  dismiss(id: number): void {
    this._toasts.update(toasts => toasts.filter(t => t.id !== id));
  }
}
