# Data Model: PDP Pixel-Perfect Build (002)

**Date**: 2026-03-23
**Branch**: `002-pdp-pixel-perfect`

---

## Entities

### Product (unified model — no changes)

Defined in `src/app/shared/models/product.model.ts`. Used as-is.

| Field | Type | Notes |
|---|---|---|
| `id` | `number` | Route param source |
| `title` | `string` | Displayed in h1, breadcrumb, meta title, WhatsApp message |
| `titleAr` | `string` | Future RTL phase — not rendered Phase 4 |
| `price` | `number` | EGP, rendered via lgCurrencyEgp pipe |
| `discountedPrice` | `number` | 0 = no discount |
| `discount` | `number` | Percentage (e.g. 20) |
| `hasDiscount` | `boolean` | computed: discountedPrice > 0 |
| `images` | `string[]` | Up to 4 image URLs |
| `primaryImage` | `string` | images[0] with fallback |
| `categoryId` | `number` | Used to fetch related products |
| `categoryName` | `string` | Displayed as category label, breadcrumb segment |
| `subCategoryId` | `number` | 1=New, 5=Top — drives badge |
| `isNew` | `boolean` | subCategoryId === 1 |
| `isTop` | `boolean` | subCategoryId === 5 |
| `isOutOfStock` | `boolean` | availability !== 'in_stock' |
| `rating` | `number` | Displayed as star rating (0–5) |
| `reviews` | `number` | Count shown next to rating |
| `description` | `string` | Body text |
| `videoLink` | `string?` | Not rendered in Phase 4 |
| `badge` | `string?` | Optional override badge text |
| `subtitle` | `string?` | Secondary tagline if present |
| `qty` | `number` | Available stock (from API) |

---

### CartItem (no changes)

Defined in `src/app/shared/models/cart.model.ts`.

| Field | Type | Notes |
|---|---|---|
| `id` | `number` | Product id |
| `title` | `string` | Snapshot at time of add |
| `image` | `string` | primaryImage snapshot |
| `qty` | `number` | Quantity selected by user |
| `price` | `number` | activePrice at time of add |

**Storage key**: `STORAGE_KEYS.CART` = `'shoppingCart'`

---

### WishlistItem (no changes)

Persisted as `number[]` (product IDs) in `STORAGE_KEYS.WISHLIST` = `'wishlist'`.

---

## Component I/O Contracts

### `lg-image-gallery`

```
Inputs:
  images: string[]          required — product image URL array (max 4 shown)
  selectedIndex: number     required — index of currently active image

Outputs:
  selectImage: number       emits new index when thumbnail clicked
```

**State rules**:
- Thumbnail at `selectedIndex` always has 2px gold (`#B88E2F`) border
- If `images.length <= 1`, thumbnail strip is hidden
- Main image transitions via CSS opacity (no JS needed — class-bound)

---

### `lg-product-info`

```
Inputs:
  product: Product          required
  qty: number               required — current quantity from PdpStateService
  isWishlisted: boolean     required — from WishlistService.isInWishlist(id)

Outputs:
  qtyChange: number         emits new qty from lg-quantity-stepper
  addToCart: void           user clicked Add to Cart
  wishlistToggle: void      user clicked wishlist icon
  whatsappEnquire: void     user clicked WhatsApp CTA
  commissionCustom: void    user clicked Commission Custom
```

**State rules**:
- Add to Cart button disabled + aria-disabled when `product.isOutOfStock`
- Price block shows `discountedPrice` (gold) + `price` (strikethrough) when `hasDiscount`
- Price block shows `price` only when no discount
- Star rating renders filled/empty stars based on `Math.round(product.rating)`
- WhatsApp URL built in parent page, passed down via event; output is just a "clicked" signal

---

### `lg-scrollytelling`

```
Inputs:
  relatedProducts: Product[]    required — pre-filtered, excludes current product

Outputs:
  addRelatedToCart: Product     emits product when card "Add to Cart" clicked
  addRelatedToWishlist: Product emits product when card wishlist toggled
```

**State rules**:
- Related products section header: "Curated For You" + link to /products
- If `relatedProducts.length === 0` the related section renders an empty-state
- Lifestyle image section uses a static local image asset (placeholder)
- Craft story section uses static copy

---

## PdpStateService Signals (existing — no changes)

| Signal / Computed | Type | Source |
|---|---|---|
| `product` | `Signal<Product \| null>` | `getProductById()` result |
| `relatedProducts` | `Signal<Product[]>` | `getProductsByCategory()` filtered |
| `isLoading` | `Signal<boolean>` | HTTP in-flight flag |
| `error` | `Signal<string \| null>` | Error message if load fails |
| `selectedImageIdx` | `Signal<number>` | User selection (default 0) |
| `qty` | `Signal<number>` | User selection (default 1) |
| `activeImage` | `Computed<string>` | `product.images[selectedImageIdx]` |
| `activePrice` | `Computed<number>` | hasDiscount ? discountedPrice : price |
| `breadcrumbs` | `Computed<BreadcrumbItem[]>` | [Home, Collections, categoryName, title] |

---

## Validation Rules (component boundary)

| Rule | Component | Enforcement |
|---|---|---|
| qty ≥ 1 | `lg-quantity-stepper` | `min=1` input; PdpStateService.setQty enforces |
| qty ≤ 99 | `lg-quantity-stepper` | `max=99` input |
| Cannot add out-of-stock | `lg-product-info` | button `[disabled]="product.isOutOfStock"` |
| Max 4 thumbnails | `lg-image-gallery` | `images \| slice:0:4` in template |
| Exclude self from related | `PdpStateService` | `loadRelated` filters out current product id |

---

## WhatsApp Deep Link Format

Built in `lg-product-detail-page.buildWhatsAppUrl(title: string)`:

```
https://wa.me/{PHONE}?text=Hi%2C+I%27m+interested+in+{encodedTitle}
```

Phone number source: `environment.whatsappPhone` (to be added to environment files).
