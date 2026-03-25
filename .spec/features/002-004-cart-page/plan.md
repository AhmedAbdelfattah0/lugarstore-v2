# Technical Plan: 002-004-cart-page
> Project Type: 
> UI Framework: 
> Date: 2026-03-25

---

## Tech Stack

State: Angular Signals (CartService) | Forms: None | HTTP: None | Routing: Router.navigate() | Auth guard: None

---

## Folder Structure

```
src/app/features/cart/pages/lg-cart-page/lg-cart-page.component.ts
src/app/features/cart/pages/lg-cart-page/lg-cart-page.component.html
src/app/features/cart/pages/lg-cart-page/lg-cart-page.component.scss
```

---

## Signal Store Design

items = CartService.items() (readonly signal CartItem[]) | count = CartService.count() (computed number) | total = CartService.total() (computed number)

---

## Repository Service

None — CartService is localStorage-only, no HTTP repository

---

## Model Definitions

CartItem { id: number; title: string; image: string; qty: number; price: number } (existing, from shared/models)

---

## Routing

{ path: 'cart', component: LgCartPageComponent } — already registered in app.routes.ts

---

## UI Components

Colors: surface #fff8f1, bg #F9F1E7, text #1e1b15, muted #4e4637, gold #7a5900, border #d2c5b1, row-border #E8E8E8 | Typography: Cormorant Garamond heading, Montserrat Light uppercase col headers, Inter body/prices | Spacing: section padding 80px desktop, 40px mobile, row padding 24px vertical | Layout: 65fr 35fr CSS grid desktop, single col mobile | Button: bg #7a5900, text #fff, Montserrat Light uppercase, padding 14px 32px

---

## SSR Safety

No direct browser APIs used on this page; lg-quantity-stepper and lg-order-summary are pure input/output components; Router.navigate() is SSR-safe

---

## RTL Considerations

N/A

---

## Risks & Mitigations

CartItem.price is stored as active price — no risk of double-discount | lg-order-summary already computes subtotal from items() so no duplication | Mobile sticky button needs z-index management
