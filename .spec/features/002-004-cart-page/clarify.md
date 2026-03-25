# Clarifications: 002-004-cart-page
> Status: Resolved
> Date: 2026-03-25

---

## Domain: API & Data

No API calls — CartService.items() signal is the only data source; no HTTP needed

---

## Domain: UX & Interactions

Empty state: full-page centred (no column headers visible), matching Stitch frame cd02867358b14eea910c1a32bc7c7995; Desktop 65/35 CSS grid with minmax(0,65fr) and minmax(0,35fr); Mobile single column stack; sticky checkout button only on mobile (<768px) at bottom of viewport; 'Continue Shopping' link is left-aligned text link below items table

---

## Domain: State & Data Flow

CartItem.price is always the active (post-discount) price — set at add-to-cart time; row subtotal = item.price * item.qty; lg-order-summary receives CartService.items() directly; no separate CartStateService needed — page component injects CartService and Router directly

---

## Domain: Performance & Constraints

Zero API calls — pure localStorage reads via CartService; no loading states needed; OnPush throughout; signals-only reactive updates

---

## Blocking Issues

- [ ] Review answers above before running /spec.plan
