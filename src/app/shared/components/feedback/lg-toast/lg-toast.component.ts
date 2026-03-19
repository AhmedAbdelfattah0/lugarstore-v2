import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ToastService, ToastVariant } from '../../../../core/services/toast.service';

@Component({
  selector: 'lg-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lg-toast.component.html',
  styleUrl: './lg-toast.component.scss',
})
export class LgToastComponent {
  protected readonly toastService = inject(ToastService);

  itemClass(variant: ToastVariant): string {
    return `toast-item toast-${variant}`;
  }

  progressClass(variant: ToastVariant): string {
    const map: Record<ToastVariant, string> = {
      success: 'progress-gold',
      wishlist: 'progress-gold',
      error:   'progress-red',
      info:    'progress-dark',
    };
    return map[variant];
  }

  toastIcon(variant: ToastVariant): string {
    const map: Record<ToastVariant, string> = {
      success: '✓',
      wishlist: '♡',
      error:   '✕',
      info:    'i',
    };
    return map[variant];
  }
}
