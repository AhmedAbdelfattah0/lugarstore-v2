import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

export const checkoutGuard: CanActivateFn = () => {
  const cart   = inject(CartService);
  const router = inject(Router);
  return cart.count() > 0 ? true : router.createUrlTree(['/cart']);
};
