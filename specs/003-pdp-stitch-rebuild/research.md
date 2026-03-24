# Research: Product Detail Page — Pixel-Perfect Stitch Rebuild

**Branch**: `003-pdp-stitch-rebuild` | **Date**: 2026-03-24

---

## Decision 1: HTTP Cancellation in Root Service

**Decision**: Use a `Subject<void>` named `_cancel$` in `PdpStateService`. Emit it at the start of each `loadProduct()` call and pipe `takeUntil(this._cancel$)` on the HTTP chain. Replace the current two-subscription approach (separate `getProductById` + `loadRelated` subscriptions) with a single `switchMap` chain.

**Rationale**: The existing service has two independent `.subscribe()` calls. If `loadProduct()` is called again before both complete (rapid navigation via related products), both chains continue running simultaneously — the slower response can overwrite the newer product data. A `_cancel$` Subject emitted at the top of each call cancels the previous chain atomically before starting the new one.

**Alternatives considered**:
- `switchMap` at the call-site (component level): rejected — Angular-code-quality rule forbids RxJS subscriptions in components.
- Component-level provision with auto-destroy: rejected (clarification Q3) — root singleton with explicit reset is simpler and consistent with the codebase pattern.
- No cancellation (rely on natural completion): rejected — proven race condition on rapid navigation.

**Implementation pattern**:
```typescript
private readonly _cancel$ = new Subject<void>();

loadProduct(id: number): void {
  this._cancel$.next(); // cancel any in-flight request
  this._isLoading.set(true);
  this._error.set(null);
  this._product.set(null);
  this._relatedProducts.set([]);
  this._qty.set(1);
  this._selectedImageIdx.set(0);

  this.productService.getProductById(id).pipe(
    switchMap(product => {
      this._product.set(product);
      return this.productService.getProductsByCategory(product.categoryId);
    }),
    takeUntil(this._cancel$),
  ).subscribe({
    next: related => {
      this._relatedProducts.set(
        related.filter(p => p.id !== this._product()?.id).slice(0, 3)
      );
      this._isLoading.set(false);
    },
    error: () => {
      this._error.set('Failed to load product. Please try again.');
      this._isLoading.set(false);
    },
  });
}
```

---

## Decision 2: Route Param Change Detection

**Decision**: Use `toSignal(this.route.paramMap)` to convert the route's `paramMap` Observable into a signal, then `effect()` to watch it and call `pdpState.loadProduct(+id)` when it changes.

**Rationale**: This is the Angular 21 signals-first approach. It requires no `.subscribe()` call in the page component, no `takeUntil` cleanup boilerplate, and is consistent with the angular-code-quality skill mandate of signals over RxJS in components. Angular's `effect()` automatically re-runs when the signal value changes and is tied to the component's injection context (auto-cleaned up on component destroy).

**Alternatives considered**:
- `paramMap.subscribe()` with `takeUntil(destroy$)`: functional but introduces a manual subscription + cleanup in the component, violating the signals-preferred rule.
- `withComponentInputBinding()`: cleanest API but requires a router configuration change that isn't established in this project's `app.config.ts`.

**Implementation pattern**:
```typescript
private readonly route = inject(ActivatedRoute);
private readonly pdpState = inject(PdpStateService);
private readonly paramMap = toSignal(this.route.paramMap);

constructor() {
  effect(() => {
    const id = this.paramMap()?.get('id');
    if (id) this.pdpState.loadProduct(+id);
  });
}
```

---

## Decision 3: Lifestyle Section Image Approach

**Decision**: Use a real `<img>` tag positioned `absolute inset-0` with `object-fit: cover`, matching the Stitch HTML exactly. Revert from the CSS `background-image` approach used in the previous iteration.

**Rationale**: The Stitch design uses `<img class="absolute inset-0 w-full h-full object-cover">` inside `h-screen relative overflow-hidden`. The CSS `background-image` approach was introduced as a workaround for image quality concerns but deviates from the spec. Using a real `<img>` tag is semantically correct, supports natural browser lazy-loading, and allows the `alt` attribute for accessibility. The `background-size: cover` approach had layout inconsistencies with the overlay and text positioning.

**Image source**: `getLifestyleImages(categoryId).lifestyle` from `category-lifestyle-images.ts` — unchanged. Image path is used as the `src` attribute.

**Alternatives considered**:
- CSS `background-image` via `[style.background-image]`: discarded — deviates from Stitch spec and caused positioning issues.
- First product image (`product.images[0]`): discarded — the lifestyle section uses curated room photography, not product photography.

---

## Decision 4: Related Product Card Implementation

**Decision**: Inline custom card markup inside `lg-scrollytelling` — not a new component, not reusing `lg-product-card`.

**Rationale** (clarification Q5): The editorial card has a structurally different layout from the commerce card: `aspect-ratio: 3/4` (vs commerce card's varying ratio), name + category stacked left with price right (vs commerce card's overlay bar), no quick-add, no wishlist heart. Creating a new shared component for a single use-case violates YAGNI (Constitution Principle V). Inline markup keeps `lg-scrollytelling` self-contained.

**Alternatives considered**:
- `lg-product-card` with `variant="editorial"` input: rejected — forces the shared component to handle concerns it doesn't own, increasing coupling.
- New `lg-related-card` component: rejected — single use-case, overkill per YAGNI.

---

## Decision 5: Lifestyle Section Text Layout

**Decision**: Text container is `position: relative; z-index: 10; padding: 0 96px; display: flex; flex-direction: column; justify-content: center; height: 100%; max-width: 896px`. The text is vertically centered via `flex + justify-content: center` on a full-height container — not bottom-positioned.

**Rationale**: Stitch uses `flex items-center` on the section with `relative z-10 px-12 md:px-24 max-w-4xl` on the text container, producing a left-aligned, vertically centered layout. The previous iteration used `position: absolute; bottom: 80px` for the text, which was explicitly identified as a deviation in the spec review.

---

## Decision 6: Stitch Token Verification Summary

All values below are taken directly from the fetched Stitch HTML source (screen `6ef3ffb4cfd84747bba4a16d4d56455d`) and confirmed:

| Token | Stitch Value | Applied To |
|-------|-------------|-----------|
| Above-fold grid | `grid-cols-[55%_45%]` | `pdp__split` |
| Above-fold min-height | `min-h-[921px]` | `pdp__split` |
| Gallery bg + padding | `#faf2e8`, `p-8` (32px) | `.gallery` |
| Main image ratio | `aspect-[4/5]` | `.gallery__main` |
| Thumb grid | `grid-cols-4 gap-4` (16px) | `.gallery__thumbs` |
| Active thumb | `border border-primary/20` = `1px solid rgba(122,89,0,0.2)` | `.gallery__thumb--active` |
| Panel bg + padding | `#F9F1E7`, `p-8 md:p-16` (32→64px) | `pdp__panel` |
| Product title | `text-7xl` (72px), Cormorant 300, `leading-tight`, `tracking-editorial` (0.1em) | `.info__title` |
| Price | `text-3xl` (30px), Cormorant 300, `#B88E2F` | `.info__price` |
| Description | Inter 300, `leading-[1.7]`, `#57534e`, `max-w-md` | `.info__description` |
| ADD TO CART btn | `#B88E2F` bg, 11px Montserrat, `py-5` (20px), `tracking-label` | `.info__cta` |
| Trust row | `grid-cols-3 gap-4`, icons `#a8a29e`, labels 8px | `.info__trust` |
| Lifestyle section | `h-screen` (100vh), `<img>` tag, `bg-stone-900/20` overlay | `.scrolly__lifestyle` |
| Quote | `text-8xl` (96px), Cormorant 300, `leading-none`, `0.1em` | `.scrolly__lifestyle-quote` |
| Glass panel | `bg-white/10 backdrop-blur-lg p-8 border-l border-white/30 max-w-md` | `.scrolly__lifestyle-glass` |
| Craft section | `grid-cols-2 min-h-[819px]` | `.scrolly__craft` |
| Craft image | `grayscale-[30%]`, object-cover | `.scrolly__craft-image` |
| Craft info padding | `p-12 md:p-24` (48→96px), `bg-white` | `.scrolly__craft-info` |
| Stat value | `text-3xl` (30px), Cormorant 300, `#B88E2F` | `.scrolly__craft-stat-value` |
| Related section | `bg-[#F9F1E7] py-24 px-8 md:px-12` (96px / 32→48px) | `.scrolly__related` |
| Related heading | `text-5xl` (48px), Cormorant 300, `tracking-editorial` | `.scrolly__related-title` |
| Related grid | `grid-cols-3 gap-8` (32px) | `.scrolly__related-grid` |
| Card padding | `p-6` (24px), `bg-white` | `.scrolly__related-card` |
| Card image ratio | `aspect-[3/4]` | `.scrolly__related-card-img` |
