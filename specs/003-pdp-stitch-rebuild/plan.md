# Implementation Plan: Product Detail Page — Pixel-Perfect Stitch Rebuild

**Branch**: `003-pdp-stitch-rebuild` | **Date**: 2026-03-24 | **Spec**: [spec.md](spec.md)

---

## Summary

Pixel-perfect rebuild of the existing PDP using exact Stitch MCP design tokens (screen `6ef3ffb4cfd84747bba4a16d4d56455d`). The existing `PdpStateService` and three sub-components (`lg-image-gallery`, `lg-product-info`, `lg-scrollytelling`) are already in place — this plan refactors each one to: (1) add `_cancel$` Subject to the service for safe HTTP cancellation, (2) apply all Stitch measurements to SCSS, (3) switch the page component to `toSignal(route.paramMap)` + `effect()` for route param detection, and (4) restore the lifestyle section to `h-screen` with a real `<img>` tag (matching Stitch) rather than CSS `background-image`.

---

## Technical Context

**Language/Version**: TypeScript 5.x / Angular 21 (zoneless, standalone)
**Primary Dependencies**: Angular 21 Signals + Router + SSR, RxJS (switchMap, Subject, takeUntil), GSAP + ScrollTrigger
**Storage**: `StorageService` → `CartService` + `WishlistService` (localStorage); no direct access
**Testing**: Not requested
**Target Platform**: Static SPA — Hostinger shared hosting via `ng build --output-mode static`
**Project Type**: Web application — feature refactor (1 page + 3 components + 1 service)
**Performance Goals**: Above-fold visible within 3 seconds; product data update on navigation within 2 seconds
**Constraints**: Zero TypeScript/template errors; zero build warnings; all SCSS values traceable to Stitch measurements; zero SSR errors
**Scale/Scope**: 1 routed page, 3 sub-components, 1 state service, ~25 SCSS token values reconciled

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component Architecture | ✅ PASS | All components: standalone + OnPush + `lg-` prefix + `inject()`; all state in `PdpStateService` as readonly signals; no `HttpClient` in components |
| II. SSR Safety | ✅ PASS | GSAP inside `ngAfterViewInit` + `isPlatformBrowser`; `window.open` (WhatsApp) behind browser guard; Meta/Title set on every `loadProduct()` call; `/products/:id` uses `RenderMode.Client` (already configured) |
| III. Data Normalization | ✅ PASS | `PdpStateService` consumes `ProductService` which returns normalized `Product` objects; no raw API shapes reach components |
| IV. Design Fidelity | ✅ PASS | All SCSS values sourced from Stitch screen `6ef3ffb4cfd84747bba4a16d4d56455d`; warm palette only; no radius > 4px; no shadows; no gradients |
| V. YAGNI | ✅ PASS | Related card inline in scrollytelling — not a new shared component; no new abstractions; no feature flags |

**All gates pass. No complexity violations.**

---

## Project Structure

### Documentation (this feature)

```text
specs/003-pdp-stitch-rebuild/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/           ← Phase 1 output (component API contracts)
└── tasks.md             ← Phase 2 output (/speckit.tasks)
```

### Source Code (files touched by this feature)

```text
src/app/
├── features/
│   └── product-detail/
│       ├── services/
│       │   └── pdp-state.service.ts                     ← REFACTOR: add _cancel$ Subject + switchMap chain
│       ├── components/
│       │   ├── lg-image-gallery/
│       │   │   ├── lg-image-gallery.component.ts        ← VERIFY: inputs/outputs correct
│       │   │   ├── lg-image-gallery.component.html      ← REFACTOR: <img> tag, 4-col thumbs, zoom btn
│       │   │   └── lg-image-gallery.component.scss      ← REFACTOR: all Stitch tokens applied
│       │   ├── lg-product-info/
│       │   │   ├── lg-product-info.component.ts        ← VERIFY: inputs/outputs correct
│       │   │   ├── lg-product-info.component.html      ← REFACTOR: exact 9-element order, mat+dims block
│       │   │   └── lg-product-info.component.scss      ← REFACTOR: all Stitch tokens applied
│       │   └── lg-scrollytelling/
│       │       ├── lg-scrollytelling.component.ts      ← REFACTOR: categoryId input, GSAP browser-only
│       │       ├── lg-scrollytelling.component.html    ← REFACTOR: <img> lifestyle, inline related card
│       │       └── lg-scrollytelling.component.scss    ← REFACTOR: h-screen, 819px craft, Stitch tokens
│       ├── data/
│       │   └── category-lifestyle-images.ts            ← EXISTING: no changes
│       └── pages/
│           └── lg-product-detail-page/
│               ├── lg-product-detail-page.component.ts ← REFACTOR: toSignal+effect, thin orchestration
│               ├── lg-product-detail-page.component.html ← VERIFY: correct bindings
│               └── lg-product-detail-page.component.scss ← REFACTOR: 55/45 grid, 921px min-height, 96px pt
├── app.routes.ts                                        ← EXISTING: /products/:id already correct
└── app.routes.server.ts                                 ← EXISTING: RenderMode.Client already correct
```

**Structure Decision**: All new code lives inside the existing `features/product-detail/` tree. No new shared components. No new routes. The `category-lifestyle-images.ts` data file is unchanged.

---

## Complexity Tracking

> No constitution violations detected. Table intentionally empty.
