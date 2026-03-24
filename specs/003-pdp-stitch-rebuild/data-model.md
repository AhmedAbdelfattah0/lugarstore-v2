# Data Model: Product Detail Page — Pixel-Perfect Stitch Rebuild

**Branch**: `003-pdp-stitch-rebuild` | **Date**: 2026-03-24

All models are consumed from `src/app/shared/models/` — no new models are introduced by this feature. This document records which fields each component uses and how they map to UI elements.

---

## Product (existing — `shared/models/product.model.ts`)

| Field | Type | Used By | UI Purpose |
|-------|------|---------|-----------|
| `id` | `number` | Page, scrollytelling | Route param comparison, related card link |
| `title` | `string` | Product info, page | H1 title (72px), meta title, WhatsApp message |
| `price` | `number` | Product info | Original price (shown struck-through when discounted) |
| `discountedPrice` | `number` | Product info | Active price when `hasDiscount` is true |
| `hasDiscount` | `boolean` | Product info | Toggle between price display variants |
| `images` | `string[]` | Image gallery, scrollytelling | Gallery main + thumbnails (max 4); lifestyle `<img>` src |
| `primaryImage` | `string` | Image gallery, page | Fallback main image; og:image meta tag |
| `categoryId` | `number` | Page → scrollytelling | Passed to `getLifestyleImages()` for curated room photography |
| `categoryName` | `string` | Breadcrumb | Second breadcrumb segment |
| `description` | `string` | Product info, page | Description paragraph; og:description meta tag |
| `badge` | `string \| undefined` | Product info | Material field value (fallback: "Premium Egyptian Linen") |
| `subtitle` | `string \| undefined` | Product info | Dimensions field value (fallback: "240W × 105D × 75H cm") |
| `isOutOfStock` | `boolean` | Product info | Disables ADD TO CART button |
| `rating` | `number` | Product info | Star rating display (filled stars) |
| `reviews` | `number` | Product info | Review count text "(N Reviews)" |

---

## PdpStateService signals (internal to service)

| Signal | Type | Initial | Description |
|--------|------|---------|-------------|
| `_product` | `Signal<Product \| null>` | `null` | Current product; null during load or on error |
| `_relatedProducts` | `Signal<Product[]>` | `[]` | Up to 3 same-category products, current excluded |
| `_isLoading` | `Signal<boolean>` | `false` | True while HTTP chain is in flight |
| `_error` | `Signal<string \| null>` | `null` | Error message; null on success |
| `_qty` | `Signal<number>` | `1` | Selected purchase quantity (min 1) |
| `_selectedImageIdx` | `Signal<number>` | `0` | Index of currently displayed gallery image |
| `_cancel$` | `Subject<void>` | — | Emitted at start of each `loadProduct()` to cancel prior HTTP chain |

### Computed signals (derived, exposed as readonly)

| Computed | Derives From | Exposed As |
|----------|-------------|-----------|
| `activeImage` | `_product().images[_selectedImageIdx()]` | `readonly string` |
| `activePrice` | `hasDiscount ? discountedPrice : price` | `readonly number` |
| `breadcrumbs` | `product.categoryName + product.title` | `readonly BreadcrumbItem[]` |

---

## CategoryLifestyleImages (existing — `product-detail/data/category-lifestyle-images.ts`)

| Field | Type | Description |
|-------|------|-------------|
| `lifestyle` | `string` | Filename in `public/` for the full-viewport lifestyle section background |
| `craft` | `string` | Filename in `public/` for the craft section left-column image |

Lookup: `getLifestyleImages(categoryId: number): CategoryLifestyleImages`
Fallback: `DEFAULT_LIFESTYLE_IMAGES = { lifestyle: 'hero-lifestyle.jpg', craft: 'hero-lifestyle.jpg' }`

---

## CartItem (existing — `shared/models/cart.model.ts`)

Not modified. `CartService.addItem(product, qty)` is called by the page component on "ADD TO CART" action.

## WishlistItem (existing — `shared/models/cart.model.ts`)

Not modified. `WishlistService.toggle(product)` is called by the page component on wishlist toggle.

---

## State Lifecycle

```
Route navigate to /products/:id
  │
  ▼
effect() detects paramMap signal change
  │
  ▼
pdpState.loadProduct(id)
  ├─ _cancel$.next()        → cancels prior in-flight HTTP
  ├─ _isLoading = true
  ├─ _product = null
  ├─ _relatedProducts = []
  ├─ _error = null
  ├─ _qty = 1
  └─ _selectedImageIdx = 0
        │
        ▼
  getProductById(id)
        │
        ▼ (switchMap)
  _product.set(product)
  getProductsByCategory(product.categoryId)
        │
        ├─ next: _relatedProducts.set([...]), _isLoading = false
        └─ error: _error.set('...'), _isLoading = false
```
