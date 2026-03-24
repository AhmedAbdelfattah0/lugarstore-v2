# Lugar Store — Architectural Constitution
> Ratified: 2026-03-24

---

## Project Identity

| Field | Value |
|---|---|
| **Project Name** | Lugar Store |
| **Project Type** | personal |
| **UI Framework** | tailwind |
| **Selector Prefix** | `lg-` |
| **Markets** | Egypt + Gulf (EG/KSA/UAE, EN only) |
| **RTL** | no |
| **Angular Pattern** | MVVM — Services are ViewModels, Components are Views |
| **State Management** | Angular Signals only (no NgRx, no BehaviorSubject) |

---

## Principle I — Component Architecture

All components are:
- `standalone: true`
- `changeDetection: ChangeDetectionStrategy.OnPush`
- Prefixed with `lg-`
- Dumb (no business logic, no HttpClient, no state signals)
- Injecting ViewModel services via `inject()` only

Services own all state via private `signal<T>()` exposed as `.asReadonly()`.
Computed values live in services — never as component getters.

---

## Principle II — SOLID Enforcement

- **S**: Each service has exactly one responsibility
- **O**: New behavior via new classes/files — never editing stable working code
- **I**: Interfaces are small and composable (`Nameable`, `Codeable`, `Toggleable`)
- **D**: Services depend on abstractions — concrete implementations via DI

---

## Principle III — SSR Safety

All browser API access is guarded:
```typescript
import { isPlatformBrowser } from '@angular/common';
const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
if (isBrowser) { /* localStorage, window, document */ }
```

---

## Principle IV — Design Fidelity

Use Tailwind CSS v4 utility classes exclusively.
Follow project design tokens in `styles.scss` (primary, navy, accent, etc.).
No inline styles. No arbitrary values like `w-[347px]` without justification.
Spacing: stick to Tailwind scale (p-4, p-6, gap-4, gap-6). Responsive: mobile-first.

---

## Principle V — Data Normalization

API responses are normalized at the service boundary — never in components.
Repository services return typed models; they never expose raw API shapes.

---

## Principle VI — YAGNI

Build exactly what the spec requires.
No speculative abstractions. Add flexibility only when a second concrete use case exists.

---

## Principle VII — RTL Support

Single locale. RTL not required.

---

## Principle VIII — Performance

- Lazy-load all feature modules via Angular Router
- `trackBy` on all `@for` loops
- Heavy computations use `computed()` — not re-evaluated unless dependencies change
- No synchronous heavy operations in component lifecycle hooks

---

## Amendment Log

| Date | Change | Author |
|---|---|---|
| 2026-03-24 | Initial ratification | — |
