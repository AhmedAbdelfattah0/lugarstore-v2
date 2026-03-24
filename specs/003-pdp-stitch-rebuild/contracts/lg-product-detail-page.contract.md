# Component Contract: `lg-product-detail-page`

**File**: `src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.ts`
**Selector**: `lg-product-detail-page`
**Route**: `/products/:id` (`RenderMode.Client`)
**Role**: Page shell — thin orchestration layer; reads route params, delegates state to `PdpStateService`, wires child component events to services

---

## Inputs / Outputs

This is a routed page component. It has no Angular `input()` / `output()` bindings. It receives its data from the router (`ActivatedRoute`) and exposes no public API surface.

---

## Injected Dependencies

| Dependency | Source | Purpose |
|------------|--------|---------|
| `PdpStateService` | `features/product-detail/services/` | All product state (product, related, loading, error, qty, selectedImageIdx) |
| `CartService` | `core/services/` | `add(CartItem)` on ADD TO CART |
| `WishlistService` | `core/services/` | `toggle(id)` + `isInWishlist(id)` |
| `ToastService` | `core/services/` | Show success/wishlist toast messages |
| `ActivatedRoute` | `@angular/router` | Read `:id` param via `toSignal(paramMap)` |
| `Router` | `@angular/router` | Navigate to `/products` on invalid ID, `/custom-order` on commission |
| `Title` | `@angular/platform-browser` | Set document title on product load |
| `Meta` | `@angular/platform-browser` | Set `description` + `og:image` meta tags |
| `PLATFORM_ID` | `@angular/core` | Guard `window.open()` for WhatsApp behind `isPlatformBrowser` |

---

## Route Param Detection (FR-021)

```typescript
private readonly paramMap = toSignal(this.route.paramMap);

constructor() {
  effect(() => {
    const id = this.paramMap()?.get('id');
    if (id) this.pdpState.loadProduct(+id);
  });
}
```

No naked `.subscribe()` permitted in this component for route detection.

---

## Layout

```
padding-top: 96px (clears fixed navbar)
display: grid
grid-template-columns: 55% 45%
min-height: 921px
─────────────────────────────────
│  lg-image-gallery  │  lg-product-info  │
─────────────────────────────────
         lg-scrollytelling (full-width below fold)
```

---

## Meta Tag Strategy

Updated inside `effect()` that watches `pdpState.product()`:

```typescript
effect(() => {
  const product = this.pdpState.product();
  if (!product) return;
  this.title.setTitle(`${product.title} — Lugar Furniture`);
  this.meta.updateTag({ name: 'description', content: product.description });
  this.meta.updateTag({ property: 'og:image', content: product.primaryImage });
});
```

---

## Breadcrumb Items

```typescript
readonly breadcrumbs = computed(() => {
  const product = this.pdpState.product();
  return [
    { label: 'Home',        route: '/'         },
    { label: 'Collections', route: '/products' },
    { label: product?.title ?? '', route: null  },
  ];
});
```

---

## Child Component Bindings

```html
<!-- Above-fold grid -->
<div class="pdp__split">
  <lg-image-gallery
    [images]="pdpState.product()!.images"
    [selectedIndex]="pdpState.selectedImageIdx()"
    (selectImage)="pdpState.setSelectedImageIdx($event)"
  />
  <lg-product-info
    [product]="pdpState.product()!"
    [qty]="pdpState.qty()"
    [isWishlisted]="isWishlisted(pdpState.product()!.id)"
    (qtyChange)="pdpState.setQty($event)"
    (addToCart)="onAddToCart()"
    (wishlistToggle)="onWishlistToggle()"
    (whatsappEnquire)="onWhatsappEnquire()"
    (commissionCustom)="onCommissionCustom()"
  />
</div>

<!-- Below-fold scrollytelling -->
<lg-scrollytelling
  [relatedProducts]="pdpState.relatedProducts()"
  [categoryId]="pdpState.product()?.categoryId ?? 0"
  (addRelatedToCart)="onRelatedAddToCart($event)"
  (addRelatedToWishlist)="onRelatedAddToWishlist($event)"
/>
```

---

## State Cleanup

On component destroy: `pdpState.reset()` resets all signals to initial values, preventing stale state from bleeding into the next product visit.

---

## Constraints

- Route uses `RenderMode.Client` — no SSR prerender (dynamic `:id` unknown at build time)
- All browser-only operations (`window.open` for WhatsApp) must be guarded with `isPlatformBrowser`
- No business logic — all computed values live in `PdpStateService`
- Navigation to `/products` when `id` param is absent or invalid
