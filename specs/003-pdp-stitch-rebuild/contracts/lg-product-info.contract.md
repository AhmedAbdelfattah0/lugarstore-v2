# Component Contract: `lg-product-info`

**File**: `src/app/features/product-detail/components/lg-product-info/lg-product-info.component.ts`
**Selector**: `lg-product-info`
**Role**: View — renders all product information and purchase controls; emits all user actions to parent

---

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `product` | `Product` | ✅ Yes | Full normalized product object. Used for all displayed data. |
| `qty` | `number` | ✅ Yes | Currently selected purchase quantity. Drives the stepper display. |
| `isWishlisted` | `boolean` | ✅ Yes | Whether the current product is in the user's wishlist. Controls the wishlist link label/state. |

## Outputs

| Output | Payload | Description |
|--------|---------|-------------|
| `qtyChange` | `number` | Emitted when the quantity stepper changes value. Payload is the new quantity. |
| `addToCart` | `void` | Emitted when "ADD TO CART" is clicked (and product is not out of stock). |
| `wishlistToggle` | `void` | Emitted when "Add to Wishlist" link is clicked. |
| `whatsappEnquire` | `void` | Emitted when the WhatsApp enquiry link is clicked. |
| `commissionCustom` | `void` | Emitted when "Commission a Custom Version" link is clicked. |

---

## Element Render Order (FR-005)

1. **Breadcrumb** — Montserrat 300 10px, letter-spacing 0.15em, `#78716c`, margin-bottom 32px
2. **Product title** `<h1>` — Cormorant Garamond 300 72px, line-height 1.2, letter-spacing 0.1em, `#1e1b15`, margin-bottom 16px
3. **Star rating + review count** — stars `#B88E2F`; count Montserrat 300 10px `#78716c`, margin-bottom 24px
4. **Price** — Cormorant Garamond 300 30px `#B88E2F`, margin-bottom 32px; discount variant: discounted price large + original 14px strikethrough `#78716c`
5. **Description** — Inter 300 14px, line-height 1.7, `#57534e`, margin-bottom 40px
6. **Materials + Dimensions block** — 2-col grid, top+bottom border `1px solid rgba(210,197,177,0.3)`, 32px vertical padding, margin-bottom 48px
7. **Quantity stepper + ADD TO CART row** — flex, gap 24px; CTA disabled when `product.isOutOfStock`
8. **Add to Wishlist + Commission links** — flex column, center-aligned, padding-top 16px, gap 16px
9. **Trust row** — 3-col grid, icons `#a8a29e`, labels Montserrat 300 8px `#78716c`; items: Free Delivery / 2-Year Warranty / Easy Returns

---

## Constraints

- No service injections — pure view component
- No internal state signals
- Material field: `product.badge ?? 'Premium Egyptian Linen'`
- Dimensions field: `product.subtitle ?? '240W × 105D × 75H cm'`
- ADD TO CART button must be `[disabled]="product.isOutOfStock"` — non-interactive when out of stock
- Panel background: `#F9F1E7`, padding 32px → 64px

---

## Usage Example

```html
<lg-product-info
  [product]="pdpState.product()!"
  [qty]="pdpState.qty()"
  [isWishlisted]="isWishlisted(pdpState.product()!.id)"
  (qtyChange)="pdpState.setQty($event)"
  (addToCart)="onAddToCart()"
  (wishlistToggle)="onWishlistToggle()"
  (whatsappEnquire)="onWhatsappEnquire()"
  (commissionCustom)="onCommissionCustom()"
/>
```
