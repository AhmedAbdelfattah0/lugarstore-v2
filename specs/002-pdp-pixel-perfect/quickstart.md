# Quickstart: PDP Pixel-Perfect Build (002)

**Branch**: `002-pdp-pixel-perfect`

---

## Prerequisites

```bash
# Ensure you are on the correct branch
git checkout 002-pdp-pixel-perfect

# Install dependencies (if not already done)
npm install

# Serve with SSR pre-rendering enabled
npm run start
```

---

## Development Server

```bash
# Development (browser-only, fastest iteration)
ng serve

# Full SSR pre-render check (run before committing)
ng build --output-mode static
```

---

## Key Entry Points

| What | Path |
|---|---|
| Page component | `src/app/features/product-detail/pages/lg-product-detail-page/` |
| State service | `src/app/features/product-detail/services/pdp-state.service.ts` |
| New: image gallery | `src/app/features/product-detail/components/lg-image-gallery/` |
| New: product info panel | `src/app/features/product-detail/components/lg-product-info/` |
| New: scrollytelling | `src/app/features/product-detail/components/lg-scrollytelling/` |
| Route | `/products/:id` (lazy via `app.routes.ts`) |
| Product model | `src/app/shared/models/product.model.ts` |
| Cart service | `src/app/core/services/cart.service.ts` |
| Wishlist service | `src/app/core/services/wishlist.service.ts` |

---

## Implementation Order

1. **Extract Stitch measurements** — Run Stitch MCP on frame `6ef3ffb4cfd84747bba4a16d4d56455d`, record all values in a comment block at the top of the page SCSS file
2. **Add whatsapp phone** — Add `whatsappPhone: '20XXXXXXXXXX'` to both environment files
3. **Create `lg-image-gallery`** — Standalone, OnPush, inputs/outputs per data-model.md
4. **Create `lg-product-info`** — Standalone, OnPush, inputs/outputs per data-model.md
5. **Create `lg-scrollytelling`** — Standalone, OnPush, inputs/outputs per data-model.md
6. **Refactor page template** — Replace inline template sections with the three new components
7. **Apply Stitch measurements** — Reconcile all SCSS values with Stitch output
8. **Verify production build** — `ng build --output-mode static` — zero errors, zero warnings

---

## Live Test Route

```
http://localhost:4200/products/1
http://localhost:4200/products/5
```

Use IDs that exist in the live API to test real product data.

---

## Constitution Self-Check (run mentally before each commit)

```
Architecture:
✅ lg- prefix on all new components
✅ Standalone + OnPush
✅ No service injections in sub-components (lg-image-gallery, lg-product-info, lg-scrollytelling)
✅ Signals only in PdpStateService

Data:
✅ Product model consumed — never RawProduct
✅ activePrice from PdpStateService.activePrice()
✅ Images via product.images[] array

SSR:
✅ GSAP only in ngAfterViewInit + isPlatformBrowser guard
✅ No direct localStorage — use existing StorageService pattern
✅ Title + Meta set via PdpStateService effect() in page component

Design:
✅ All measurements from Stitch frame — no guessing
✅ Gold #B88E2F only for active thumbnail border, price, CTAs
✅ Cormorant Garamond for h1 title
✅ No border-radius > 4px, no shadows, no gradients
```
