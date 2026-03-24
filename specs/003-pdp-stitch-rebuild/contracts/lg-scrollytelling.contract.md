# Component Contract: `lg-scrollytelling`

**File**: `src/app/features/product-detail/components/lg-scrollytelling/lg-scrollytelling.component.ts`
**Selector**: `lg-scrollytelling`
**Role**: View — renders all below-fold editorial sections (lifestyle, craft, related products); GSAP animations in `ngAfterViewInit` (browser-only)

---

## Inputs

| Input | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `relatedProducts` | `Product[]` | ✅ Yes | — | Up to 3 related products from the same category. If empty, the related section is hidden entirely. |
| `categoryId` | `number` | No | `0` | Used to look up lifestyle + craft images via `getLifestyleImages(categoryId)`. Defaults to `0` which maps to `DEFAULT_LIFESTYLE_IMAGES`. |

## Outputs

| Output | Payload | Description |
|--------|---------|-------------|
| `addRelatedToCart` | `Product` | Emitted when a related product card's "add" action is triggered. Payload is the full product. (Note: current Stitch design does not show an explicit add-to-cart on related cards — output kept for extensibility.) |
| `addRelatedToWishlist` | `Product` | Emitted when a related product card's wishlist action is triggered. |

---

## Section Render Spec

### Section A — Lifestyle (FR-010)
- Height: `100vh`, position `relative`, overflow `hidden`
- Image: `<img>` tag, `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover`
- Image source: `getLifestyleImages(categoryId).lifestyle`
- Overlay: `position: absolute; inset: 0; background: rgba(28,25,21,0.2)`
- Text container: `position: relative; z-index: 10; padding: 0 96px; display: flex; flex-direction: column; justify-content: center; height: 100%; max-width: 896px`
- Quote: Cormorant Garamond 300, 96px, line-height 1, letter-spacing 0.1em, color `#ffffff`
- Glass panel: `background: rgba(255,255,255,0.1); backdrop-filter: blur(16px); padding: 32px; border-left: 1px solid rgba(255,255,255,0.3); max-width: 448px`

### Section B — Craft/Heritage (FR-010)
- Grid: `1fr 1fr`, min-height 819px
- Left: craft image from `getLifestyleImages(categoryId).craft`, `object-cover`, `filter: grayscale(30%)`
- Right: background `#ffffff`, padding 48px → 96px, flex column centered
- Stats: `"60+"` / `"15+"` / `"500+"` with labels "Hours Per Piece" / "Years of Craft" / "Bespoke Works"
- Stat values: Cormorant Garamond 300 30px `#B88E2F`

### Section C — Related Products (FR-011)
- Hidden entirely when `relatedProducts().length === 0`
- Background `#F9F1E7`, padding 96px vertical / 48px horizontal
- Header: overline "THE ENSE" + heading "You Might Also Like" (left) + "Explore Collection →" RouterLink to `/products` (right)
- Grid: `repeat(3, 1fr)`, gap 32px
- **Inline card** (NOT `lg-product-card`):
  - Background `#ffffff`, padding 24px, border-radius 2px
  - Image: `aspect-ratio: 3/4`, hover scale 1.1 (700ms)
  - Info row: product name (Cormorant Garamond 300 24px) + price (Cormorant Garamond 300 18px `#7a5900`) flex space-between
  - Category label: Montserrat 300 10px `#a8a29e`
  - Click: `[routerLink]="['/products', card.id]"`
  - Hover box-shadow: `0 25px 50px -12px rgba(28,25,21,0.05)`

---

## Animation

- GSAP + ScrollTrigger loaded lazily via dynamic `import()` inside `ngAfterViewInit`
- Guarded with `isPlatformBrowser(platformId)` — no animation during SSR
- Selectors animated: `.scrolly__lifestyle`, `.scrolly__craft`, `.scrolly__related`
- Animation: `opacity: 0 → 1`, `y: 40 → 0`, duration 0.9s, ease `power2.out`, `start: 'top 85%'`

---

## Constraints

- Must NOT import or render `LgProductCardComponent` for related cards (FR-022)
- Related card markup must be inline within this component's template
- `categoryId` uses optional input with default `0` (not `input.required`) — prevents `Symbol(SIGNAL)` TypeError during initialization
- GSAP must not be called outside `ngAfterViewInit + isPlatformBrowser` guard

---

## Usage Example

```html
<lg-scrollytelling
  [relatedProducts]="pdpState.relatedProducts()"
  [categoryId]="pdpState.product()?.categoryId ?? 0"
  (addRelatedToCart)="onRelatedAddToCart($event)"
  (addRelatedToWishlist)="onRelatedAddToWishlist($event)"
/>
```
