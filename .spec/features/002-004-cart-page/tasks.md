# Tasks: 002-004-cart-page
> Project Type: 
> Status: Not Started
> Date: 2026-03-25

---

## Legend

- `[P]` — Parallel safe within same phase
- `[DONE]` — Completed
- `⚠️ VIOLATION` — Breaks constitution (do not implement)

---

## Tasks

T01|Rebuild lg-cart-page TypeScript class|src/app/features/cart/pages/lg-cart-page/lg-cart-page.component.ts|none|no|Standalone OnPush; inject CartService + Router + Meta + Title; expose items/count signals; onQtyChange(id,qty) calls CartService.updateQty(); onRemove(id) calls CartService.remove(); onCheckout() calls Router.navigate(['/checkout']); onContinueShopping() calls Router.navigate(['/products']); sets meta title 'Shopping Bag — Lugar Furniture' in constructor; SSR-safe (no browser APIs needed)
T02|Build lg-cart-page HTML template — with-items state|src/app/features/cart/pages/lg-cart-page/lg-cart-page.component.html|T01|no|@if(items().length > 0) two-column layout: left panel (heading + table + continue link) / right panel (lg-order-summary); column headers row with Product/Price/Quantity/Subtotal labels; @for item rows with img thumbnail, name, category, price via lgCurrencyEgp, lg-quantity-stepper, subtotal, trash button; lg-order-summary [items] [ctaLabel] (ctaClick)
T03|Build lg-cart-page HTML template — empty state|src/app/features/cart/pages/lg-cart-page/lg-cart-page.component.html|T02|no|@else block: full-page centred lg-empty-state with icon=shopping-bag, title='Your bag is empty', message='Every masterpiece begins with a single selection. Start curating your space with our latest collections.', ctaLabel='Explore Collections', (ctaClick)=onContinueShopping()
T04|Write lg-cart-page SCSS — desktop layout|src/app/features/cart/pages/lg-cart-page/lg-cart-page.component.scss|T03|no|:host display:block; .cart-page section padding; .cart-layout display:grid 65fr 35fr gap-8 align-start; .cart-left full-width; .cart-right sticky top-24 white card border #E8E8E8; heading Cormorant Garamond font-size 2.5rem font-weight 300 color #1e1b15 mb-8; col-headers Montserrat uppercase tracking-wider text-xs color #4e4637 border-bottom 1px #d2c5b1 pb-4
T05|Write lg-cart-page SCSS — item rows|src/app/features/cart/pages/lg-cart-page/lg-cart-page.component.scss|T04|no|.cart-item display:grid 4-col (2fr 1fr 1fr 1fr) align-center gap-4 py-6 border-bottom 1px #E8E8E8; .cart-item__thumb 70x70 object-cover; .cart-item__name Inter font-size 0.9375rem font-weight 500 color #1e1b15; .cart-item__category Inter font-size 0.75rem color #4e4637 mt-1; .cart-item__price Inter font-weight 600 color #1e1b15; .cart-item__subtotal Inter font-weight 600 color #1e1b15; .cart-item__remove button no border bg transparent cursor-pointer color #4e4637 hover color #ba1a1a
T06|Write lg-cart-page SCSS — mobile layout|src/app/features/cart/pages/lg-cart-page/lg-cart-page.component.scss|T05|no|max-width 767px: .cart-layout single column; .cart-right no sticky; hide col-headers; .cart-item grid 2-col (img+info / price-qty-subtotal stacked); mobile sticky checkout bar at bottom: fixed bottom-0 left-0 right-0 bg #fff8f1 border-top 1px #d2c5b1 p-4 z-50 with Proceed to Checkout button full-width

---

## VIOLATION Alerts

None

---

## Progress Tracker

| Task | Status |
|---|---|

