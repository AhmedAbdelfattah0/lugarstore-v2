import { Routes } from '@angular/router';
import { LgHomePageComponent } from './features/home/pages/lg-home-page/lg-home-page.component';

import { LgWishlistPageComponent } from './features/wishlist/pages/lg-wishlist-page/lg-wishlist-page.component';
import { LgCheckoutPageComponent } from './features/checkout/pages/lg-checkout-page/lg-checkout-page.component';
import { LgHotDealsPageComponent } from './features/hot-deals/pages/lg-hot-deals-page/lg-hot-deals-page.component';
import { LgContactPageComponent } from './features/contact/pages/lg-contact-page/lg-contact-page.component';
import { LgCustomOrderPageComponent } from './features/custom-order/pages/lg-custom-order-page/lg-custom-order-page.component';
import { LgAtelierPageComponent } from './features/atelier/pages/lg-atelier-page/lg-atelier-page.component';

export const routes: Routes = [
  { path: '',            component: LgHomePageComponent },
  { path: 'products',    loadComponent: () => import('./features/products/pages/lg-products-page/lg-products-page.component').then(m => m.LgProductsPageComponent) },
  { path: 'products/:id', loadComponent: () => import('./features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component').then(m => m.LgProductDetailPageComponent) },
  { path: 'cart',        loadComponent: () => import('./features/cart/pages/lg-cart-page/lg-cart-page.component').then(m => m.LgCartPageComponent) },
  { path: 'wishlist',    component: LgWishlistPageComponent },
  { path: 'checkout',    component: LgCheckoutPageComponent },
  { path: 'hot-deals',   component: LgHotDealsPageComponent },
  { path: 'contact',     component: LgContactPageComponent },
  { path: 'custom-order', component: LgCustomOrderPageComponent },
  { path: 'atelier',     component: LgAtelierPageComponent },
  { path: '**',          redirectTo: '' },
];
