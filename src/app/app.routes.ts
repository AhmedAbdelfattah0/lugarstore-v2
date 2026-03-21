import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/pages/lg-home-page/lg-home-page.component').then(
        m => m.LgHomePageComponent,
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/pages/lg-products-page/lg-products-page.component').then(
        m => m.LgProductsPageComponent,
      ),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component').then(
        m => m.LgProductDetailPageComponent,
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/pages/lg-cart-page/lg-cart-page.component').then(
        m => m.LgCartPageComponent,
      ),
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./features/wishlist/pages/lg-wishlist-page/lg-wishlist-page.component').then(
        m => m.LgWishlistPageComponent,
      ),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/checkout/pages/lg-checkout-page/lg-checkout-page.component').then(
        m => m.LgCheckoutPageComponent,
      ),
  },
  {
    path: 'hot-deals',
    loadComponent: () =>
      import('./features/hot-deals/pages/lg-hot-deals-page/lg-hot-deals-page.component').then(
        m => m.LgHotDealsPageComponent,
      ),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/pages/lg-contact-page/lg-contact-page.component').then(
        m => m.LgContactPageComponent,
      ),
  },
  {
    path: 'custom-order',
    loadComponent: () =>
      import('./features/custom-order/pages/lg-custom-order-page/lg-custom-order-page.component').then(
        m => m.LgCustomOrderPageComponent,
      ),
  },
  {
    path: 'atelier',
    loadComponent: () =>
      import('./features/atelier/pages/lg-atelier-page/lg-atelier-page.component').then(
        m => m.LgAtelierPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
