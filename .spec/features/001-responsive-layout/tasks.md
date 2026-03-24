# Tasks: 001-responsive-layout
> Project Type: 
> Status: Not Started
> Date: 2026-03-24

---

## Legend

- `[P]` — Parallel safe within same phase
- `[DONE]` — Completed
- `⚠️ VIOLATION` — Breaks constitution (do not implement)

---

## Tasks

T01 | Add .section-content + .section-padding global utilities to styles.scss | src/styles.scss | none | no | Global utility classes defined once and usable by all components
T02 | lg-navbar responsive: mobile hamburger (inline SVG) + centered logo + cart/wishlist icons left of hamburger; hide desktop nav on mobile; reduce font + padding on tablet | src/app/shared/components/navigation/lg-navbar/lg-navbar.component.html + .scss | T01 | no | Mobile layout renders correctly at 375px and 390px; hamburger triggers drawer; desktop links hidden below md:
T03 | lg-footer responsive: single column on mobile (40px gap/padding); 2x2 grid on tablet | src/app/shared/components/layout/lg-footer/lg-footer.component.html + .scss | T01 | no | No overflow; 4 cols stack on mobile; 2x2 at md:; full grid at lg:
T04 | lg-filter-bar responsive: pills horizontal scroll hidden scrollbar on mobile; full-width sort below pills; reduce padding on tablet | src/app/shared/components/filtering/lg-filter-bar/lg-filter-bar.component.html + .scss | T01 | no | No overflow on 375px; sort stacks below pills on mobile; desktop layout preserved at lg:
T05 | lg-pagination responsive: mobile shows ‹ current/total › only; hide page numbers below md: | src/app/shared/components/filtering/lg-pagination/lg-pagination.component.html + .scss | none | no | Page numbers hidden on mobile; ‹ 5 / 37 › format visible; full pagination at md:+
T06 | lg-product-card responsive: 12px padding on mobile; clamped product name font size | src/app/shared/components/product/lg-product-card/lg-product-card.component.scss | none | no | Card renders at 12px padding on mobile; name does not overflow
T07 | lg-trust-strip responsive: 2x2 CSS grid on mobile; remove vertical gold dividers; add horizontal dividers between rows | src/app/shared/components/commerce/lg-trust-strip/lg-trust-strip.component.html + .scss | T01 | no | 4 items in 2x2 grid at 375px; dividers correct
T08 | lg-hero responsive: single column stacked on mobile (image 50vh top, text below); floating card hidden below lg:; reduce text on tablet | src/app/features/home/components/lg-hero/lg-hero.component.html + .scss | T01 | no | No floating card at 768px; stacked at 375px; two-column at lg:
T09 | lg-categories-section responsive: single column on mobile (image full-width top, text below, no zigzag); zigzag preserved at md:+ with reduced image height | src/app/features/home/components/lg-categories-section/lg-categories-section.component.html + .scss | T01 | no | Zigzag gone on mobile; stacked single col; zigzag restored at md:
T10 | lg-promo-banner responsive: image 40vh top, text below on mobile | src/app/features/home/components/lg-promo-banner/lg-promo-banner.component.html + .scss | T01 | no | Banner stacks on mobile; carousel still functions
T11 | lg-featured-collection responsive: single column all same size on mobile; bento 55/45 on tablet | src/app/features/home/components/lg-featured-collection/lg-featured-collection.component.html + .scss | T01 | no | Bento gone on mobile; uniform cards; bento at md: with 55/45
T12 | lg-room-slider responsive: single column (image top, text below) on mobile | src/app/features/home/components/lg-room-slider/lg-room-slider.component.html + .scss | T01 | no | Text panel below image on mobile; side-by-side at lg:
T13 | lg-atelier-section responsive: single column image top text below on mobile | src/app/features/home/components/lg-atelier-section/lg-atelier-section.component.html + .scss | T01 | no | Stacked on mobile; two-column at lg:
T14 | lg-plp-header responsive: heading clamp(40px,8vw,120px); reduced padding on mobile | src/app/features/products/components/lg-plp-header/lg-plp-header.component.html + .scss | T01 | no | Heading scales fluidly; no overflow at 375px
T15 | lg-products-page responsive: bento and standard grid → single col on mobile; standard grid → 2 cols on tablet | src/app/features/products/pages/lg-products-page/lg-products-page.component.html + .scss | T04 T05 T06 | no | Single col at 375px; 2-col at 768px; bento+3-col at lg:
T16 | lg-product-detail-page above fold responsive: single column on mobile (gallery top, info below); 55/45 at tablet+ | src/app/features/product-detail/pages/lg-product-detail-page/lg-product-detail-page.component.html + .scss | T01 | no | Stacked at 375px; split at md:
T17 | lg-image-gallery responsive: thumbnails horizontal scroll row on mobile instead of 4-col grid | src/app/features/product-detail/components/lg-image-gallery/lg-image-gallery.component.html + .scss | none | no | Thumbnails scroll horizontally on mobile; 4-col grid at md:+
T18 | lg-scrollytelling responsive: craft section single column (image top, text below) on mobile; related products single col mobile, 2 cols tablet | src/app/features/product-detail/components/lg-scrollytelling/lg-scrollytelling.component.html + .scss | T01 | no | Stacked at 375px; side-by-side at lg:; related products 1-col mobile 2-col tablet

---

## VIOLATION Alerts

None detected — all changes are CSS/template; no constitution violations

---

## Progress Tracker

| Task | Status |
|---|---|

