---
name: angular-code-quality
description: >
  Apply this skill for ANY code generation, Angular component or service creation, architecture
  analysis, design-to-component planning, or code review task. Triggers on: "create a component",
  "generate a service", "write a function", "analyze the architecture", "add a feature", "refactor
  this", "review my code", "analyze the design", "plan components from design", "what should be
  reusable", or any request that involves writing or modifying TypeScript/Angular code OR planning
  components from a Figma/Stitch/MCP design source. Always read CLAUDE.md first if it exists, then
  run the design analysis phase before writing a single line of code.
---

# Angular Code Quality Skill

---

## STEP 1 — Read CLAUDE.md First

Before doing ANYTHING, check if a CLAUDE.md exists in the project root.
Read it fully. It overrides any default assumption in this skill.

```bash
cat CLAUDE.md 2>/dev/null || echo "No CLAUDE.md found"
```

---

## STEP 2 — Design Analysis Phase (Run Before Any Code)

**This step is mandatory when starting a new feature, page, or when a design source is available.**
Skip only if you are making a minor isolated fix to an existing component.

### 2A — Extract Design via MCP

If a Figma or Stitch MCP server is connected, read the design before planning anything:

```
// Figma MCP
use_mcp_tool: get_design_context(node_id)
use_mcp_tool: get_screenshot(node_id)

// Stitch MCP  
use_mcp_tool: read_canvas()
use_mcp_tool: get_selected_frame()
use_mcp_tool: get_style_guide()
```

If no MCP is available, ask the user to describe the design or share screenshots before proceeding.

### 2B — Component Identification Matrix

After reading the design, scan EVERY element and classify it using this matrix:

```
For each UI element found, ask:
  1. Does it appear on more than one page?           → YES = shared candidate
  2. Does it appear more than once on the same page? → YES = shared candidate  
  3. Does it have variations/states?                 → YES = shared candidate with @Input variants
  4. Is it purely presentational (no business logic)?→ YES = shared component
  5. Does it contain business logic or API calls?    → NO to shared, goes in feature/services
```

### 2C — Component Classification

Classify every identified component into one of three buckets:

**BUCKET A — Shared Components** (`shared/components/`)
These appear across multiple features or pages. Build once, use everywhere.

Examples to always look for in a furniture e-commerce design:
```
UI Primitives:
  lg-button           → primary, outlined, ghost, text variants
  lg-input            → text, textarea, select, file upload variants
  lg-badge            → new, discount, out-of-stock, gold, cream variants
  lg-spinner          → loading state

Navigation:
  lg-navbar           → sticky, transparent, scrolled states
  lg-mobile-drawer    → slide-in navigation
  lg-breadcrumb       → path navigation, accepts items[] array
  lg-footer           → full footer with columns

Product:
  lg-product-card     → all 5 states via @Input (default/new/discounted/hover/out-of-stock)
  lg-product-grid     → Bento mixed layout, accepts products[] + layout config
  lg-product-list-row → horizontal list view row
  lg-quick-view-modal → product quick view overlay

Commerce:
  lg-cart-item-row    → single cart/wishlist row
  lg-order-summary    → summary panel (used in cart, wishlist, checkout)
  lg-trust-strip      → 4-column trust features row
  lg-quantity-stepper → – count + stepper

Filtering:
  lg-filter-bar       → category pills + sort dropdown
  lg-category-pill    → single pill, gold active state
  lg-pagination       → minimal page navigation

Feedback:
  lg-toast            → 4 variants: success, error, wishlist, info
  lg-empty-state      → empty cart, empty wishlist, no results

Layout:
  lg-section-header   → eyebrow + heading + subtext pattern
  lg-divider          → gold or muted horizontal line
```

**BUCKET B — Feature Components** (`features/{feature}/components/`)
Specific to one feature, use business logic or feature-specific state.

```
home/components/
  lg-hero             → homepage hero (uses home state service)
  lg-promo-banner     → promotional carousel (uses promotions service)
  lg-room-slider      → room inspirations (uses rooms service)
  lg-atelier-section  → brand story section
  lg-social-gallery   → Instagram grid

products/components/
  lg-product-filters  → filter sidebar/bar with URL sync
  lg-product-sort     → sort dropdown with route params
  
product-detail/components/
  lg-image-gallery    → main image + thumbnails
  lg-product-info     → right panel with add-to-cart
  lg-scrollytelling   → product story scroll sections
  lg-swatch-selector  → color/fabric swatches

cart/components/
  lg-cart-table       → full cart items table
  
checkout/components/
  lg-billing-form     → billing details form with validation
```

**BUCKET C — Page Components** (`features/{feature}/pages/`)
Routed shells only — no logic, just compose feature + shared components.

```
lg-home-page
lg-products-page
lg-product-detail-page
lg-cart-page
lg-wishlist-page
lg-checkout-page
lg-hot-deals-page
lg-contact-page
lg-custom-order-page
```

### 2D — Output a Component Plan Before Writing Code

Always present this plan to the user before generating anything:

```
## Component Plan

### Shared Components (build these first)
| Component | Selector | Inputs | Used On |
|---|---|---|---|
| Product Card | lg-product-card | product, variant | Home, PLP, PDP, Hot Deals |
| Filter Bar | lg-filter-bar | categories, activeCategory, sortOptions | PLP, Hot Deals |
| Pagination | lg-pagination | total, page, pageSize | PLP, Hot Deals |
| Breadcrumb | lg-breadcrumb | items: BreadcrumbItem[] | PLP, PDP, Cart, Checkout |
| Order Summary | lg-order-summary | items, subtotal, shipping | Cart, Wishlist, Checkout |
| Toast | lg-toast | variant, title, message, duration | Global (core) |
| Section Header | lg-section-header | eyebrow, heading, subtext, align | All pages |
| Quantity Stepper | lg-quantity-stepper | value, min, max | PDP, Cart, Wishlist |
| Badge | lg-badge | variant: 'new'|'discount'|'out-of-stock', label | Product Card |
| Trust Strip | lg-trust-strip | — (static content) | Home, PDP |

### Feature Components (build per feature)
[list feature-specific components]

### Pages (build last)
[list page shells]

### Build Order
Phase 1: Shared primitives (button, input, badge, divider, section-header)
Phase 2: Shared commerce (product-card, filter-bar, pagination, breadcrumb, order-summary)
Phase 3: Core services (cart, wishlist, product, toast)
Phase 4: Feature by feature starting with Home
Phase 5: Pages wiring everything together
```

**Wait for user confirmation before proceeding to code.**

---

## STEP 3 — Project Structure

```
src/app/
├── core/
│   ├── guards/
│   ├── interceptors/
│   └── services/              ← CartService, WishlistService, ToastService (singletons)
│
├── features/
│   ├── home/
│   │   ├── components/        ← lg-hero, lg-promo-banner, lg-room-slider, etc.
│   │   ├── models/
│   │   ├── services/          ← HomeStateService
│   │   └── pages/             ← lg-home-page
│   ├── products/
│   │   ├── components/        ← lg-product-filters, lg-product-sort
│   │   ├── models/            ← Product, Category, Filter interfaces
│   │   ├── services/          ← ProductService, FilterStateService
│   │   └── pages/             ← lg-products-page
│   ├── product-detail/
│   │   ├── components/        ← lg-image-gallery, lg-product-info, lg-scrollytelling
│   │   ├── models/
│   │   ├── services/          ← ProductDetailService
│   │   └── pages/             ← lg-product-detail-page
│   ├── cart/
│   ├── wishlist/
│   ├── checkout/
│   ├── hot-deals/
│   ├── contact/
│   └── custom-order/
│
└── shared/
    ├── components/
    │   ├── ui/                ← lg-button, lg-input, lg-badge, lg-spinner, lg-divider
    │   ├── navigation/        ← lg-navbar, lg-mobile-drawer, lg-breadcrumb, lg-footer
    │   ├── product/           ← lg-product-card, lg-product-grid, lg-product-list-row
    │   ├── commerce/          ← lg-cart-item-row, lg-order-summary, lg-trust-strip
    │   │                         lg-quantity-stepper, lg-quick-view-modal
    │   ├── filtering/         ← lg-filter-bar, lg-category-pill, lg-pagination
    │   ├── feedback/          ← lg-toast, lg-empty-state
    │   └── layout/            ← lg-section-header
    ├── models/                ← Product, Category, CartItem, BreadcrumbItem, etc.
    ├── pipes/                 ← currency-egp, truncate
    └── services/              ← ApiService, StorageService (base abstractions)
```

### File Placement Rules
- Used in 2+ features → `shared/`
- Used in 1 feature only → `features/{feature}/components/`
- Has routing → `features/{feature}/pages/`
- Has state/HTTP → `features/{feature}/services/`
- App-wide singleton → `core/services/`

---

## STEP 4 — MVVM Pattern

| Layer | Angular Equivalent | Responsibility |
|---|---|---|
| Model | `*.model.ts`, `*.interface.ts` | Data shape only — no logic |
| ViewModel | `*.service.ts` (`providedIn: 'root'`) | Signals, computed, HTTP, business logic |
| View | `*.component.ts` + `*.component.html` | Render only — binds to ViewModel |

### Model — Pure Data Shape
```typescript
// shared/models/product.model.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  isNew: boolean;
  isOutOfStock: boolean;
  discountPercent?: number;
}

export interface BreadcrumbItem {
  label: string;
  route?: string;
}

export interface FilterState {
  category: string | null;
  sort: 'newest' | 'price_asc' | 'price_desc';
  page: number;
}
```

### ViewModel — Service Owns ALL State
```typescript
// features/products/services/filter-state.service.ts
@Injectable({ providedIn: 'root' })
export class FilterStateService {
  private readonly _category = signal<string | null>(null);
  private readonly _sort = signal<'newest' | 'price_asc' | 'price_desc'>('newest');
  private readonly _page = signal<number>(1);

  readonly category = this._category.asReadonly();
  readonly sort = this._sort.asReadonly();
  readonly page = this._page.asReadonly();

  readonly activeFiltersCount = computed(() =>
    [this._category()].filter(Boolean).length
  );

  setCategory(category: string | null): void { this._category.set(category); this._page.set(1); }
  setSort(sort: 'newest' | 'price_asc' | 'price_desc'): void { this._sort.set(sort); }
  setPage(page: number): void { this._page.set(page); }
  reset(): void { this._category.set(null); this._sort.set('newest'); this._page.set(1); }
}
```

### View — Component Is Dumb
```typescript
// shared/components/filtering/lg-filter-bar/lg-filter-bar.component.ts
@Component({
  standalone: true,
  selector: 'lg-filter-bar',
  templateUrl: './lg-filter-bar.component.html',
  styleUrl: './lg-filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LgFilterBarComponent {
  // Inputs from parent
  categories = input.required<string[]>();
  sortOptions = input<SortOption[]>([]);
  productCount = input<number>(0);

  // Outputs to parent
  categoryChange = output<string | null>();
  sortChange = output<string>();

  // Inject ViewModel only if this component needs state
  protected readonly filterState = inject(FilterStateService);
}
```

---

## STEP 5 — Shared Component @Input Design Rules

Every shared component must be designed for reuse via well-typed inputs:

```typescript
// lg-product-card — handles ALL 5 states via inputs
@Component({ selector: 'lg-product-card', ... })
export class LgProductCardComponent {
  product = input.required<Product>();
  variant = input<'default' | 'featured' | 'compact'>('default');

  // Computed states from product data — never passed as separate inputs
  protected readonly isNew = computed(() => this.product().isNew);
  protected readonly isDiscounted = computed(() => !!this.product().discountPercent);
  protected readonly isOutOfStock = computed(() => this.product().isOutOfStock);
}

// lg-badge — all badge variants via single input
@Component({ selector: 'lg-badge', ... })
export class LgBadgeComponent {
  variant = input.required<'new' | 'discount' | 'out-of-stock'>();
  label = input<string>();  // optional override
}

// lg-pagination — fully controlled via inputs
@Component({ selector: 'lg-pagination', ... })
export class LgPaginationComponent {
  total = input.required<number>();
  page = input.required<number>();
  pageSize = input<number>(12);
  pageChange = output<number>();

  protected readonly pages = computed(() =>
    Math.ceil(this.total() / this.pageSize())
  );
}

// lg-breadcrumb — accepts items array
@Component({ selector: 'lg-breadcrumb', ... })
export class LgBreadcrumbComponent {
  items = input.required<BreadcrumbItem[]>();
}

// lg-section-header — used on every page
@Component({ selector: 'lg-section-header', ... })
export class LgSectionHeaderComponent {
  eyebrow = input<string>();
  heading = input.required<string>();
  subtext = input<string>();
  align = input<'left' | 'center'>('center');
}

// lg-order-summary — used in cart, wishlist, checkout
@Component({ selector: 'lg-order-summary', ... })
export class LgOrderSummaryComponent {
  items = input.required<CartItem[]>();
  ctaLabel = input<string>('Proceed to Checkout');
  ctaClick = output<void>();
}
```

---

## STEP 6 — SOLID Principles

### S — Single Responsibility
```typescript
// ✅ One service, one job
@Injectable({ providedIn: 'root' })
export class CartService { /* cart state + operations only */ }

@Injectable({ providedIn: 'root' })
export class WishlistService { /* wishlist state only */ }

@Injectable({ providedIn: 'root' })
export class ToastService { /* toast notifications only */ }

@Injectable({ providedIn: 'root' })
export class ProductService { /* product API calls only */ }
```

### O — Open/Closed
```typescript
// ✅ New product card variant = new CSS class, not editing component logic
// ✅ New badge type = new variant value, not new component
// ✅ New filter type = new FilterStrategy class, not editing FilterStateService
```

### I — Interface Segregation
```typescript
// ✅ Small focused interfaces
export interface Priceable { price: number; originalPrice?: number; }
export interface Imageable { images: string[]; }
export interface Badgeable { isNew: boolean; isOutOfStock: boolean; discountPercent?: number; }

export interface Product extends Priceable, Imageable, Badgeable {
  id: number;
  name: string;
  category: string;
}
```

### D — Dependency Inversion
```typescript
// ✅ Components depend on service abstractions
export abstract class ProductRepository {
  abstract getAll(filters: FilterState): Observable<Product[]>;
  abstract getById(id: number): Observable<Product>;
}

@Injectable({ providedIn: 'root' })
export class HttpProductRepository extends ProductRepository { ... }
```

---

## STEP 7 — Angular Signals Rules

```typescript
// ✅ Signals for all reactive state
private readonly _products = signal<Product[]>([]);

// ✅ computed() for derived state
readonly featuredProducts = computed(() =>
  this._products().filter(p => p.isFeatured).slice(0, 6)
);

// ✅ input() for component inputs (Angular 17+)
product = input.required<Product>();

// ✅ output() for component events (Angular 17+)
addToCart = output<Product>();

// ✅ toSignal() for HTTP observables
readonly products = toSignal(
  this.productService.getAll(this.filterState()),
  { initialValue: [] }
);

// ❌ Never BehaviorSubject when signal works
// ❌ Never async pipe when signal available
// ❌ Never subscribe() in components
```

---

## STEP 8 — Component Rules

```typescript
// ✅ Always standalone
@Component({ standalone: true })

// ✅ Always OnPush
changeDetection: ChangeDetectionStrategy.OnPush

// ✅ Use inject() not constructor injection
private readonly productService = inject(ProductService);

// ✅ Prefix selector with 'lg-'
selector: 'lg-product-card'

// ✅ Separate files always
templateUrl: './lg-product-card.component.html',
styleUrl: './lg-product-card.component.scss',

// ❌ Never ngModel — use ReactiveFormsModule
// ❌ Never any type
// ❌ Never console.log in committed code
// ❌ Never inline styles
```

---

## STEP 9 — Tailwind v4 + Design Tokens Rules

```scss
// ✅ Use design tokens from CLAUDE.md
// bg-[#F9F1E7]  → cream background
// text-[#B88E2F] → gold accent
// border-[#E8E8E8] → subtle border

// ✅ Spacing — stick to Tailwind scale
// py-20 = 80px section padding
// gap-8 = 32px grid gap

// ✅ Mobile first
// Default = mobile, md: = tablet, lg: = desktop

// ❌ Never inline styles
// ❌ Never arbitrary values like w-[347px] unless absolutely necessary
// ❌ Never override Tailwind with custom CSS unless no utility exists
```

---

## STEP 10 — Self-Check Before Declaring Done

```
Design Analysis:
□ MCP design was read before planning
□ Component identification matrix was applied
□ Shared vs feature vs page buckets defined
□ Component plan presented and confirmed by user
□ Build order follows: shared primitives → shared commerce → features → pages

Architecture:
□ Every file in correct folder per structure
□ No business logic in components
□ No HttpClient in components
□ No state signals in components
□ All computed values in services

Shared Components:
□ Reusable components use input() and output()
□ Variants handled via @Input not separate components
□ No hardcoded content in shared components

Code Quality:
□ All signals exposed as readonly from services
□ All components standalone + OnPush
□ All selectors prefixed with lg-
□ No any types
□ No console.log
□ Shared components used where applicable

SOLID:
□ Each service has single clear responsibility
□ New features added without editing existing code
□ Interfaces are small and focused
□ Dependencies injected via abstractions
```

---

## Lugar-Specific Context

**Project:** Lugar Furniture — lugarstore.net
**Stack:** Angular latest + Signals + Tailwind CSS v4 + GSAP + Standalone components
**Prefix:** `lg-` (not `pf-`)
**Pattern:** MVVM — Services are ViewModels, Components are Views
**State:** Angular Signals only
**Design Source:** Stitch (Google) — connect via Stitch MCP before building
**Backend:** PHP APIs (existing, being refactored)
**Markets:** Egypt + Gulf (KSA, UAE)
**Currency:** EGP

**Key Shared Components to Always Check First:**
- `lg-product-card` — used on Home, PLP, PDP, Hot Deals, Quick View
- `lg-filter-bar` — used on PLP and Hot Deals
- `lg-pagination` — used on PLP and Hot Deals
- `lg-order-summary` — used on Cart, Wishlist, Checkout
- `lg-breadcrumb` — used on PLP, PDP, Cart, Checkout
- `lg-section-header` — used on every single page
- `lg-toast` — global, lives in core
- `lg-trust-strip` — used on Home and PDP
