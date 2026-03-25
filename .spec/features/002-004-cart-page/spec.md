# Feature Spec: 004-cart-page
> Feature: 002-004-cart-page
> Status: Draft
> Date: 2026-03-25

---

## Overview

A full-page shopping bag experience where customers review selected items, adjust quantities, remove items, and proceed to checkout. Desktop: 65/35 two-column split (items left, order summary right). Mobile: single column. Empty state shown when bag is empty. All data from CartService signals — no API calls needed.

---

## User Stories

As a shopper, I want to see all items in my bag so I can review my selection before buying|As a shopper, I want to change item quantities so I can adjust how many pieces I want|As a shopper, I want to remove an item from my bag so I can refine my selection|As a shopper, I want to see the running total so I know the cost before checkout|As a shopper, I want a clear path to checkout so I can complete my purchase quickly

---

## Functional Requirements

Page heading 'Your Shopping Bag' in Cormorant Garamond|Column headers: Product, Price, Quantity, Subtotal in Montserrat Light uppercase muted|Each item row: 70x70 thumbnail, product name, category, price, lg-quantity-stepper, subtotal, trash remove button|1px border #E8E8E8 separating rows|lg-quantity-stepper wired to CartService.updateQty()|Trash icon calls CartService.remove()|Subtotal per row = activePrice * qty (activePrice = hasDiscount ? discountedPrice : price; but CartItem.price is stored price)|Continue Shopping link to /products|Right panel: lg-order-summary with ctaClick → /checkout|Empty state: lg-empty-state with icon shopping-bag, title 'Your bag is empty', message from Stitch, ctaLabel 'Explore Collections' → /products|Meta title: Shopping Bag — Lugar Furniture|Desktop 65/35 grid, mobile single column|Mobile: sticky proceed-to-checkout button at bottom

---

## Out of Scope

Promo codes|Saved for later|Authentication / guest vs logged-in|Shipping cost calculation|Stock validation on cart page

---

## Open Questions

Should empty state show partial layout with heading or full-page centred state?|Is CartItem.price always the active (post-discount) price or always originalPrice?

---

## Success Metrics

- [ ] All acceptance criteria in user stories pass
- [ ] Feature works in all markets defined in constitution
