# Feature Specification: Product Detail Page (PDP) — Pixel-Perfect Build

**Feature Branch**: `002-pdp-pixel-perfect`
**Created**: 2026-03-23
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 — View Product Details (Priority: P1)

A shopper arrives at a product URL (e.g. from PLP, a WhatsApp link, or a search engine). They see a full product page: large image gallery on the left, complete product info on the right. They can browse images, read the description, and understand pricing immediately.

**Why this priority**: This is the primary conversion path. If a shopper cannot evaluate a product they cannot purchase it. Everything else depends on this.

**Independent Test**: Navigate to `/products/1` — product title, price, primary image, and description all display correctly.

**Acceptance Scenarios**:

1. **Given** a valid product ID in the URL, **When** the page loads, **Then** the product title, price, primary image, and description are visible within 3 seconds.
2. **Given** a product with multiple images, **When** the page loads, **Then** a thumbnail strip (up to 4 thumbnails) is shown and the first thumbnail has a gold border.
3. **Given** a product with a discount, **When** the page loads, **Then** both the original price (struck through) and the discounted price are displayed with correct EGP formatting.
4. **Given** a product that is out of stock, **When** the page loads, **Then** an "Out of Stock" indicator is shown and the "Add to Cart" action is disabled.

---

### User Story 2 — Browse Image Gallery (Priority: P1)

A shopper clicks on a thumbnail to see a different angle of the product. The main image updates smoothly without a page reload.

**Why this priority**: Luxury furniture purchases require visual confidence. Multiple image angles are critical to conversion.

**Independent Test**: Click each thumbnail in the gallery — the main image updates to the selected image with a smooth transition.

**Acceptance Scenarios**:

1. **Given** a product with 3+ images, **When** the shopper clicks thumbnail #2, **Then** the main image transitions to image #2 and thumbnail #2 gets a gold border.
2. **Given** any thumbnail is active, **When** another thumbnail is clicked, **Then** the previous thumbnail loses its gold border and the new one gains it.

---

### User Story 3 — Add Product to Cart or Wishlist (Priority: P1)

A shopper selects a quantity and adds the product to their cart. Alternatively they add it to their wishlist to save for later.

**Why this priority**: Direct commerce action — without this the page has no conversion mechanism.

**Independent Test**: Click "Add to Cart" — the navbar cart counter increments, a toast confirmation appears.

**Acceptance Scenarios**:

1. **Given** the product is in stock, **When** the shopper clicks "Add to Cart", **Then** the item is added to the cart with the selected quantity, the navbar cart count updates, and a success toast appears.
2. **Given** the shopper clicks the wishlist heart icon and the product is not yet wishlisted, **When** the icon is clicked, **Then** it is added to the wishlist, the icon turns gold, and the navbar wishlist count updates.
3. **Given** the product is already wishlisted, **When** the heart icon is clicked again, **Then** it is removed from the wishlist and the icon returns to its default state.

---

### User Story 4 — Enquire via WhatsApp or Commission Custom Order (Priority: P2)

A shopper who wants to buy or customize the product can tap a WhatsApp CTA or navigate to the custom order flow.

**Why this priority**: WhatsApp is the primary sales conversion channel for Lugar. High-value leads prefer direct contact over the standard cart flow.

**Independent Test**: Click the WhatsApp CTA — a WhatsApp chat opens with a pre-filled message containing the product name.

**Acceptance Scenarios**:

1. **Given** the product page is loaded, **When** the shopper clicks the WhatsApp enquiry CTA, **Then** a WhatsApp chat opens with a pre-filled message including the product name.
2. **Given** the product page is loaded, **When** the shopper clicks "Commission Custom", **Then** they are navigated to `/custom-order`.

---

### User Story 5 — Discover Related Products (Priority: P2)

Below the main product info, the shopper sees a section of related products from the same category. They can click any card to navigate to that product's detail page.

**Why this priority**: Increases session depth and surfaces alternative products, improving overall conversion probability.

**Independent Test**: Scroll to the related products section — product cards appear, clicking one navigates to that product's PDP.

**Acceptance Scenarios**:

1. **Given** the product has a category, **When** the page loads, **Then** up to 4 related products from the same category are shown, excluding the current product.
2. **Given** related products are displayed, **When** the shopper clicks a related product card, **Then** they are navigated to that product's detail page.

---

### User Story 6 — Scrollytelling Experience (Priority: P3)

Below the main product panel, the shopper experiences editorial scroll sections: a full-width lifestyle image, a two-column craft story, and the related products grid.

**Why this priority**: Reinforces luxury brand positioning. The page is usable without it but it elevates the brand experience.

**Independent Test**: Scroll below the fold — three distinct content sections are visible: lifestyle image, craft story, related products.

**Acceptance Scenarios**:

1. **Given** the shopper scrolls below the product panel, **Then** a full-width lifestyle image section is visible.
2. **Given** the shopper continues scrolling, **Then** a two-column craft narrative section is visible.
3. **Given** the shopper continues scrolling, **Then** the related products grid is visible.

---

### Edge Cases

- What happens when the product ID in the URL does not exist or the API returns an error?
- What happens when a product has only one image — should the thumbnail strip be hidden?
- What happens when there are no related products in the same category?
- What happens when the page is rendered server-side and localStorage is unavailable?
- What happens when the product title is very long — does the layout reflow gracefully?
- How is the breadcrumb handled if the product title exceeds available width?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display correct product data (title, price, images, description, category, availability) when a shopper navigates to `/products/:id`.
- **FR-002**: The system MUST show up to 4 product images in a thumbnail strip; clicking a thumbnail MUST update the main image with a smooth visual transition.
- **FR-003**: The active thumbnail MUST be visually distinguished from inactive thumbnails with a 2px gold border.
- **FR-004**: The system MUST show the discounted price alongside the original price (struck through) when a product discount is active; when no discount exists only the regular price is shown.
- **FR-005**: Prices MUST be formatted using the EGP currency convention (e.g. "EGP 23,500").
- **FR-006**: The shopper MUST be able to adjust quantity before adding to cart using the quantity stepper.
- **FR-007**: Clicking "Add to Cart" MUST add the product at the selected quantity to the cart, update the navbar cart counter, and display a success toast notification.
- **FR-008**: Clicking the wishlist icon MUST toggle the product in/out of the wishlist and update the navbar wishlist counter.
- **FR-009**: The page MUST display a trust row communicating key purchase benefits (free delivery, warranty, returns).
- **FR-010**: The page MUST include a breadcrumb trail: Home › Collections › [Product Title].
- **FR-011**: The page MUST set accurate HTML title and meta description/og:image tags per product, compatible with server-side rendering.
- **FR-012**: The page MUST display up to 4 related products from the same category excluding the current product; clicking a related product card MUST navigate to that product's PDP.
- **FR-013**: The system MUST show a user-friendly error state when the product cannot be loaded.
- **FR-014**: The system MUST show a loading state while product data is being fetched.
- **FR-015**: The "Add to Cart" button MUST be disabled and visually indicate unavailability when the product is out of stock.
- **FR-016**: The page MUST include a WhatsApp enquiry CTA that opens a WhatsApp conversation with a pre-filled message containing the product name.
- **FR-017**: The page MUST include a "Commission Custom" CTA that navigates to `/custom-order`.
- **FR-018**: Below the main product panel, the page MUST render three editorial scroll sections: a full-width lifestyle image, a two-column craft story, and the related products section.
- **FR-019**: The route `/products/:id` MUST be lazy-loaded to avoid increasing the initial JS bundle size.
- **FR-020**: All browser-only APIs (localStorage, window) MUST be accessed in an SSR-safe manner.
- **FR-021**: Clicking any product card on the Product Listing Page MUST navigate the shopper to `/products/:id`.

### Key Entities

- **Product**: A single furniture item with title, images (up to 4), price, optional discount, category, description, availability status, rating, and review count.
- **CartItem**: A product added to the shopping cart with a selected quantity; persisted across sessions via browser storage.
- **WishlistItem**: A product saved for later consideration; persisted across sessions via browser storage.
- **RelatedProduct**: A product from the same category as the current product, used to encourage further browsing.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A shopper can land on any product page and see the full product information (title, price, images, description) within 3 seconds on a standard broadband connection.
- **SC-002**: Clicking "Add to Cart" reflects in the navbar cart count within 200ms with no page reload.
- **SC-003**: Clicking a gallery thumbnail updates the main image within 300ms.
- **SC-004**: The page passes a clean production build with zero errors and zero warnings.
- **SC-005**: The page renders correctly under server-side rendering — title and meta tags are present in the HTML response before client hydration.
- **SC-006**: All product card links on the PLP navigate to the correct product detail page.
- **SC-007**: Related products correctly exclude the current product and show only items from the same category.
- **SC-008**: The above-the-fold product panel layout is pixel-accurate to the Stitch MCP design frame measurements.

## Assumptions

- Design measurements (layout proportions, font sizes, spacing, color values, button dimensions, image gallery dimensions, trust strip styling) will be extracted from Stitch MCP frame `6ef3ffb4cfd84747bba4a16d4d56455d` before any implementation begins — no hardcoded values until confirmed.
- The WhatsApp CTA constructs a `wa.me` deep link using the product name; the business phone number will be sourced from a site-wide configuration constant.
- Material and Dimensions data are not present in the current API response; those grid cells in the product info panel will display a placeholder ("–") until the API is extended.
- Lifestyle image and craft story copy in the scrollytelling sections use static placeholder content for this phase, to be replaced with real content later.
- Related products are fetched from the existing `getProductsByCategory` endpoint; the current product is excluded client-side.
- The existing stub `lg-product-detail-page` and `PdpStateService` will be replaced in full by this implementation.
