# Lugar Furniture — Claude Code Project Guide

## Project Overview

**Client:** Lugar Furniture (lugarfurniture.eg)
**Website:** lugarstore.net
**Type:** Luxury furniture e-commerce — Angular frontend + PHP backend
**Market:** Egypt + Gulf (KSA, UAE)
**Brand positioning:** High-end, workshop-based, ready-made + custom furniture
**Design reference:** Article.com, Zara Home, Poliform

---

## Tech Stack

### Frontend
- Angular 21 with Signals + SSR (Angular Universal)
- Tailwind CSS v4
- GSAP for animations (browser-only, always wrapped in isPlatformBrowser)
- Standalone components only
- Component prefix: `lg-`
- Pattern: MVVM (same rules as angular-code-quality skill)

### Backend
- Existing PHP 8.x APIs at `https://lugarstore.net/api`
- APIs are live and used as-is for Phase 1
- Backend refactoring is a separate project — do not modify PHP files
- No authentication — all APIs are public

### Hosting
- TBD (Azure Static Web Apps or Cloudflare Pages)

---

## API Configuration

### Base URL
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://lugarstore.net/api'
};

// environment.production.ts
export const environment = {
  production: true,
  apiUrl: 'https://lugarstore.net/api'
};
```

### HTTP Interceptor
All HTTP requests must go through an interceptor that prepends `environment.apiUrl`:
```typescript
// core/interceptors/api.interceptor.ts
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.endsWith('.json')) return next(req);
  const apiReq = req.clone({ url: `${environment.apiUrl}${req.url}` });
  return next(apiReq);
};
```

### All Endpoints
| Method | Path | Service | Purpose |
|---|---|---|---|
| GET | `/products/get_products.php` | ProductService | All products (client-side filter/sort) |
| GET | `/products/get_discounted_products.php` | ProductService | Hot deals / discounted products |
| GET | `/products/get_product-v2.php/?id={id}` | ProductService | Single product detail |
| GET | `/products/get_products_by_categoryId.php/?categoryId={id}` | ProductService | Related products |
| GET | `/categories/get_categories.php` | CategoryService | All categories |
| GET | `/sub_categories/get_subcategories.php` | SubCategoryService | All subcategories |
| GET | `/banners/get_banners.php` | BannerService | Promo banners (wrapped in ApiResponse) |
| GET | `/countries/countries.php` | CountryService | Countries + states for checkout |
| POST | `/orders/create_order.php` | OrderService | Create checkout order |
| POST | `/messages/create_message.php` | ContactService | Send contact form |
| POST | `/orders/create_custom_order.php` | CustomOrderService | Submit custom order |
| POST | `/uploads/upload_reference_image.php` | CustomOrderService | Upload reference image (multipart) |
| POST | `/appointments/schedule.php` | CustomOrderService | Schedule measurement appointment |

---

## Data Models

### CRITICAL: Always use these unified models — never use raw API shapes directly

The old project had split interfaces and untyped data. The new project fixes all of this in the service layer before data reaches any component.

```typescript
// shared/models/product.model.ts

// Raw API shape — only used inside ProductService, never exposed to components
interface RawProduct {
  id: number;
  title: string;
  titleAr: string;
  discountedPrice: string;   // string "0" means no discount
  originalPrice: string;     // string — must be parsed
  description: string;
  imgOne: string;
  imgTwo: string;
  imgThree: string;
  imgFour: string;
  videoLink: string;
  categoryId: string;        // string — must be parsed to number
  subCategoryId: number;     // 1 = New, 5 = Top
  rating: number;
  isNew?: boolean;
  discount: number;
  reviews?: number;
  badge?: string;
  subtitle?: string;
  availability: string;
  qty: number;
  categoryName: string;
}

// Unified model — what ALL components receive
export interface Product {
  id: number;
  title: string;
  titleAr: string;
  price: number;              // parsed from originalPrice
  discountedPrice: number;    // parsed from discountedPrice, 0 = no discount
  discount: number;           // percentage e.g. 20
  hasDiscount: boolean;       // computed: discountedPrice > 0
  images: string[];           // normalized from imgOne/imgTwo/imgThree/imgFour
  primaryImage: string;       // images[0] with fallback
  categoryId: number;         // parsed from string
  categoryName: string;
  subCategoryId: number;
  isNew: boolean;             // subCategoryId === 1
  isTop: boolean;             // subCategoryId === 5
  isOutOfStock: boolean;      // availability !== 'in_stock'
  rating: number;
  reviews: number;
  description: string;
  videoLink?: string;
  badge?: string;
  subtitle?: string;
  qty: number;
}

// Normalization function — used inside ProductService only
export function normalizeProduct(raw: RawProduct): Product {
  const images = [raw.imgOne, raw.imgTwo, raw.imgThree, raw.imgFour]
    .filter(Boolean);
  return {
    id: raw.id,
    title: raw.title,
    titleAr: raw.titleAr,
    price: Number(raw.originalPrice),
    discountedPrice: Number(raw.discountedPrice),
    discount: raw.discount,
    hasDiscount: Number(raw.discountedPrice) > 0,
    images,
    primaryImage: images[0] || 'assets/images/placeholder.png',
    categoryId: Number(raw.categoryId),
    categoryName: raw.categoryName,
    subCategoryId: raw.subCategoryId,
    isNew: raw.subCategoryId === 1,
    isTop: raw.subCategoryId === 5,
    isOutOfStock: raw.availability !== 'in_stock',
    rating: raw.rating,
    reviews: raw.reviews ?? 0,
    description: raw.description,
    videoLink: raw.videoLink,
    badge: raw.badge,
    subtitle: raw.subtitle,
    qty: raw.qty,
  };
}
```

```typescript
// shared/models/category.model.ts
export interface Category {
  id: number;
  title: string;
  titleAr: string;
  image: string;   // normalized from imgOne
}
```

```typescript
// shared/models/cart.model.ts
export interface CartItem {
  id: number;
  title: string;
  image: string;
  qty: number;
  price: number;
}

// localStorage keys
export const STORAGE_KEYS = {
  CART: 'shoppingCart',
  WISHLIST: 'wishlist',
  CUSTOM_ORDER: 'currentCustomOrder',
  CUSTOMIZATION_CODE: 'savedCustomizationCode',
} as const;
```

```typescript
// shared/models/banner.model.ts
export interface Banner {
  id: string;
  fileUrl: string;
  visible: boolean;
  selected: boolean;
  created_at: string;
  order?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
```

```typescript
// shared/models/order.model.ts
export interface CreateOrderPayload {
  name: string;
  phoneNumber: string;
  address: string;
  state: string;
  statusId: 2;        // always hardcoded to 2
  date: Date;
  email: string;
  products: { productId: number; qty: number; }[];
}
```

---

## Business Logic Rules

### Pricing
- `originalPrice` and `discountedPrice` come from API as **strings** — always parse in service layer
- A discount exists when `discountedPrice > 0`
- Active price = `hasDiscount ? discountedPrice : price`
- Currency: EGP — use `lg-currency` pipe (recreate `AddSpaceAfterCurrencyPipe`)
- Format: `EGP 2,500` — space between EGP and number

### Badge Logic
```typescript
// Derived from subCategoryId — never trust the isNew field from API
isNew: subCategoryId === 1   // "New" badge
isTop: subCategoryId === 5   // "Top" badge
hasDiscount: discount > 0    // Discount badge
```

### Filtering & Sorting
- All products fetched in one request — filtering done client-side
- Category filter: strict `===` comparison on `categoryId` (number after normalization)
- Sort options: `newest` (id desc), `priceAsc`, `priceDesc`
- Default page size: 12 per page (upgraded from old 16)

### Banners
- Filter active banners: `banner.visible === true && banner.selected === true`
- Response is wrapped: `{ success: boolean, data: Banner[] }`

### Cart & Wishlist
- 100% localStorage — no API calls
- Cart key: `shoppingCart`
- Wishlist key: `wishlist`
- All storage via `StorageService` (SSR-safe)

### Checkout
- `statusId` always hardcoded to `2`
- After order success: clear cart localStorage only (not all localStorage)

---

## SSR Rules — Non-Negotiable

### Never use browser APIs directly
```typescript
// ❌ Breaks SSR
localStorage.getItem('cart')
window.scrollY

// ✅ SSR-safe
private readonly platformId = inject(PLATFORM_ID);
if (isPlatformBrowser(this.platformId)) { ... }
```

### GSAP — always browser-only
```typescript
// ✅ Correct pattern
private readonly platformId = inject(PLATFORM_ID);

ngAfterViewInit() {
  if (!isPlatformBrowser(this.platformId)) return;
  gsap.from('.hero', { opacity: 0, y: 40, duration: 1, ease: 'power2.out' });
}
```

### StorageService — only way to touch localStorage
```typescript
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly platformId = inject(PLATFORM_ID);

  get(key: string): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(key);
  }

  set(key: string, value: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(key, value);
  }

  remove(key: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(key);
  }
}
```

### Meta tags — every page
```typescript
private readonly meta = inject(Meta);
private readonly title = inject(Title);

private setMeta(product: Product): void {
  this.title.setTitle(`${product.title} — Lugar Furniture`);
  this.meta.updateTag({ name: 'description', content: product.description });
  this.meta.updateTag({ property: 'og:image', content: product.primaryImage });
}
```

---

## Architecture Rules

### Folder Structure
```
src/app/
├── core/
│   ├── interceptors/
│   │   └── api.interceptor.ts
│   └── services/
│       ├── cart.service.ts
│       ├── wishlist.service.ts
│       ├── toast.service.ts
│       └── storage.service.ts
│
├── features/
│   ├── home/
│   │   ├── components/
│   │   ├── models/
│   │   ├── services/
│   │   └── pages/
│   ├── products/
│   │   ├── components/
│   │   ├── models/
│   │   ├── services/
│   │   └── pages/
│   ├── product-detail/
│   │   ├── components/
│   │   ├── models/
│   │   ├── services/
│   │   └── pages/
│   ├── cart/
│   ├── wishlist/
│   ├── checkout/
│   ├── hot-deals/
│   ├── contact/
│   ├── custom-order/
│   └── atelier/
│
└── shared/
    ├── components/
    │   ├── ui/
    │   ├── navigation/
    │   ├── product/
    │   ├── commerce/
    │   ├── filtering/
    │   ├── feedback/
    │   └── layout/
    ├── models/
    ├── pipes/
    │   └── currency-egp.pipe.ts   ← recreate AddSpaceAfterCurrencyPipe
    └── services/
```

### Component Rules
- Always standalone + OnPush
- `inject()` not constructor injection
- Prefix all selectors with `lg-`
- No business logic in components
- No HttpClient in components
- No state signals in components
- Signals only — never BehaviorSubject
- All browser APIs via `isPlatformBrowser` or `StorageService`

---

## Design System

### Color Palette
```scss
--color-bg-primary:   #F9F1E7;   // Dominant background
--color-bg-secondary: #EDE4D8;   // Alternate sections
--color-bg-dark:      #1A1A18;   // Footer + one CTA section only
--color-surface:      #FFFFFF;   // Cards, modals, forms
--color-text-dark:    #333333;   // Primary text
--color-text-muted:   #7A6F65;   // Captions, labels
--color-text-light:   #FFFFFF;   // Text on dark bg
--color-gold:         #B88E2F;   // Primary accent
--color-gold-hover:   #9A7A32;   // Gold hover
--color-border:       #E8E8E8;   // Borders, dividers
--color-error:        #E97171;   // Errors
```

### Typography
```scss
// Cormorant Garamond — headings, weight 300, never bold
// Montserrat Light — labels/nav/buttons, uppercase, wide tracking
// Inter Regular — body, line-height 1.7
```

### Spacing
```
Section padding:    80px vertical minimum
Hero padding:       120px minimum
Max-width:          1280px centered
Grid gap:           32px
```

---

## Build Order

```
Phase 1 — Foundation
  □ Tailwind v4 + design tokens
  □ Folder structure
  □ API interceptor
  □ Environment files
  □ StorageService (SSR-safe)
  □ Unified Product model + normalizeProduct()
  □ All shared models (Category, CartItem, Banner, Order)
  □ ProductService (real API, normalized output)
  □ CategoryService
  □ BannerService
  □ CartService (localStorage via StorageService)
  □ WishlistService (localStorage via StorageService)
  □ ToastService

Phase 2 — Shared Components
  □ UI: lg-button, lg-input, lg-badge, lg-divider, lg-spinner
  □ Pipes: lg-currency (AddSpaceAfterCurrency)
  □ Layout: lg-section-header
  □ Navigation: lg-navbar, lg-mobile-drawer, lg-breadcrumb, lg-footer
  □ Product: lg-product-card (all 5 states)
  □ Commerce: lg-trust-strip, lg-quantity-stepper, lg-order-summary
  □ Filtering: lg-filter-bar, lg-category-pill, lg-pagination
  □ Feedback: lg-toast, lg-empty-state

Phase 3 — Homepage
  □ Feature components + page assembly

Phase 4 — Product Pages
  □ PLP, PDP, Quick View Modal

Phase 5 — Commerce Pages
  □ Cart, Wishlist, Checkout, Custom Order

Phase 6 — Secondary Pages
  □ Hot Deals, Contact, Atelier
```

---

## Important Business Context

- Products: EGP 23,000–70,000+ — luxury positioning in every decision
- WhatsApp is the primary sales conversion channel
- Custom/bespoke orders are the key brand differentiator
- Gulf customers (KSA, UAE) respond to "handcrafted in Cairo" exclusivity
- SEO is critical — SSR from day one
- Arabic RTL planned for future phase — not Phase 1

---

## Self-Check Before Every Task

```
Architecture:
□ Read CLAUDE.md fully before writing any code
□ lg- prefix on all components
□ Standalone + OnPush always
□ No logic in components — everything in services
□ Signals only — no BehaviorSubject

Data:
□ Raw API data normalized in service — never in component
□ Always use unified Product model, never RawProduct
□ Numbers parsed from strings in service layer
□ Images always accessed via images[] array or primaryImage
□ Badge logic derived from subCategoryId, not isNew field

SSR:
□ No direct localStorage — use StorageService
□ No direct window/document — use isPlatformBrowser
□ All GSAP in ngAfterViewInit + isPlatformBrowser guard
□ Every page sets Title and Meta tags
□ HttpClient only — never fetch()

Design:
□ Cream #F9F1E7 dominant background
□ Gold #B88E2F sparingly — CTAs, prices, borders only
□ Cormorant Garamond / Montserrat Light / Inter only
□ No teal, cyan, blue — warm palette only
□ No shadows, no gradients, no radius > 4px
```

## Recent Changes
- 001-fix-pagination-truncation: Added [if applicable, e.g., PostgreSQL, CoreData, files or N/A]
