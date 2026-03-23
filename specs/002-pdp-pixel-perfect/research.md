# Research: PDP Pixel-Perfect Build (002)

**Date**: 2026-03-23
**Branch**: `002-pdp-pixel-perfect`

---

## Finding 1: PDP is substantially pre-built

**Decision**: The feature is a refactor + pixel-perfect polish, not a greenfield build.

**What exists today** (from codebase exploration):

| Artifact | Path | Status |
|---|---|---|
| `PdpStateService` | `features/product-detail/services/pdp-state.service.ts` | ✅ Complete |
| `lg-product-detail-page` | `features/product-detail/pages/lg-product-detail-page/` | ✅ Substantially built |
| Route `/products/:id` | `app.routes.ts` | ✅ Lazy-loaded |
| PLP → PDP navigation | `lg-products-page` `navigateToProduct()` | ✅ Wired |

**What is missing / needs work**:

| Gap | Description |
|---|---|
| Sub-components not extracted | Gallery, info panel, scrollytelling are all inlined in the page component |
| Stitch measurements not applied | Current values are estimates / from CLAUDE.md tokens — Stitch frame not yet consulted |
| `lg-image-gallery` component | Does not exist as a standalone component |
| `lg-product-info` component | Does not exist as a standalone component |
| `lg-scrollytelling` component | Does not exist as a standalone component |

**Rationale**: The existing monolithic page must be decomposed to keep components thin per Constitution Principle I. Pixel-perfect measurements must come from Stitch MCP before any SCSS values are finalized.

**Alternatives considered**: Leave page monolithic — rejected because a 200+ line template with mixed concerns violates Principle I.

---

## Finding 2: Stitch MCP frame extraction is a prerequisite

**Decision**: All layout proportions, font sizes, spacing values, color overrides, button dimensions, and image gallery dimensions MUST be extracted from Stitch MCP frame `6ef3ffb4cfd84747bba4a16d4d56455d` before Phase 2 (tasks) work begins on SCSS files.

**Rationale**: The user's original command explicitly stated "All measurements must come from Stitch MCP. No guessing." The current SCSS in `lg-product-detail-page` uses approximated values. These must be reconciled with Stitch output.

**Alternatives considered**: Keep current estimated values — rejected per explicit user instruction.

**How to apply**: The Stitch extraction step is Task 1 of the implementation. Its outputs feed into Tasks 2–5 (component SCSS). If Stitch reports a measurement that matches the current value, no change is needed. If it differs, the Stitch value wins.

---

## Finding 3: Component extraction pattern

**Decision**: Extract three sub-components from the page template using Angular's `@Input` + `@Output` contract approach. The page retains all service injections; sub-components are pure presentational shells.

**lg-image-gallery**:
- Inputs: `images: string[]`, `selectedIndex: number`
- Outputs: `selectImage: EventEmitter<number>`
- Renders: main image + thumbnail strip (max 4)

**lg-product-info**:
- Inputs: `product: Product`, `qty: number`, `isWishlisted: boolean`
- Outputs: `qtyChange`, `addToCart`, `wishlistToggle`, `whatsappEnquire`, `commissionCustom`
- Renders: all right-panel content (title, price, description, stepper, CTAs, trust row)

**lg-scrollytelling**:
- Inputs: `relatedProducts: Product[]`
- Outputs: `addRelatedToCart`, `addRelatedToWishlist`
- Renders: lifestyle image section + craft story section + related products grid

**Rationale**: Thin components with no injected services. All service calls remain in the page component and flow down via inputs, up via outputs — clean MVVM. Consistent with how all other pages in the project are built.

**Alternatives considered**:
- Sub-components injecting services directly — rejected (violates Principle I: no logic in components)
- Single `lg-pdp-content` mega-component — rejected (too coarse, harder to test independently)

---

## Finding 4: PdpStateService already matches spec

**Decision**: No changes needed to `PdpStateService`. It already exposes all required signals:
- `product`, `relatedProducts`, `isLoading`, `error`
- `selectedImageIdx` signal + `selectImage()` method
- `qty` signal + `setQty()` method
- `activeImage` computed
- `activePrice` computed
- `breadcrumbs` computed
- `loadProduct(id)`, `reset()`

**Alternatives considered**: Rename to `product-detail-state.service.ts` — rejected, file already exists with the shorter name, renaming is churn (Principle V).

---

## Finding 5: WhatsApp CTA pattern

**Decision**: Build the `wa.me` deep link in the page component's `buildWhatsAppUrl()` method (already exists). Phone number stored as a constant in `environment.ts`.

**Format**: `https://wa.me/20XXXXXXXXXX?text=Hi%2C+I'm+interested+in+{productTitle}`

**Rationale**: The method already exists in `lg-product-detail-page`. The phone number needs to be added to environment files — it is the only outstanding piece.

**Alternatives considered**: Hard-code phone number in component — rejected (environment files are the project-standard config location).

---

## Finding 6: SSR pre-rendering approach

**Decision**: `ng build --output-mode static` (static pre-rendering). No runtime SSR server. The `isPlatformBrowser` guards in the existing page already handle this correctly — build-time render pass simply skips browser-only code.

**What this means for PDP**: GSAP scroll animations in `lg-scrollytelling` MUST be in `ngAfterViewInit` + `isPlatformBrowser` guard. No changes needed to existing Meta/Title setup.

---

## Open Items (to resolve before /speckit.tasks)

| Item | Action |
|---|---|
| Stitch MCP design token extraction | Must be done as Task 1 before SCSS work |
| WhatsApp phone number | Add to `environment.ts` + `environment.production.ts` |
| Lifestyle image asset | Determine which image file to use for scrollytelling section |
