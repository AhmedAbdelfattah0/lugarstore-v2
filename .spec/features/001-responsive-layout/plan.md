# Technical Plan: 001-responsive-layout
> Project Type: 
> UI Framework: 
> Date: 2026-03-24

---

## Tech Stack

State: Angular Signals (no changes) | Forms: none | HTTP: none | Routing: none | Auth guard: none | All changes are CSS/template only

---

## Folder Structure

```
src/styles.scss (add .section-content + .section-padding global utilities) | src/app/shared/components/navigation/lg-navbar/ | src/app/shared/components/layout/lg-footer/ | src/app/shared/components/filtering/lg-filter-bar/ | src/app/shared/components/filtering/lg-pagination/ | src/app/shared/components/product/lg-product-card/ | src/app/features/home/components/lg-hero/ | src/app/features/home/components/lg-categories-section/ | src/app/features/home/components/lg-promo-banner/ | src/app/features/home/components/lg-featured-collection/ | src/app/features/home/components/lg-room-slider/ | src/app/features/home/components/lg-atelier-section/ | src/app/shared/components/commerce/lg-trust-strip/ | src/app/features/products/components/lg-plp-header/ | src/app/features/products/pages/lg-products-page/ | src/app/features/product-detail/pages/lg-product-detail-page/ | src/app/features/product-detail/components/lg-image-gallery/ | src/app/features/product-detail/components/lg-scrollytelling/
```

---

## Signal Store Design

No new signals. All existing signals unchanged.

---

## Repository Service

No new HTTP methods. No repository changes.

---

## Model Definitions

No new models. All existing models unchanged.

---

## Routing

/products lazy | /products/:id lazy | / lazy — all routing unchanged

---

## UI Components

Global utilities: .section-content (max-width:1280px, margin:0 auto, padding:0 clamp(20px,5vw,60px)) and .section-padding (padding:clamp(40px,8vw,80px) 0) added to styles.scss. Tailwind v4 responsive: md:=768px+, lg:=1024px+. Typography clamp() for fluid scaling. Touch targets min 44px height. No horizontal overflow.

---

## SSR Safety

No browser APIs introduced. No new SSR concerns. Existing isPlatformBrowser guards unchanged.

---

## RTL Considerations

N/A

---

## Risks & Mitigations

Risk: Many files touched in one feature — mitigate by doing shared components first, then pages | Risk: Existing SCSS may conflict with new Tailwind classes — read each file before editing | Risk: lg-navbar hamburger already wired to DrawerService — preserve that wiring | Risk: Build budget may increase slightly with more utility classes — monitor angular.json budgets
