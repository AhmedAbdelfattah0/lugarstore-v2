# Feature Spec: responsive-layout
> Feature: 001-responsive-layout
> Status: Draft
> Date: 2026-03-24

---

## Overview

The entire Lugar Store site currently has no responsive layout. Every page and shared component must be made to work correctly on mobile (< 768px), tablet (768–1024px), and desktop (> 1024px) using Tailwind v4 responsive prefixes (md: and lg:). This covers 18 components spanning shared components, the homepage, PLP, and PDP. The goal is pixel-accurate mobile layouts with no horizontal scroll, tappable touch targets, readable typography, and a clean production build.

---

## User Stories

As a mobile shopper I want the navbar to show a hamburger menu so that I can navigate without a cramped desktop link bar | As a mobile shopper I want product grids to stack in a single column so that I can browse comfortably on a small screen | As a tablet shopper I want two-column product grids and a zigzag category section so that I get a richer layout than mobile | As a mobile shopper I want the PDP image gallery to show thumbnails in a horizontal scroll row so that I can swipe through photos easily | As a mobile shopper I want all section paddings and headings to scale fluidly with the viewport so that nothing is clipped or overflows

---

## Functional Requirements

SHARED: lg-navbar — mobile: logo centered, cart+wishlist left of hamburger, desktop nav hidden; tablet: smaller font + reduced padding | lg-footer — mobile: single column, 40px gap, 40px padding; tablet: 2x2 grid | lg-filter-bar — mobile: pills horizontal scroll (hidden scrollbar) + full-width sort below; tablet: same as desktop reduced padding | lg-pagination — mobile: prev / current-of-total / next only, hide page numbers | lg-product-card — mobile: 12px padding, clamped font size | HOMEPAGE: lg-hero — mobile: single column stacked (image 50vh top, text below, floating card hidden); tablet: two cols reduced text | lg-categories-section — mobile: single column (image full-width top, text below, no zigzag); tablet: zigzag reduced image height | lg-promo-banner — mobile: image 40vh top, text below | lg-featured-collection — mobile: single column stack all cards same size; tablet: bento 55/45 | lg-room-slider — mobile: single column (image top, text panel below) | lg-atelier-section — mobile: single column image top text below | lg-trust-strip — mobile: 2x2 grid, no vertical gold dividers, horizontal dividers between rows | PLP: lg-plp-header — mobile: heading clamp(40px,8vw,120px), reduced padding | product grid — mobile: single column; tablet: 2 columns | PDP: above-fold — mobile: single column stacked (gallery full width top, info below); tablet: 55/45 | lg-image-gallery — mobile: thumbnails horizontal scroll row | lg-scrollytelling craft section — mobile: single column (image top, text below) | related products — mobile: single column; tablet: 2 columns | GLOBAL: every section wrapper uses max-width 1280px + padding clamp(20px,5vw,60px); section vertical padding clamp(40px,8vw,80px) 0

---

## Out of Scope

Arabic RTL layout | New pages not yet built (cart, wishlist, checkout, custom-order, atelier, contact) | Backend or API changes | Any new feature or component not in the current build | Animations or GSAP changes beyond what is needed for responsive layout

---

## Open Questions

Should the hamburger icon be a custom SVG or a Tailwind icon (e.g. Heroicons)? | Does the floating product card on lg-hero reappear at tablet or only at desktop? | For lg-pagination mobile, should the format be arrow icon or text chevron? | Is the 2x2 trust strip on mobile a CSS grid change or a flex-wrap change? | Should section wrapper padding changes be applied globally via a shared utility class or inline per component?

---

## Success Metrics

- [ ] All acceptance criteria in user stories pass
- [ ] Feature works in all markets defined in constitution
