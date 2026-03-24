# Quickstart: Product Detail Page — Pixel-Perfect Stitch Rebuild

**Branch**: `003-pdp-stitch-rebuild` | **Date**: 2026-03-24

---

## Manual Verification Checklist

After implementing all tasks, verify each item by navigating to `/products/1` in a running dev server.

### Above-Fold Layout

- [ ] Navigate to `/products/1` — page loads with real product data (title, price, images)
- [ ] Above-fold section uses a 55% left / 45% right two-column grid
- [ ] Above-fold minimum height is 921px
- [ ] Left column has gallery background `#faf2e8`, right column has `#F9F1E7`
- [ ] 96px padding-top on the page clears the fixed navbar

### Image Gallery (`lg-image-gallery`)

- [ ] Main image displays at 4:5 aspect ratio with `object-fit: cover`
- [ ] Up to 4 thumbnails appear in a 4-column grid with 16px gaps
- [ ] Thumbnails are square (1:1 aspect ratio)
- [ ] Clicking thumbnail #2 updates the main image to image #2
- [ ] Clicked thumbnail gains `1px solid rgba(184,142,47,0.2)` active border
- [ ] First thumbnail has active border on initial page load
- [ ] A product with 2 images renders only 2 thumbnails (no broken grid)

### Product Info Panel (`lg-product-info`)

- [ ] **Element order**: breadcrumb → title → stars+reviews → price → description → mat+dims → stepper+CTA → wishlist+commission → trust row
- [ ] Breadcrumb shows: Home > Collections > {product.title}
- [ ] Product title is 72px Cormorant Garamond, weight 300
- [ ] Star rating shows filled stars in `#B88E2F`
- [ ] Review count appears in Montserrat 10px beside stars
- [ ] Price is 30px Cormorant Garamond in `#B88E2F`
- [ ] Discounted product: discounted price large + original struck-through in `#78716c`
- [ ] Description uses Inter 300, 14px, line-height 1.7, color `#57534e`
- [ ] Materials + Dimensions block has top + bottom borders `1px solid rgba(210,197,177,0.3)`
- [ ] Materials + Dimensions 2-column grid with 32px gap
- [ ] Material label and value appear; Dimensions label and value appear
- [ ] Quantity stepper border `1px solid rgba(210,197,177,0.5)`
- [ ] ADD TO CART button: `#B88E2F` background, Montserrat 11px uppercase, 20px vertical padding
- [ ] ADD TO CART button is disabled when `isOutOfStock === true`
- [ ] Clicking ADD TO CART updates the navbar cart counter
- [ ] Toast appears confirming "added to cart"
- [ ] Clicking "Add to Wishlist" updates navbar wishlist counter
- [ ] "Commission a Custom Version" navigates to `/custom-order`
- [ ] Trust row: 3-column grid, icons `#a8a29e`, labels 8px Montserrat

### Scrollytelling (`lg-scrollytelling`)

**Lifestyle Section**
- [ ] Section is exactly 100vh tall
- [ ] Background image fills the full section via `<img>` tag (not CSS background-image)
- [ ] `<img>` is positioned `absolute inset-0` with `object-fit: cover`
- [ ] Dark overlay `rgba(28,25,21,0.2)` sits above the image
- [ ] Text container is positioned left, vertically centered (not bottom-pinned)
- [ ] Quote text is 96px Cormorant Garamond, weight 300, color `#ffffff`
- [ ] Frosted-glass panel: `bg rgba(255,255,255,0.1)`, `backdrop-blur 16px`, `border-left 1px solid rgba(255,255,255,0.3)`, max-width 448px
- [ ] Section fades in on scroll entry

**Craft/Heritage Section**
- [ ] Section uses a 50/50 two-column grid
- [ ] Section minimum height is 819px
- [ ] Left column contains a grayscale (30%) craft image that fills the full column
- [ ] Right column has white background, padded 48px → 96px
- [ ] Overline text is `#B88E2F`, Montserrat 10px, letter-spacing 0.3em
- [ ] Heading is Cormorant Garamond 48px, color `#1e1b15`
- [ ] Three stats: "60+ / Hours Per Piece", "15+ / Years of Craft", "500+ / Bespoke Works"
- [ ] Stat values are 30px Cormorant in `#B88E2F`
- [ ] Section fades in on scroll entry

**Related Products Section**
- [ ] Section background is `#F9F1E7`
- [ ] Up to 3 related product cards appear in a 3-column grid
- [ ] Cards use custom inline markup (NOT `lg-product-card`)
- [ ] Card image has 3:4 aspect ratio
- [ ] Card info row: product name left + price right
- [ ] Category label appears below the product name in Montserrat 10px `#a8a29e`
- [ ] Card hover: image scales to 1.1, box-shadow `0 25px 50px -12px rgba(28,25,21,0.05)`
- [ ] Clicking a related card navigates to `/products/:relatedId`
- [ ] Navigating to a related product fully reloads the PDP with the new product's data
- [ ] Section is hidden entirely when no related products exist
- [ ] Section fades in on scroll entry

### Meta Tags & SEO

- [ ] Document title reads `"{product.title} — Lugar Furniture"`
- [ ] Meta description contains the product description
- [ ] `og:image` meta tag contains `product.primaryImage`

### State & Navigation

- [ ] Navigating from `/products/1` to `/products/2` via a related card reloads all data
- [ ] No stale product data visible during navigation (previous product title/price clears immediately)
- [ ] On rapid navigation (click related card quickly), only the most recent product loads (HTTP cancellation works)
- [ ] Error state renders when navigating to a non-existent product ID

### Build

- [ ] `ng build` completes with zero TypeScript errors
- [ ] `ng build` completes with zero Angular template warnings
- [ ] `ng build --output-mode static` completes — 9 static routes prerendered, `/products/:id` uses `RenderMode.Client`
- [ ] No SSR errors during prerender
- [ ] No browser console errors on page load

---

## Integration Test Scenario

1. Navigate to `/products/1` — verify title, gallery, price, description load
2. Click thumbnail #3 — verify main image updates, thumbnail #3 gains active border
3. Click "−" and "+" on the stepper to set qty = 3, click ADD TO CART — verify cart counter shows 3
4. Click "Add to Wishlist" — verify wishlist counter increments
5. Scroll down past the fold — verify lifestyle section, craft section, and related cards are visible
6. Click a related card — verify URL changes to `/products/:relatedId` and all product data updates
7. Click "Commission a Custom Version" — verify navigation to `/custom-order`
