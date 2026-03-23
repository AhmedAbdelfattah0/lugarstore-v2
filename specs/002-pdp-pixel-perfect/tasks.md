# Tasks: Product Detail Page (PDP) — Pixel-Perfect Build

**Input**: Design documents from `/specs/002-pdp-pixel-perfect/`
**Branch**: `002-pdp-pixel-perfect`
**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · quickstart.md ✅

**Tests**: Not requested — no test tasks included.

**Key context**: The PDP page (`lg-product-detail-page`) and `PdpStateService` are already substantially built. This feature is a refactor + pixel-perfect polish. Work centres on: (1) Stitch MCP token extraction, (2) extracting three sub-components from the monolithic page template, (3) reconciling SCSS with Stitch measurements.

---

## Phase 1: Setup

**Purpose**: Establish the only two true prerequisites before any component work begins — Stitch measurements and the environment phone number.

- [x] T001 Extract design tokens from Stitch MCP frame `6ef3ffb4cfd84747bba4a16d4d56455d` and record all measurements (layout proportions, font sizes, spacing, colors, button dims, gallery dims) as a comment block at the top of `src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.scss`
- [x] T002 Add `whatsappPhone: '201XXXXXXXXX'` to `src/environments/environment.ts` and `src/environments/environment.production.ts` (replace X values with actual number from client)

**Checkpoint**: Stitch measurements recorded and phone number configured — implementation can proceed.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the three component shells so that subsequent user story phases can implement them in parallel. Shells only — no template or SCSS content yet.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 [P] Create `lg-image-gallery` component shell in `src/app/features/product-detail/components/lg-image-gallery/` — three files: `.component.ts` (standalone, OnPush, selector `lg-image-gallery`, inputs `images` + `selectedIndex`, output `selectImage`), empty `.component.html`, empty `.component.scss`
- [x] T004 [P] Create `lg-product-info` component shell in `src/app/features/product-detail/components/lg-product-info/` — three files: `.component.ts` (standalone, OnPush, selector `lg-product-info`, inputs `product` + `qty` + `isWishlisted`, outputs `qtyChange` + `addToCart` + `wishlistToggle` + `whatsappEnquire` + `commissionCustom`), empty `.component.html`, empty `.component.scss`
- [x] T005 [P] Create `lg-scrollytelling` component shell in `src/app/features/product-detail/components/lg-scrollytelling/` — three files: `.component.ts` (standalone, OnPush, selector `lg-scrollytelling`, input `relatedProducts`, outputs `addRelatedToCart` + `addRelatedToWishlist`), empty `.component.html`, empty `.component.scss`

**Checkpoint**: Three component shells exist — user story implementation can now proceed.

---

## Phase 3: User Story 1 + 2 — View Product Details & Browse Image Gallery (Priority: P1) 🎯 MVP

**Goal**: A shopper can navigate to `/products/:id`, see all product information, and click thumbnails to change the displayed image.

**Covers**: US1 (View Product Details) + US2 (Browse Image Gallery) — tightly coupled via the gallery component.

**Independent Test**: Navigate to `http://localhost:4200/products/1` — product title, price, primary image, and description are visible. Clicking thumbnail #2 updates the main image and gives thumbnail #2 a gold border.

### Implementation

- [x] T006 [US1] Implement `lg-image-gallery` template in `src/app/features/product-detail/components/lg-image-gallery/lg-image-gallery.component.html` — main image (`<img>`) bound to `images[selectedIndex]`, thumbnail strip (`<button>` × 4 max via `slice:0:4`) with `[class.active]="i === selectedIndex"`, click calls `(click)="selectImage.emit(i)"`
- [x] T007 [US1] Implement `lg-image-gallery` SCSS in `src/app/features/product-detail/components/lg-image-gallery/lg-image-gallery.component.scss` — all measurements from Stitch tokens recorded in T001; `.gallery__thumb--active` border: `2px solid #B88E2F`; main image CSS opacity transition (0.2s ease) between image changes; single thumbnail hidden when `images.length <= 1`
- [x] T008 [US2] Import `LgImageGalleryComponent` into `lg-product-detail-page` imports array in `src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.ts`
- [x] T009 [US2] Replace the inline gallery template block in `src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.html` with `<lg-image-gallery [images]="pdpState.product()!.images" [selectedIndex]="pdpState.selectedImageIdx()" (selectImage)="pdpState.selectImage($event)" />`
- [x] T010 [US1] Remove gallery-related SCSS rules now owned by `lg-image-gallery` from `src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.scss` (`.pdp__gallery`, `.pdp__main-image`, `.pdp__badge`, `.pdp__thumbs` blocks)

**Checkpoint**: Image gallery is extracted and independently functional. Thumbnail click updates main image. Active thumbnail has gold border.

---

## Phase 4: User Story 3 — Add to Cart or Wishlist (Priority: P1)

**Goal**: A shopper can adjust quantity and add the product to their cart or wishlist. Navbar counters update and a toast confirmation appears.

**Covers**: US3 (Add Product to Cart or Wishlist) — delivered via `lg-product-info`.

**Independent Test**: On the product page, change qty to 2, click "Add to Cart" — navbar cart count shows 2. Click the wishlist heart — icon turns gold and navbar wishlist count increments.

### Implementation

- [x] T011 [US3] Implement `lg-product-info` template in `src/app/features/product-detail/components/lg-product-info/lg-product-info.component.html` — full right-panel content: category label (Montserrat uppercase), product title (Cormorant Garamond h1), star rating + review count, price block (gold active price; struck-through original when `product.hasDiscount`; `lgCurrencyEgp` pipe on both), description paragraph, availability indicator, `<lg-divider>`, purchase row (`<lg-quantity-stepper [value]="qty" (valueChange)="qtyChange.emit($event)" />` + `<lg-button>` Add to Cart disabled when `product.isOutOfStock`), text CTAs (wishlist toggle, WhatsApp enquiry, Commission Custom), trust row (3-column: free delivery · 2-year warranty · easy returns)
- [x] T012 [US3] Implement `lg-product-info` SCSS in `src/app/features/product-detail/components/lg-product-info/lg-product-info.component.scss` — all measurements from Stitch tokens (T001); `.info__title` font-size/letter-spacing from Stitch; `.info__cta` height from Stitch; trust row icon size + gap from Stitch; no border-radius > 4px; no box-shadow
- [x] T013 [US3] Import `LgProductInfoComponent`, `LgQuantityStepperComponent`, `LgButtonComponent`, `LgDividerComponent`, `LgCurrencyEgpPipe` into `lg-product-info` component's `imports` array in `src/app/features/product-detail/components/lg-product-info/lg-product-info.component.ts`
- [x] T014 [US3] Import `LgProductInfoComponent` into `lg-product-detail-page` imports array in `src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.ts`
- [x] T015 [US3] Replace the inline info-panel template block in `src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.html` with `<lg-product-info [product]="pdpState.product()!" [qty]="pdpState.qty()" [isWishlisted]="isWishlisted(pdpState.product()!.id)" (qtyChange)="pdpState.setQty($event)" (addToCart)="onAddToCart()" (wishlistToggle)="onWishlistToggle()" (whatsappEnquire)="onWhatsappEnquire()" (commissionCustom)="onCommissionCustom()" />`
- [x] T016 [US3] Remove info-panel SCSS rules now owned by `lg-product-info` from `src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.scss` (`.pdp__panel`, `.pdp__title`, `.pdp__category`, `.pdp__rating`, `.pdp__price`, `.pdp__description`, `.pdp__purchase-row`, `.pdp__text-ctas`, `.pdp__trust` blocks)

**Checkpoint**: Product info panel is extracted. Cart and wishlist actions work. Navbar counters update. Toast notifications appear.

---

## Phase 5: User Story 4 — WhatsApp Enquiry + Commission Custom (Priority: P2)

**Goal**: Clicking the WhatsApp CTA opens a pre-filled chat. Clicking Commission Custom navigates to `/custom-order`.

**Covers**: US4 (Enquire via WhatsApp or Commission Custom Order) — wired via output handlers in the page component.

**Independent Test**: Click WhatsApp CTA — browser opens `wa.me` URL with product name encoded. Click Commission Custom — page navigates to `/custom-order`.

### Implementation

- [x] T017 [US4] Add `onWhatsappEnquire()` method to `lg-product-detail-page` in `src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.ts` — calls `buildWhatsAppUrl(product.title)` using `environment.whatsappPhone`, opens URL via `window.open()` inside `isPlatformBrowser` guard
- [x] T018 [US4] Add `onCommissionCustom()` method to `lg-product-detail-page` in `src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.ts` — calls `this.router.navigate(['/custom-order'])`
- [x] T019 [US4] Verify `buildWhatsAppUrl(title: string)` in `lg-product-detail-page` reads `environment.whatsappPhone` and produces `https://wa.me/{phone}?text=Hi%2C+I%27m+interested+in+{encodedTitle}` in `src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.ts`

**Checkpoint**: WhatsApp CTA and Commission Custom navigation both work end-to-end.

---

## Phase 6: User Story 5 — Discover Related Products (Priority: P2)

**Goal**: Below the main product panel, the shopper sees up to 4 related products from the same category (excluding the current product). Clicking any navigates to that product's PDP.

**Covers**: US5 (Discover Related Products) — initial `lg-scrollytelling` content (related products section only).

**Independent Test**: Load any product page, scroll to bottom — related product cards appear. Click one — navigates to a different `/products/:id`.

### Implementation

- [x] T020 [US5] Implement the related products section in `src/app/features/product-detail/components/lg-scrollytelling/lg-scrollytelling.component.html` — section header "Curated For You" + `/products` RouterLink; `@if (relatedProducts.length > 0)` renders 3-column grid of `<lg-product-card>` components with `(addToCart)` and `(addToWishlist)` outputs; `@else` renders `<lg-empty-state>` with "No related pieces found" message
- [x] T021 [US5] Import `LgProductCardComponent`, `LgEmptyStateComponent`, `RouterLink` into `lg-scrollytelling` imports array in `src/app/features/product-detail/components/lg-scrollytelling/lg-scrollytelling.component.ts`
- [x] T022 [US5] Apply related products grid SCSS from Stitch tokens in `src/app/features/product-detail/components/lg-scrollytelling/lg-scrollytelling.component.scss` — 3-column grid; gap from Stitch; section vertical padding from Stitch; max-width 1280px centered
- [x] T023 [US5] Import `LgScrollytellingComponent` into `lg-product-detail-page` imports array in `src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.ts`
- [x] T024 [US5] Add `<lg-scrollytelling>` partial binding in `src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.html` below the split layout: `<lg-scrollytelling [relatedProducts]="pdpState.relatedProducts()" (addRelatedToCart)="onRelatedAddToCart($event)" (addRelatedToWishlist)="onRelatedAddToWishlist($event)" />`

**Checkpoint**: Related products section renders at the bottom of the PDP. Clicking a related card navigates to the correct product.

---

## Phase 7: User Story 6 — Scrollytelling Experience (Priority: P3)

**Goal**: Below the product panel, the shopper experiences editorial scroll sections: a full-width lifestyle image and a two-column craft story, followed by the related products grid.

**Covers**: US6 (Scrollytelling Experience) — adds lifestyle and craft sections to `lg-scrollytelling`.

**Independent Test**: Scroll below the fold — three distinct sections visible: lifestyle image, craft story (two-column), related products grid.

### Implementation

- [x] T025 [US6] Add lifestyle image section to `src/app/features/product-detail/components/lg-scrollytelling/lg-scrollytelling.component.html` — full-width `<section class="scrolly__lifestyle">` with dark background `#2a2520`, gold quote (`"Every piece tells a story"`), descriptive paragraph, and `<img>` using `hero-lifestyle.jpg` placeholder (to be replaced with real image)
- [x] T026 [US6] Add craft story section to `src/app/features/product-detail/components/lg-scrollytelling/lg-scrollytelling.component.html` — two-column `<section class="scrolly__craft">` with image column (left, `opacity: 0.85` overlay) and info column (right) containing workshop stats (years founded, pieces crafted, countries shipped)
- [x] T027 [US6] Apply lifestyle and craft section SCSS from Stitch tokens in `src/app/features/product-detail/components/lg-scrollytelling/lg-scrollytelling.component.scss` — lifestyle section proportions from Stitch; craft section proportions from Stitch; all section vertical padding from Stitch; no radius > 4px; no shadows; no gradients
- [x] T028 [US6] Add GSAP ScrollTrigger scroll-reveal animations to `lg-scrollytelling` in `src/app/features/product-detail/components/lg-scrollytelling/lg-scrollytelling.component.ts` — inject `PLATFORM_ID`; in `ngAfterViewInit` inside `isPlatformBrowser` guard: fade-up reveal on `.scrolly__lifestyle`, `.scrolly__craft`, `.scrolly__related` using `gsap.from()` with `ScrollTrigger`
- [x] T029 [US6] Replace the inline scrollytelling template blocks in `src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.html` with the now-complete `<lg-scrollytelling>` binding (already added in T024 — verify the inline lifestyle + craft sections are removed from the page template)
- [x] T030 [US6] Remove all scrollytelling SCSS rules now owned by `lg-scrollytelling` from `src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.scss` (`.pdp__lifestyle`, `.pdp__craft`, `.pdp__related` blocks)

**Checkpoint**: All three scroll sections render. GSAP animations trigger on scroll. Build passes.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final SCSS reconciliation, full verification checklist, and clean build confirmation.

- [x] T031 Re-read the Stitch token comment block (T001) and verify EVERY SCSS value across all four modified/created files matches Stitch output — flag any discrepancy in a code comment: `src/app/features/product-detail/components/lg-image-gallery/lg-image-gallery.component.scss`, `src/app/features/product-detail/components/lg-product-info/lg-product-info.component.scss`, `src/app/features/product-detail/components/lg-scrollytelling/lg-scrollytelling.component.scss`, `src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.scss`
- [x] T032 [P] Verify the PLP product card click wires correctly to PDP navigation — confirm `navigateToProduct(id)` in `src/app/features/products/pages/lg-products-page/lg-products-page.component.ts` calls `this.router.navigate(['/products', id])` and that each card `(click)` or `[routerLink]` binding is present in the PLP template
- [x] T033 Run `ng build --output-mode static` from repo root and resolve any TypeScript errors or Angular template errors until build exits with zero errors and zero warnings
- [x] T034 [P] Manual verification pass against the full checklist from `specs/002-pdp-pixel-perfect/quickstart.md` — mark each item and note any failures

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 (Stitch tokens must be recorded first)
- **Phase 3 (US1+US2)**: Depends on Phase 2 (component shell must exist)
- **Phase 4 (US3)**: Depends on Phase 2; can run in parallel with Phase 3
- **Phase 5 (US4)**: Depends on Phase 4 (`lg-product-info` must exist to hold CTAs)
- **Phase 6 (US5)**: Depends on Phase 2 (`lg-scrollytelling` shell); can run in parallel with Phases 3–5
- **Phase 7 (US6)**: Depends on Phase 6 (related products section must exist first)
- **Phase 8 (Polish)**: Depends on all user story phases

### User Story Dependencies

- **US1+US2 (Phase 3)**: Independent after Phase 2
- **US3 (Phase 4)**: Independent after Phase 2 — can run in parallel with Phase 3
- **US4 (Phase 5)**: Depends on Phase 4 (reuses `lg-product-info`)
- **US5 (Phase 6)**: Independent after Phase 2 — can start alongside Phases 3+4
- **US6 (Phase 7)**: Depends on Phase 6 (extends `lg-scrollytelling`)

### Within Each Phase

- Component `.ts` shell → then `.html` → then `.scss`
- Component complete → then import into page → then wire outputs → then remove inline blocks
- All SCSS reconciliation after components stabilize

### Parallel Opportunities

- T003, T004, T005 (Phase 2 shell creation) — all parallel
- Phase 3 and Phase 4 — can run in parallel (different component files)
- Phase 6 can start alongside Phase 3+4 (different component)
- T031 and T032 (Phase 8) — parallel

---

## Parallel Example: Phase 2 (Shell Creation)

```
Parallel Task A: T003 — Create lg-image-gallery shell
Parallel Task B: T004 — Create lg-product-info shell
Parallel Task C: T005 — Create lg-scrollytelling shell
```

## Parallel Example: Phase 3 + Phase 4

```
Stream A (lg-image-gallery):
  T006 → T007 → T008 → T009 → T010

Stream B (lg-product-info):
  T011 → T012 → T013 → T014 → T015 → T016
```

---

## Implementation Strategy

### MVP First (US1+US2+US3 — Above the Fold)

1. Complete Phase 1: Setup (Stitch extraction + env)
2. Complete Phase 2: Foundational (shell files)
3. Complete Phase 3: US1+US2 (gallery)
4. Complete Phase 4: US3 (info panel + cart/wishlist)
5. **STOP and VALIDATE**: Product page is fully functional above the fold
6. Above-the-fold pixel-perfect and all commerce actions work

### Full Delivery (All 6 User Stories)

1. MVP above + Phase 5 (WhatsApp/Commission) — completes all P1+P2 CTAs
2. Phase 6 (Related products) — completes P2 discovery
3. Phase 7 (Scrollytelling) — completes P3 editorial experience
4. Phase 8 (Polish) — zero-warning build + final verification

---

## Notes

- `[P]` tasks = different files, no inter-task dependencies — safe to run in parallel
- `[USn]` label maps each task to its user story for traceability
- **Never inject services into sub-components** — all service calls stay in `lg-product-detail-page`
- GSAP animations: always `ngAfterViewInit` + `isPlatformBrowser` guard (SSR pre-render safety)
- All SCSS values must trace back to the Stitch token comment block (T001)
- After removing inline template blocks from the page, check for orphaned `::ng-deep` rules and remove them
- Commit after each phase checkpoint
