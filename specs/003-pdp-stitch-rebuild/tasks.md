# Tasks: Product Detail Page — Pixel-Perfect Stitch Rebuild

**Input**: `specs/003-pdp-stitch-rebuild/`
**Branch**: `003-pdp-stitch-rebuild`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Not requested — no test tasks included.

**Context**: This is a **refactor** — all files already exist. No new routes, no new components, no new services are introduced. Every task targets an existing file. The implementation plan identified 1 service + 3 sub-components + 1 page component to refactor with exact Stitch design token measurements from screen `6ef3ffb4cfd84747bba4a16d4d56455d`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: User story from spec.md (US1–US6)

---

## Phase 1: Setup

**Purpose**: Confirm existing file structure matches the implementation plan before refactoring begins.

- [x] T001 Read and verify all 5 target files exist: `src/app/features/product-detail/services/pdp-state.service.ts`, `src/app/features/product-detail/components/lg-image-gallery/lg-image-gallery.component.{ts,html,scss}`, `src/app/features/product-detail/components/lg-product-info/lg-product-info.component.{ts,html,scss}`, `src/app/features/product-detail/components/lg-scrollytelling/lg-scrollytelling.component.{ts,html,scss}`, `src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.{ts,html,scss}`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Refactor `PdpStateService` and the page component's route detection strategy. These changes are prerequisites for all user stories — no story works correctly without valid data loading and cancellation.

**⚠️ CRITICAL**: Complete this phase before any user story work begins.

- [x] T002 Refactor `PdpStateService` in `src/app/features/product-detail/services/pdp-state.service.ts`: add `private readonly _cancel$ = new Subject<void>()` field; at the top of `loadProduct()` emit `_cancel$.next()` to cancel any in-flight request; replace the two independent `.subscribe()` calls with a single `switchMap` chain piped through `takeUntil(this._cancel$)` per the pattern in `specs/003-pdp-stitch-rebuild/research.md` Decision 1; ensure `_product`, `_error`, `_relatedProducts`, `_qty`, `_selectedImageIdx` are all reset at the start of `loadProduct()` (FR-019, FR-020)
- [x] T003 Refactor `LgProductDetailPageComponent` in `src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.ts`: replace the `ngOnInit` `paramMap.subscribe()` + `ngOnDestroy` pattern with `private readonly paramMap = toSignal(this.route.paramMap)` and a constructor `effect()` that calls `pdpState.loadProduct(+id)` when the param changes; remove `OnInit`, `OnDestroy`, and `Subject<void>` boilerplate; keep all other methods unchanged (FR-021)
- [x] T004 [P] Refactor `lg-product-detail-page.component.scss` in `src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.scss`: set the above-fold container (`.pdp__split`) to `display: grid; grid-template-columns: 55% 45%; min-height: 921px`; set `:host` or page wrapper to `padding-top: 96px` to clear the fixed navbar (Stitch token: `grid-cols-[55%_45%]`, `min-h-[921px]`)

**Checkpoint**: Product loads from API, stale-data race condition is fixed, page renders with correct 55/45 grid.

---

## Phase 3: User Story 1 — View Full Product Information (Priority: P1) 🎯 MVP

**Goal**: Above-fold section renders complete product information with exact Stitch typography and layout tokens: 72px title, 30px gold price, description, materials+dimensions block, purchase controls, trust row.

**Independent Test**: Navigate to `/products/1` — product title appears in 72px Cormorant Garamond, price in 30px `#B88E2F`, Materials + Dimensions block shows, trust row shows 3 icons. All 9 elements render in the correct order.

- [x] T005 [P] [US1] Refactor `lg-product-info.component.html` in `src/app/features/product-detail/components/lg-product-info/lg-product-info.component.html`: rebuild the template with the 9-element order from FR-005 and the contracts doc: (1) breadcrumb from `product.categoryName` + `product.title`, (2) `<h1>` title, (3) star rating + reviews, (4) price with discount variant, (5) description, (6) materials + dimensions 2-col block using `product.badge ?? 'Premium Egyptian Linen'` and `product.subtitle ?? '240W × 105D × 75H cm'`, (7) qty stepper + ADD TO CART button with `[disabled]="product().isOutOfStock"`, (8) Add to Wishlist + Commission links, (9) trust row with `local_shipping` / `verified` / `autorenew` Material Icons
- [x] T006 [P] [US1] Refactor `lg-product-info.component.scss` in `src/app/features/product-detail/components/lg-product-info/lg-product-info.component.scss`: apply all Stitch panel and element tokens: panel `background: #F9F1E7; padding: 32px` (up to 64px); title `font-size: 72px; font-family: 'Cormorant Garamond'; font-weight: 300; line-height: 1.2; letter-spacing: 0.1em; color: #1e1b15`; price `font-size: 30px; font-family: 'Cormorant Garamond'; font-weight: 300; color: #B88E2F`; description `font-family: 'Inter'; font-weight: 300; font-size: 14px; line-height: 1.7; color: #57534e`; mat+dims block `border-top: 1px solid rgba(210,197,177,0.3); border-bottom: 1px solid rgba(210,197,177,0.3); padding: 32px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 48px`; ADD TO CART `background: #B88E2F; color: #fff; font-family: 'Montserrat'; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; padding: 20px 0; border-radius: 2px; flex: 1; transition: opacity 400ms`; trust row `display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; border-top: 1px solid rgba(210,197,177,0.3); padding-top: 32px; margin-top: 32px`

**Checkpoint**: US1 independently verifiable — all 9 info panel elements render with correct typography.

---

## Phase 4: User Story 2 — Browse the Image Gallery (Priority: P1)

**Goal**: Image gallery renders at correct 4:5 aspect ratio with 4-column thumbnail grid; thumbnail click updates the main image with active border feedback.

**Independent Test**: On `/products/1`, click thumbnail #2 — main image updates to image #2 and thumbnail #2 gains `1px solid rgba(184,142,47,0.2)` border. Thumbnail #1 loses the border.

- [x] T007 [P] [US2] Refactor `lg-image-gallery.component.html` in `src/app/features/product-detail/components/lg-image-gallery/lg-image-gallery.component.html`: ensure main image uses `<img>` tag with `[src]="images()[selectedIndex()]"` bound via component inputs; thumbnail strip uses `*ngFor` over `images() | slice:0:4`; active thumbnail `[class.gallery__thumb--active]="i === selectedIndex()"`; thumbnail click emits `(click)="selectImage.emit(i)"`; zoom button `<button class="gallery__zoom">` is present (presentational only — no output)
- [x] T008 [P] [US2] Refactor `lg-image-gallery.component.scss` in `src/app/features/product-detail/components/lg-image-gallery/lg-image-gallery.component.scss`: apply all Stitch gallery tokens: `.gallery` `background: #faf2e8; padding: 32px`; `.gallery__main` `aspect-ratio: 4/5; overflow: hidden` with `img` `object-fit: cover; width: 100%; height: 100%`; `.gallery__thumbs` `display: grid; grid-template-columns: repeat(4,1fr); gap: 16px`; `.gallery__thumb` `aspect-ratio: 1/1; overflow: hidden; cursor: pointer` with `img` `object-fit: cover; width: 100%; height: 100%`; `.gallery__thumb--active` `outline: 1px solid rgba(184,142,47,0.2)`; `.gallery__zoom` `position: absolute; top: 24px; right: 24px; padding: 12px; background: rgba(255,255,255,0.4); backdrop-filter: blur(8px); border-radius: 50%; border: none`

**Checkpoint**: US2 independently verifiable — thumbnails render, click updates main image, active state visible.

---

## Phase 5: User Story 3 — Add to Cart or Wishlist (Priority: P1)

**Goal**: ADD TO CART button adds the product at the selected quantity to the cart and shows a toast. Wishlist toggle works. Cart button is disabled when out of stock.

**Independent Test**: Set qty to 2 via stepper, click ADD TO CART — navbar cart counter shows 2 and a toast confirms. Click "Add to Wishlist" — wishlist counter increments.

- [x] T009 [US3] Verify `lg-product-detail-page.component.html` in `src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.html`: confirm `(addToCart)="onAddToCart()"`, `(wishlistToggle)="onWishlistToggle()"`, `(qtyChange)="pdpState.setQty($event)"` are all bound on `<lg-product-info>`; confirm `[isWishlisted]` is computed correctly from `wishlist.isInWishlist()`
- [x] T010 [US3] Verify `lg-product-info.component.html` quantity stepper binding: stepper `[value]="qty()"` and `(valueChange)="qtyChange.emit($event)"`; ADD TO CART button has `[disabled]="product().isOutOfStock"` and `(click)="addToCart.emit()"` so out-of-stock products cannot be added

**Checkpoint**: US3 independently verifiable — add to cart, wishlist toggle, and out-of-stock disable all function correctly.

---

## Phase 6: User Story 4 — WhatsApp Enquiry / Commission (Priority: P2)

**Goal**: WhatsApp link opens `wa.me` in a new tab with the product title pre-filled. Commission link navigates to `/custom-order`.

**Independent Test**: Click "Enquire on WhatsApp" — new tab opens to `wa.me/{phone}?text=...{product.title}`. Click "Commission a Custom Version" — navigates to `/custom-order`.

- [x] T011 [US4] Verify `lg-product-detail-page.component.ts` WhatsApp handler: `onWhatsappEnquire()` must call `window.open()` only inside `isPlatformBrowser(this.platformId)` guard; verify `environment.whatsappPhone` is read from environment file
- [x] T012 [US4] Verify "Commission a Custom Version" link in `lg-product-info.component.html`: must use `(click)="commissionCustom.emit()"` output that routes to `/custom-order` via `Router.navigate()` in the page component (no direct `routerLink` on the commission link since navigation is delegated up)

**Checkpoint**: US4 independently verifiable — WhatsApp URL is correct, commission navigation works.

---

## Phase 7: User Story 5 — Related Products Discovery (Priority: P2)

**Goal**: Below-fold related products section shows up to 3 inline editorial cards from the same category. Clicking a card navigates to that product's PDP and reloads all data.

**Independent Test**: Scroll to "You Might Also Like" — 3 cards appear with 3:4 image ratio. Click one — URL changes to `/products/:id` and all PDP content updates to the new product.

- [x] T013 [US5] Refactor `lg-scrollytelling.component.html` related products section in `src/app/features/product-detail/components/lg-scrollytelling/lg-scrollytelling.component.html`: replace any usage of `<lg-product-card>` with inline editorial card markup per FR-022 and the contracts doc; each card: `<a [routerLink]="['/products', card.id]" class="scrolly__related-card">` wrapping an image container (`aspect-ratio: 3/4`) and a card-info row (`display: flex; justify-content: space-between`) with product name (Cormorant Garamond 300 24px) + category label (Montserrat 10px `#a8a29e`) on the left and price (Cormorant Garamond 300 18px `#7a5900`) on the right; add `@if (relatedProducts().length > 0)` guard to hide the entire related section when empty
- [x] T014 [P] [US5] Refactor `lg-scrollytelling.component.ts` in `src/app/features/product-detail/components/lg-scrollytelling/lg-scrollytelling.component.ts`: remove `LgProductCardComponent` from `imports` array (FR-022 prohibits it for this editorial context); verify `addRelatedToCart` and `addRelatedToWishlist` outputs remain; verify `relatedProducts = input.required<Product[]>()` and `categoryId = input<number>(0)` are correct per the contract
- [x] T015 [P] [US5] Refactor `lg-scrollytelling.component.scss` related section in `src/app/features/product-detail/components/lg-scrollytelling/lg-scrollytelling.component.scss`: apply Stitch related section tokens: `.scrolly__related` `background: #F9F1E7; padding: 96px 48px`; `.scrolly__related-grid` `display: grid; grid-template-columns: repeat(3,1fr); gap: 32px`; `.scrolly__related-card` `background: #fff; padding: 24px; border-radius: 2px; overflow: hidden; transition: box-shadow 400ms`; `.scrolly__related-card:hover` `box-shadow: 0 25px 50px -12px rgba(28,25,21,0.05)`; `.scrolly__related-card-img` `aspect-ratio: 3/4; overflow: hidden; margin-bottom: 24px` with `img` `object-fit: cover; width: 100%; height: 100%; transition: transform 700ms` and `.scrolly__related-card:hover img` `transform: scale(1.1)`; related heading `font-size: 48px; font-family: 'Cormorant Garamond'; font-weight: 300; letter-spacing: 0.1em; color: #1e1b15`

**Checkpoint**: US5 independently verifiable — 3 related cards render, click navigates and reloads PDP.

---

## Phase 8: User Story 6 — Editorial Scrollytelling (Priority: P3)

**Goal**: Full-viewport lifestyle section and 50/50 craft section render with correct Stitch measurements. Both fade in on scroll via GSAP. No SSR errors.

**Independent Test**: Scroll below fold — 100vh lifestyle image with `<img>` tag, dark overlay, vertically centered quote, and frosted-glass panel are visible. Continue scrolling — 50/50 craft section with grayscale image and 3 statistics appears. Both animate in.

- [x] T016 [P] [US6] Refactor `lg-scrollytelling.component.html` lifestyle section: replace any CSS `background-image` approach with a real `<img>` tag inside `.scrolly__lifestyle`: `<img [src]="lifestyleImage()" alt="" class="scrolly__lifestyle-img">`; add dark overlay div; add text container with quote `<h2>` and frosted-glass panel `<div>` per the contracts doc (Decision 3 in research.md)
- [x] T017 [P] [US6] Refactor `lg-scrollytelling.component.html` craft section: ensure craft section has `<img [src]="craftImage()" class="scrolly__craft-img">` in the left column; right column has overline, `<h2>` heading, body text, and stats row with three stat items (60+ Hours Per Piece / 15+ Years of Craft / 500+ Bespoke Works)
- [x] T018 [P] [US6] Refactor `lg-scrollytelling.component.scss` lifestyle + craft sections: `.scrolly__lifestyle` `height: 100vh; position: relative; overflow: hidden`; `.scrolly__lifestyle-img` `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover`; `.scrolly__lifestyle-overlay` `position: absolute; inset: 0; background: rgba(28,25,21,0.2)`; `.scrolly__lifestyle-content` `position: relative; z-index: 10; padding: 0 96px; display: flex; flex-direction: column; justify-content: center; height: 100%; max-width: 896px`; `.scrolly__lifestyle-quote` `font-size: 96px; font-family: 'Cormorant Garamond'; font-weight: 300; line-height: 1; letter-spacing: 0.1em; color: #fff; margin-bottom: 32px`; `.scrolly__lifestyle-glass` `background: rgba(255,255,255,0.1); backdrop-filter: blur(16px); padding: 32px; border-left: 1px solid rgba(255,255,255,0.3); max-width: 448px`; `.scrolly__craft` `display: grid; grid-template-columns: 1fr 1fr; min-height: 819px`; `.scrolly__craft-img` `object-fit: cover; width: 100%; height: 100%; filter: grayscale(30%)`; `.scrolly__craft-info` `background: #fff; padding: 48px; display: flex; flex-direction: column; justify-content: center`; stat value `font-size: 30px; font-family: 'Cormorant Garamond'; font-weight: 300; color: #B88E2F`

**Checkpoint**: US6 independently verifiable — both sections render pixel-accurately, GSAP animations fire on scroll, no SSR errors.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Build validation, meta tag verification, and final cleanup.

- [x] T019 Run `ng build` and fix any TypeScript errors or Angular template warnings introduced by the refactor; ensure zero errors and zero warnings
- [x] T020 Run `ng build --output-mode static` and verify: 9 static routes prerender successfully; `/products/:id` uses `RenderMode.Client`; no SSR-time JavaScript errors in the prerender output
- [x] T021 Walk through `specs/003-pdp-stitch-rebuild/quickstart.md` manual verification checklist: confirm each item passes on a running dev server at `/products/1`; mark failing items for immediate fix before closing the branch

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user story work
- **Phase 3–8 (User Stories)**: All depend on Phase 2 completion; can proceed in priority order after
- **Phase 9 (Polish)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2 — no story dependencies
- **US2 (P1)**: Starts after Phase 2 — no story dependencies; [P] with US1 (different files)
- **US3 (P1)**: Depends on US1 (T009 verifies page template bindings; US1 must render the info panel first)
- **US4 (P2)**: Depends on US1 (WhatsApp + commission links are in the info panel template)
- **US5 (P2)**: Starts after Phase 2 — no story dependencies; [P] with US1/US2 (different files)
- **US6 (P3)**: Starts after Phase 2 — no story dependencies; [P] with US1/US2/US5 (same file as US5 — must be sequential with T013–T015)

### Within Each User Story

- For US6: T016 and T017 (HTML) are [P] with each other and with T018 (SCSS)
- For US5: T014 (TS) and T015 (SCSS) are [P] with each other; T013 (HTML) must complete first before T014 (TS cleanup)

---

## Parallel Opportunities

```bash
# After Phase 2 completes, these can run in parallel (different files):
T005 lg-product-info HTML      ← US1
T006 lg-product-info SCSS      ← US1
T007 lg-image-gallery HTML     ← US2
T008 lg-image-gallery SCSS     ← US2
T013 lg-scrollytelling HTML (related)  ← US5
T015 lg-scrollytelling SCSS (related)  ← US5
T016 lg-scrollytelling HTML (lifestyle) ← US6 [after T013]
T017 lg-scrollytelling HTML (craft)    ← US6 [after T013]
T018 lg-scrollytelling SCSS (lifestyle+craft) ← US6 [after T015]
```

---

## Implementation Strategy

### MVP First (US1 + US2 + US3 — Above-Fold Commerce)

1. Complete Phase 1: Setup verification
2. Complete Phase 2: Foundational — `PdpStateService` + page TS + page SCSS
3. Complete Phase 3: US1 — info panel Stitch tokens
4. Complete Phase 4: US2 — gallery Stitch tokens
5. Complete Phase 5: US3 — cart/wishlist verification
6. **STOP and VALIDATE**: Above-fold PDP is pixel-perfect and commerce-functional
7. Deploy MVP — users can browse and add to cart

### Incremental Delivery

1. Foundation → US1 + US2 + US3 → **MVP** (above-fold fully functional)
2. Add US4 → WhatsApp + commission working
3. Add US5 → Related products discoverable
4. Add US6 → Editorial scrollytelling complete
5. Phase 9 → Build clean, quickstart verified

---

## Notes

- All tasks target **existing** files — no `ng generate` commands needed
- `lg-product-detail-page` already imports all 3 sub-components — no import changes needed there
- `app.routes.ts` and `app.routes.server.ts` are correct — no changes needed (verified in plan.md)
- The `_cancel$` Subject in `PdpStateService` must use `import { Subject } from 'rxjs'` — verify import is present in T002
- `toSignal()` requires `import { toSignal } from '@angular/core/rxjs-interop'` — add this import in T003
- After T014 removes `LgProductCardComponent` from `lg-scrollytelling` imports, verify no other template reference to it remains to avoid a compile error
