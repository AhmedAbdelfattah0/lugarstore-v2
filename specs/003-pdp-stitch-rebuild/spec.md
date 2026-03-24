# Feature Specification: Product Detail Page — Pixel-Perfect Stitch Rebuild

**Feature Branch**: `003-pdp-stitch-rebuild`
**Created**: 2026-03-24
**Status**: Draft

---

## Overview

A complete pixel-perfect rebuild of the Product Detail Page (PDP) for Lugar Furniture, aligned precisely to the Stitch MCP design system ("Collections - Lugar Furniture 2026 Edition", screen `6ef3ffb4cfd84747bba4a16d4d56455d`). The rebuild introduces a dedicated state service, three focused sub-components, and restores all scrollytelling sections to match editorial Stitch design token measurements exactly.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — View Full Product Information (Priority: P1)

A shopper navigates to a product URL and sees the complete above-the-fold detail: a large editorial image gallery on the left (55%) and all product information on the right (45%), including title, price, description, materials, dimensions, and purchase controls. The page loads from real API data.

**Why this priority**: The above-fold product view is the primary conversion driver. Without it, no commerce action is possible.

**Independent Test**: Navigate to `/products/1` — product title, price, gallery image, description, and materials block are all visible. The 55/45 grid is visually accurate. Meta title reads `"{product.title} — Lugar Furniture"`.

**Acceptance Scenarios**:

1. **Given** a shopper visits `/products/42`, **When** the page loads, **Then** the product title appears in 72px Cormorant Garamond, the price appears in 30px gold, and the above-fold layout is split 55% gallery / 45% info panel with a minimum height of 921px.
2. **Given** a product with a discounted price, **When** the page renders, **Then** the discounted price appears large in gold and the original price appears struck-through in muted text.
3. **Given** a product with `subtitle` set, **When** viewing the info panel, **Then** the Dimensions field shows the subtitle value; otherwise a static placeholder appears.
4. **Given** a product with `badge` set, **When** viewing the info panel, **Then** the Material field shows the badge value; otherwise a static placeholder appears.
5. **Given** the product ID in the URL does not exist, **When** the page loads, **Then** an error state renders with a "Product not found" message and a link back to the collections page.

---

### User Story 2 — Browse the Image Gallery (Priority: P1)

A shopper clicks any of the four thumbnails below the main photo. The main image updates immediately with a smooth fade transition. The clicked thumbnail gains an active border. Only up to four thumbnails are shown regardless of how many images the product has.

**Why this priority**: Image browsing is core to furniture purchasing decisions — shoppers need to see all product angles before committing.

**Independent Test**: On `/products/1`, click thumbnail #2 — main image updates and thumbnail #2 gains an active border. Clicking thumbnail #1 reverts the main image.

**Acceptance Scenarios**:

1. **Given** the gallery is displayed, **When** a shopper clicks thumbnail #3, **Then** the main image updates to image #3 within 200ms and thumbnail #3 gains the active border.
2. **Given** a product with only 2 images, **When** the gallery renders, **Then** only 2 thumbnails appear.
3. **Given** the page first loads, **When** no thumbnail has been clicked, **Then** thumbnail #1 has the active border and the main image shows the first product image.

---

### User Story 3 — Add Product to Cart or Wishlist (Priority: P1)

A shopper adjusts quantity with the stepper, then clicks "ADD TO CART". The navbar cart counter increments accordingly and a toast confirms. Clicking "Add to Wishlist" toggles the product's wishlist state and updates the navbar wishlist counter. The cart button is disabled when the product is out of stock.

**Why this priority**: Direct conversion action — this is the primary commercial purpose of the PDP.

**Independent Test**: Set qty to 2, click "ADD TO CART" — navbar cart count shows 2 and a toast confirms. Click "Add to Wishlist" — wishlist counter increments.

**Acceptance Scenarios**:

1. **Given** qty is set to 3, **When** a shopper clicks "ADD TO CART", **Then** the cart contains 3 units and the navbar counter reflects the new total.
2. **Given** a product is out of stock, **When** the info panel renders, **Then** the "ADD TO CART" button is disabled and cannot be activated.
3. **Given** a product is not yet wishlisted, **When** a shopper clicks "Add to Wishlist", **Then** the wishlist counter increments and a toast confirms the action.
4. **Given** a product is already wishlisted, **When** a shopper clicks "Add to Wishlist" again, **Then** the product is removed from the wishlist and the counter decrements.

---

### User Story 4 — Enquire via WhatsApp or Commission Custom Order (Priority: P2)

A shopper clicks the WhatsApp text link. A pre-filled WhatsApp chat opens in a new tab with the product name included in the message. Clicking "Commission a Custom Version" navigates to the custom order page.

**Why this priority**: WhatsApp is the primary high-value sales conversion channel for Lugar Furniture's Egyptian and Gulf markets.

**Independent Test**: Click "Enquire on WhatsApp" — browser opens `wa.me/{phone}?text=...{product.title}...`. Click "Commission a Custom Version" — navigates to `/custom-order`.

**Acceptance Scenarios**:

1. **Given** a shopper clicks the WhatsApp link, **When** the click is processed, **Then** a new tab opens to `wa.me` with the correct phone number and a pre-filled message containing the product title.
2. **Given** a shopper clicks "Commission a Custom Version", **When** the click is processed, **Then** the shopper is navigated to `/custom-order`.

---

### User Story 5 — Discover Related Products (Priority: P2)

After scrolling below the above-fold section, the shopper sees up to 3 related products from the same category, each showing image, name, category label, and price. Clicking any card navigates to that product's PDP, which fully reloads with the new product's data.

**Why this priority**: Related product discovery drives additional purchases and reduces bounce rate.

**Independent Test**: Scroll to "You Might Also Like" — 3 related product cards appear. Click one — browser navigates to `/products/:relatedId` and the entire PDP reloads with the new product.

**Acceptance Scenarios**:

1. **Given** a category has 5 other products, **When** the related section renders, **Then** exactly 3 cards appear (current product excluded).
2. **Given** a product has no others in the same category, **When** the related section renders, **Then** the entire section is hidden.
3. **Given** a shopper clicks a related product card, **When** navigation completes, **Then** the PDP title, image, price, and description all update to the newly selected product.

---

### User Story 6 — Experience the Editorial Scrollytelling (Priority: P3)

Below the above-fold section, the shopper scrolls through two editorial zones: a full-viewport lifestyle image with a centered-left quote overlay and a frosted-glass text panel; then a 50/50 split heritage section with a grayscale craft image and three craftsmanship statistics. Both zones animate in on scroll.

**Why this priority**: Reinforces the luxury brand positioning and builds emotional connection before and after the purchase decision.

**Independent Test**: Scroll below the fold — full-viewport lifestyle image with centered quote and glass panel is visible. Continue scrolling — 50/50 craft section with grayscale image and 3 statistics appears. Both sections fade in as they enter the viewport.

**Acceptance Scenarios**:

1. **Given** the shopper scrolls to the lifestyle section, **When** it enters the viewport, **Then** a 100vh image fills the screen with a dark overlay, a 96px serif quote, and a frosted-glass paragraph.
2. **Given** the shopper scrolls to the craft section, **When** it enters the viewport, **Then** a grayscale image fills the left 50% and the right 50% shows the overline, heading, body text, and 3 statistics.
3. **Given** the page is server-side rendered, **When** the page is pre-rendered, **Then** no JavaScript animation errors occur and the page markup is valid.

---

### Edge Cases

- What happens when the product ID in the URL does not exist? → Error state with "Product not found" message and a CTA to `/products`.
- What happens when the related products API returns an empty array? → The "You Might Also Like" section is hidden entirely.
- What happens when a product has only 1 image? → Only 1 thumbnail renders; no broken grid occurs.
- What happens when the shopper navigates directly from one PDP to another via related products? → Route param change triggers a full data reload; the previous in-flight request is cancelled via `_cancel$` before the new request starts, preventing stale data overwrites.
- What happens when the page is pre-rendered server-side? → No browser-only APIs (`window`, `localStorage`, GSAP) execute during SSR.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST render a product detail page at `/products/:id` using live API data for the given product ID.
- **FR-002**: The above-fold layout MUST use a 55% left / 45% right two-column arrangement with a minimum height of 921px.
- **FR-003**: The image gallery MUST display the primary image at a 4:5 aspect ratio and up to four thumbnails in a 4-column grid.
- **FR-004**: Clicking a thumbnail MUST update the main gallery image and apply an active state to the clicked thumbnail.
- **FR-005**: The info panel MUST render elements in this exact order: breadcrumb, title, star rating + reviews, price (with discount variant), description, materials + dimensions block, qty stepper + add-to-cart button, wishlist + commission links, trust row.
- **FR-006**: The "ADD TO CART" button MUST add the product at the selected quantity to the cart and update the navbar counter. It MUST be visually disabled and non-interactive when the product is out of stock.
- **FR-007**: The "Add to Wishlist" link MUST toggle the product in the wishlist and update the navbar wishlist counter.
- **FR-008**: The WhatsApp CTA MUST open a new browser tab to a pre-filled `wa.me` URL containing the configured store phone number and the current product title.
- **FR-009**: The "Commission a Custom Version" link MUST navigate to `/custom-order`.
- **FR-010**: The below-fold area MUST render three sections in order: (1) lifestyle full-viewport section, (2) craft/heritage 50/50 section, (3) related products grid.
- **FR-011**: The related products section MUST show up to 3 products from the same category excluding the current product. If none exist, the section MUST be hidden.
- **FR-012**: Clicking a related product card MUST navigate to that product's PDP and reload all product data.
- **FR-013**: The page MUST set the document title, description meta tag, and og:image meta tag from the current product data on every load.
- **FR-014**: When the route parameter `:id` changes, the page MUST reload product data without a full browser refresh.
- **FR-015**: All scroll animations MUST be guarded with a browser-environment check and MUST NOT execute during server-side rendering.

### Key Entities

- **Product**: A furniture item with id, title, price, discountedPrice, images array, categoryId, categoryName, description, badge (used as material), subtitle (used as dimensions), isOutOfStock, rating, reviews count.
- **Related Product**: A product in the same category as the current product, excluding the current product. Maximum 3 are displayed.
- **Cart Item**: A product reference with quantity stored in browser local storage, managed by CartService.
- **Wishlist Item**: A product reference stored in browser local storage, managed by WishlistService.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A shopper can navigate to any product URL and see the complete above-fold product information within 3 seconds on a standard connection.
- **SC-002**: A shopper can add a product to the cart in under 10 seconds from page load.
- **SC-003**: 100% of visible design token values — font sizes, spacing, colors, layout proportions — match the Stitch MCP source measurements with zero deviations.
- **SC-004**: The page pre-renders via server-side rendering with zero errors or hydration mismatches.
- **SC-005**: The production build completes with zero TypeScript errors and zero Angular template warnings.
- **SC-006**: Clicking a related product card navigates to the correct product and fully updates all page content within 2 seconds.
- **SC-007**: The breadcrumb on each PDP correctly shows the current product title as the final non-linked segment.

---

## Clarifications

### Session 2026-03-24

- Q: Should the spec include explicit Architecture Constraints for component and service patterns? → A: Yes — add Architecture Constraints section declaring signals-only state in service, OnPush + standalone on all components, inject() pattern, no business logic or HttpClient in components.
- Q: How should in-flight HTTP requests be cancelled when route params change and loadProduct() is re-called? → A: Use a `_cancel$` Subject in the state service; emit it at the start of each loadProduct() call and pipe takeUntil(_cancel$) to cancel any in-flight request before starting the new one.
- Q: Should the state service be `providedIn: 'root'` (singleton) or scoped to the component/route? → A: Keep `providedIn: 'root'`; reset all state signals (`_product`, `_error`, `_related`) to initial values at the start of every `loadProduct()` call so no stale content is ever visible.
- Q: How should the page component detect route param changes to trigger product reloads? → A: Use `toSignal(route.paramMap)` to create a signal, then `effect()` to watch it and call `pdpState.loadProduct(+id)` — pure signals pattern, no subscription or takeUntil boilerplate in the component.
- Q: Should the related product card be a custom inline implementation inside lg-scrollytelling or reuse lg-product-card? → A: Inline custom card inside lg-scrollytelling — the editorial card (3/4 ratio, name+category left / price right, no quick-add bar) is structurally different enough from the commerce card to warrant a separate, simpler implementation per SOLID single-responsibility.

---

## Architecture Constraints

All implementation MUST follow the angular-code-quality standard enforced for this project:

- **MVVM separation**: The ViewModel (service) holds all state and business logic. The View (component) renders only — it binds to the service and emits events. No computed values, HTTP calls, or state signals belong inside a component.
- **Signals-only state**: All mutable state in services MUST use `signal<T>()`. Derived values MUST use `computed()`. Signals MUST be exposed to components as `.asReadonly()`. `BehaviorSubject` is prohibited.
- **Component rules**: Every component MUST be `standalone: true` with `ChangeDetectionStrategy.OnPush`. All dependencies MUST be injected via `inject()`. Constructor injection is prohibited.
- **Subscription cleanup**: Any RxJS `.subscribe()` call MUST include a `takeUntil` operator with a destroy signal/subject to prevent memory leaks when the component or route is destroyed.
- **Folder placement**:
  - State service → `features/product-detail/services/`
  - Sub-components (gallery, info, scrollytelling) → `features/product-detail/components/`
  - Page shell → `features/product-detail/pages/`
  - Shared models → `shared/models/`
- **Single responsibility**: The state service owns product loading and selection state only. Cart, wishlist, and toast actions are delegated to their respective existing services — they are not re-implemented here.
- **FR-016**: All components introduced in this feature MUST be `standalone: true` with `ChangeDetectionStrategy.OnPush` and use `inject()` for all dependencies.
- **FR-017**: The state service MUST expose all state as readonly signals (`signal<T>().asReadonly()`). No state signal MAY be defined inside a component.
- **FR-018**: Any RxJS subscription in the page component MUST be cleaned up when the component is destroyed to prevent memory leaks on route navigation.
- **FR-019**: The state service MUST use a cancellation subject (`_cancel$`) that is triggered at the start of every `loadProduct()` call, piped via `takeUntil`, to cancel any in-flight HTTP request before starting the new one. This prevents stale responses from overwriting newer product data on rapid navigation.
- **FR-020**: The state service MUST be `providedIn: 'root'` and MUST reset `_product`, `_error`, and `_related` signals to their initial values at the start of every `loadProduct()` call, ensuring no stale state from a previous product visit is ever visible.
- **FR-021**: The page component MUST detect route param changes using `toSignal(route.paramMap)` and an `effect()` that calls `pdpState.loadProduct(+id)`. No naked `.subscribe()` call is permitted in the page component for this purpose.
- **FR-022**: The related product cards inside `lg-scrollytelling` MUST be implemented as inline custom card markup within that component. The existing `lg-product-card` commerce component MUST NOT be reused for this editorial context. The inline card renders: product image (`aspect-ratio: 3/4`), product name (left), category label (left), and price (right).

---

## Assumptions

- `ProductService.getProductById(id)` and `ProductService.getProductsByCategory(categoryId)` are functional and return normalised `Product` objects.
- `CartService`, `WishlistService`, and `ToastService` are available project-wide via injection.
- `environment.whatsappPhone` is set in both environment files.
- Material and Dimensions data are not discrete API fields. `product.badge` is used as Material value and `product.subtitle` as Dimensions value; both fall back to static text when empty.
- Category-to-lifestyle-image mapping exists in `category-lifestyle-images.ts` for the scrollytelling background images.
- GSAP and ScrollTrigger are already installed.
- The navbar is fixed at ~68px height; `padding-top: 96px` on the page clears it with editorial breathing room.
- The `/products/:id` route uses client-side rendering (not pre-render) because product IDs are not known at build time.
- RTL Arabic layout is a future phase and is not in scope here.

---

## Out of Scope

- Dimensions schematic section (technical line-drawing) — no dimension data in the API.
- Upholstery colour swatch selector — no colour option data in the API.
- Product review submission — no API endpoint.
- Zoom lightbox on the main gallery image.
- Mobile/responsive breakpoints — desktop layout only in this phase.
