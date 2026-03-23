# Implementation Plan: Product Detail Page (PDP) — Pixel-Perfect Build

**Branch**: `002-pdp-pixel-perfect` | **Date**: 2026-03-23 | **Spec**: [spec.md](./spec.md)

---

## Summary

The PDP page (`lg-product-detail-page`) and its state service (`PdpStateService`) are already substantially built from Phase 4. This feature completes the work by:

1. Extracting Stitch MCP design tokens from frame `6ef3ffb4cfd84747bba4a16d4d56455d`
2. Decomposing the monolithic page template into three standalone sub-components: `lg-image-gallery`, `lg-product-info`, and `lg-scrollytelling`
3. Reconciling all SCSS measurements with Stitch MCP output to achieve pixel-perfect fidelity

No new services or routes are needed — all infrastructure already exists.

---

## Technical Context

**Language/Version**: TypeScript 5.x / Angular 21 (zoneless, standalone)
**Primary Dependencies**: Angular Signals, GSAP (ScrollTrigger), Tailwind CSS v4, Angular SSR (pre-render)
**Storage**: localStorage via `StorageService` (cart + wishlist)
**Testing**: Manual browser verification + `ng build --output-mode static` clean build
**Target Platform**: Hostinger shared hosting — static pre-rendered HTML
**Project Type**: Frontend web application (luxury e-commerce)
**Performance Goals**: Page visible within 3 seconds on broadband; cart update < 200ms; thumbnail swap < 300ms
**Constraints**: Zero build errors; no runtime SSR server; all SCSS values from Stitch MCP
**Scale/Scope**: Single PDP route; ~3 new components; ~1 refactored page component

---

## Constitution Check

*GATE: Must pass before Phase 0. Re-checked post-design.*

| Principle | Gate | Status |
|---|---|---|
| I — Component Architecture | Sub-components must be standalone, OnPush, zero service injections | ✅ Pass — plan enforces this |
| I — Component Architecture | `inject()` not constructor injection in page component | ✅ Pass — existing page already uses inject() |
| I — Component Architecture | No business logic in sub-components | ✅ Pass — all logic stays in page + service |
| II — SSR Safety | GSAP in ngAfterViewInit + isPlatformBrowser guard | ✅ Pass — must be verified in lg-scrollytelling |
| II — SSR Safety | No direct localStorage | ✅ Pass — all storage via StorageService |
| II — SSR Safety | Title + Meta tags set per product | ✅ Pass — existing effect() in page handles this |
| III — Data Normalization | Sub-components consume only `Product` model | ✅ Pass — plan uses Product via @Input |
| IV — Design Fidelity | All measurements from Stitch MCP | ✅ Pass — Stitch extraction is Task 1 |
| IV — Design Fidelity | Gold sparingly; no radius > 4px; Cormorant Garamond headings | ✅ Pass — enforced in SCSS |
| V — Simplicity & YAGNI | No new abstractions beyond the three required components | ✅ Pass — plan adds exactly what's needed |

**Post-design re-check**: To be confirmed after SCSS values are reconciled with Stitch output.

**Complexity Tracking**: No violations requiring justification.

---

## Project Structure

### Documentation (this feature)

```text
specs/002-pdp-pixel-perfect/
├── plan.md              ← This file
├── spec.md              ← Feature specification
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── checklists/
│   └── requirements.md  ← Spec quality checklist
└── tasks.md             ← Phase 2 output (/speckit.tasks — not yet created)
```

### Source Code (this feature)

```text
src/app/
├── features/
│   └── product-detail/
│       ├── components/
│       │   ├── lg-image-gallery/           ← NEW
│       │   │   ├── lg-image-gallery.component.ts
│       │   │   ├── lg-image-gallery.component.html
│       │   │   └── lg-image-gallery.component.scss
│       │   ├── lg-product-info/            ← NEW
│       │   │   ├── lg-product-info.component.ts
│       │   │   ├── lg-product-info.component.html
│       │   │   └── lg-product-info.component.scss
│       │   └── lg-scrollytelling/          ← NEW
│       │       ├── lg-scrollytelling.component.ts
│       │       ├── lg-scrollytelling.component.html
│       │       └── lg-scrollytelling.component.scss
│       ├── pages/
│       │   └── lg-product-detail-page/     ← REFACTOR (template decomposed)
│       │       ├── lg-product-detail-page.component.ts
│       │       ├── lg-product-detail-page.component.html
│       │       └── lg-product-detail-page.component.scss
│       └── services/
│           └── pdp-state.service.ts        ← NO CHANGES
└── environments/
    ├── environment.ts                      ← ADD whatsappPhone
    └── environment.production.ts          ← ADD whatsappPhone
```

**Structure Decision**: Feature components live under `features/product-detail/components/` matching the established pattern used by all other feature-level components in the project.

---

## Phase 0: Research ✅ Complete

See [research.md](./research.md).

**Key findings**:

1. PDP is substantially pre-built — this is a refactor + pixel-perfect polish
2. `PdpStateService` requires no changes — already exposes all required signals
3. Three new sub-components must be extracted from the monolithic page template
4. Stitch MCP frame `6ef3ffb4cfd84747bba4a16d4d56455d` must be consulted as Task 1
5. WhatsApp phone number must be added to environment files
6. No new services, routes, or API changes required

---

## Phase 1: Design & Contracts ✅ Complete

See [data-model.md](./data-model.md).

### Component Contracts Summary

**`lg-image-gallery`**
```typescript
// Inputs
images: string[]           // required — up to 4 shown (slice:0:4)
selectedIndex: number      // required — active thumbnail index

// Outputs
selectImage: EventEmitter<number>  // emits new index on thumbnail click
```

**`lg-product-info`**
```typescript
// Inputs
product: Product           // required
qty: number                // required — current qty from PdpStateService
isWishlisted: boolean      // required — from WishlistService.isInWishlist()

// Outputs
qtyChange: EventEmitter<number>      // stepper value change
addToCart: EventEmitter<void>        // Add to Cart clicked
wishlistToggle: EventEmitter<void>   // Wishlist icon clicked
whatsappEnquire: EventEmitter<void>  // WhatsApp CTA clicked
commissionCustom: EventEmitter<void> // Commission Custom clicked
```

**`lg-scrollytelling`**
```typescript
// Inputs
relatedProducts: Product[]  // required — pre-filtered by PdpStateService

// Outputs
addRelatedToCart: EventEmitter<Product>      // related card Add to Cart
addRelatedToWishlist: EventEmitter<Product>  // related card wishlist toggle
```

### Page Component Responsibilities (unchanged)

`lg-product-detail-page` retains all service injections and acts as the orchestrator:
- Injects: `PdpStateService`, `CartService`, `WishlistService`, `ToastService`, `Router`, `Title`, `Meta`
- Reads route param `:id` → calls `pdpState.loadProduct(id)`
- Passes derived state down to sub-components via `@Input`
- Handles all outputs (wires to services, shows toasts, navigates)
- Builds WhatsApp URL via `buildWhatsAppUrl(title)` reading from `environment.whatsappPhone`
- Sets Title + Meta via `effect()` watching `pdpState.product()`

### Stitch Design Token Extraction (prerequisite to SCSS)

The following values MUST be extracted from Stitch MCP frame `6ef3ffb4cfd84747bba4a16d4d56455d` before any component SCSS is written or reconciled:

| Measurement | Used In |
|---|---|
| Split layout proportions (left % / right %) | `lg-product-detail-page` `.pdp__split` grid |
| Main image container height | `lg-image-gallery` `.gallery__main` |
| Thumbnail strip height | `lg-image-gallery` `.gallery__thumbs` |
| Thumbnail width | `lg-image-gallery` `.gallery__thumb` |
| Active thumbnail border width + color | `lg-image-gallery` `.gallery__thumb--active` |
| Info panel left/right padding | `lg-product-info` `.info` |
| Product title font-size | `lg-product-info` `.info__title` |
| Product title letter-spacing | `lg-product-info` `.info__title` |
| Category label font-size / tracking | `lg-product-info` `.info__category` |
| Price font-size (active + original) | `lg-product-info` `.info__price` |
| Description font-size / line-height | `lg-product-info` `.info__description` |
| CTA button height + font-size | `lg-product-info` `.info__cta` |
| Trust row icon size + column gap | `lg-product-info` `.info__trust` |
| Section vertical padding | All sections |
| Lifestyle section proportions | `lg-scrollytelling` `.scrolly__lifestyle` |
| Craft section proportions | `lg-scrollytelling` `.scrolly__craft` |
| Related products grid columns + gap | `lg-scrollytelling` `.scrolly__related` |

---

## Implementation Notes

### Component creation checklist (per component)

- [ ] `ChangeDetectionStrategy.OnPush`
- [ ] `standalone: true`
- [ ] Correct selector: `lg-image-gallery` / `lg-product-info` / `lg-scrollytelling`
- [ ] All `@Input()` declared with `required: true` where applicable
- [ ] All `@Output()` declared as `EventEmitter`
- [ ] Zero service injections
- [ ] GSAP (if used in lg-scrollytelling) inside `ngAfterViewInit` + `isPlatformBrowser` guard
- [ ] SCSS values reconciled with Stitch measurements

### Page refactor checklist

- [ ] Import three new components into `lg-product-detail-page` imports array
- [ ] Replace inline gallery template block with `<lg-image-gallery>`
- [ ] Replace inline info panel template block with `<lg-product-info>`
- [ ] Replace inline scrollytelling sections with `<lg-scrollytelling>`
- [ ] Wire all `(output)` events to existing page methods
- [ ] Verify `::ng-deep` overrides moved/removed if no longer needed
- [ ] `buildWhatsAppUrl` reads phone from `environment.whatsappPhone`

### Environment update

Add to both `environment.ts` and `environment.production.ts`:
```typescript
whatsappPhone: '201XXXXXXXXX',  // Replace with actual number before launch
```

---

## Verification Checklist (post-implementation)

```
□ /products/:id loads real product (test with IDs 1, 5, 10)
□ Image gallery thumbnails clickable — main image updates
□ Active thumbnail has 2px gold border
□ Add to cart → navbar cart counter increments + toast shown
□ Add to wishlist → icon turns gold + navbar wishlist counter updates
□ Wishlist toggle removes item when already in wishlist
□ Related products load at bottom (correct category, excludes self)
□ Clicking related product card navigates to correct PDP
□ Breadcrumb shows: Home › Collections › [Product Title]
□ WhatsApp CTA opens wa.me link with product name
□ Commission Custom navigates to /custom-order
□ Out-of-stock product shows disabled Add to Cart
□ Meta title: "{Product Title} — Lugar Furniture"
□ og:image: product primaryImage URL
□ ng build --output-mode static → zero errors, zero warnings
□ PLP product card click → navigates to /products/:id
```
