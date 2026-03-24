# Clarifications: 001-responsive-layout
> Status: Resolved
> Date: 2026-03-24

---

## Domain: API & Data

No API changes needed — all responsive work is pure CSS/template

---

## Domain: UX & Interactions

Hamburger: inline SVG 3 lines no library | Hero floating card: desktop only (lg: 1024px+) hidden on mobile and tablet | Pagination mobile: text chevrons ‹ and › | Trust strip mobile: CSS grid grid-template-columns 1fr 1fr | Section wrapper: shared global utility classes in styles.scss: .section-content {max-width:1280px;margin:0 auto;padding:0 clamp(20px,5vw,60px)} and .section-padding {padding:clamp(40px,8vw,80px) 0}

---

## Domain: State & Data Flow

No new signals needed — all responsive changes are layout/CSS only. Existing component signals remain unchanged.

---

## Domain: Performance & Constraints

Use clamp() for fluid typography and padding instead of discrete breakpoint jumps. Tailwind v4 md: and lg: prefixes for structural layout changes (grid-cols, flex direction, show/hide).

---

## Blocking Issues

- [ ] Review answers above before running /spec.plan
