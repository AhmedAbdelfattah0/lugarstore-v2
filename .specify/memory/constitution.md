<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 1.0.1  (patch — hosting clarified; SSR rationale updated)
Last validation: 2026-03-23  (no version bump — validation-only pass)

Modified principles:
  - Principle II (SSR Safety): rationale updated to reflect build-time pre-rendering only,
    no live SSR server process.

Modified sections:
  - Tech Stack Constraints: hosting line replaced — Azure/Cloudflare TBD → Hostinger shared
    hosting with static-only build (ng build --output-mode static).

Added sections: N/A
Removed sections: N/A

Templates reviewed:
  - .specify/templates/plan-template.md         ✅ aligned
  - .specify/templates/spec-template.md         ✅ aligned
  - .specify/templates/tasks-template.md        ✅ aligned

Runtime guidance reviewed:
  - CLAUDE.md                                   ✅ cleaned (removed stale agent-script artifact:
    unfilled "Recent Changes" placeholder appended by update-agent-context.sh after
    001-fix-pagination-truncation implementation run)

Deferred TODOs: None.
-->

# Lugar Store Constitution

## Core Principles

### I. Component Architecture (NON-NEGOTIABLE)

Every UI piece MUST be an Angular standalone component with `ChangeDetectionStrategy.OnPush`.
All selectors MUST carry the `lg-` prefix. Components MUST contain zero business logic — no
HTTP calls, no state mutations, no raw API access. All state MUST live in services as Angular
signals; `BehaviorSubject` is prohibited. Dependencies MUST be injected via `inject()`, never
via constructor parameters.

**Rationale**: MVVM discipline keeps components thin and testable; OnPush eliminates unnecessary
re-renders in a luxury store where smooth scroll and animation performance are brand expectations.

### II. SSR Safety (NON-NEGOTIABLE)

All browser-only APIs (`localStorage`, `window`, `document`, `navigator`) MUST be accessed
exclusively through `StorageService` or behind an `isPlatformBrowser(this.platformId)` guard.
GSAP animations MUST be initialized inside `ngAfterViewInit` with an `isPlatformBrowser` guard.
Every routed page MUST set `<title>` and `<meta name="description">` + `og:image` tags via
Angular's `Title` and `Meta` services. `HttpClient` is the only HTTP mechanism; native `fetch()`
is prohibited.

**Rationale**: SEO is critical for the Egypt and Gulf markets; pre-rendered HTML with correct
meta tags is a hard launch requirement, not an optimization. Pre-rendering happens at build time
(`ng build --output-mode static`) — there is no live SSR server process at runtime. Every route
produces a static HTML file; the `isPlatformBrowser` guards ensure code that references browser
APIs is silently skipped during the build-time render pass.

### III. Data Normalization at the Service Boundary

Raw API shapes (`RawProduct`, etc.) MUST NEVER leave the service layer. Every HTTP response
MUST be normalized into the project's unified models (`Product`, `Category`, `Banner`, etc.)
before any signal or return value is exposed to components. String-to-number coercions, image
array construction, badge derivation from `subCategoryId`, and `hasDiscount` computation ALL
happen in the service. Components MUST consume only the unified model types defined in
`src/app/shared/models/`.

**Rationale**: The existing PHP API returns inconsistent types (string prices, string category
IDs). Centralizing normalization prevents silent type bugs from spreading across components and
makes the data contract explicit.

### IV. Design Fidelity (NON-NEGOTIABLE)

The visual output MUST conform to the Lugar design system at all times:

- **Palette**: Cream `#F9F1E7` as the dominant background; gold `#B88E2F` reserved for CTAs,
  prices, and accent borders only. No blue, teal, cyan, or cool-toned hues anywhere.
- **Typography**: Cormorant Garamond (headings, weight 300, never bold), Montserrat Light
  (labels, nav, buttons — uppercase + wide tracking), Inter Regular (body, line-height 1.7).
- **Shape language**: No border-radius above 4px. No box-shadows. No gradients.
- **Spacing**: Sections MUST have ≥ 80px vertical padding; hero ≥ 120px. Max-width 1280px
  centered. Grid gap 32px.

**Rationale**: Lugar is a luxury brand positioned against Article.com and Zara Home. Visual
drift from the approved design system directly undermines the brand's price-point credibility.

### V. Simplicity & YAGNI

No feature, abstraction, helper, or configuration layer MUST be built unless it is required by
the current task. Three lines of similar code are preferable to a premature abstraction. Error
handling and validation MUST only be added at true system boundaries (user input, external API
responses). Backwards-compatibility shims, feature flags, and unused re-exports MUST NOT be
introduced.

**Rationale**: The project has a single developer and a defined six-phase build order. Complexity
added ahead of schedule increases maintenance cost without delivering value.

## Tech Stack Constraints

- **Framework**: Angular 21, zoneless (`provideZonelessChangeDetection`), standalone components,
  Angular SSR (Universal). Upgrade paths are planned — do not use deprecated APIs.
- **Styling**: Tailwind CSS v4 with project design tokens defined in `src/styles.scss`. Custom
  SCSS is written using BEM naming; `::ng-deep` is acceptable for third-party component overrides
  only.
- **Animations**: GSAP (ScrollTrigger included). Always browser-only. No other animation
  libraries.
- **HTTP**: All requests through `core/interceptors/api.interceptor.ts` which prepends
  `environment.apiUrl`. Static `.json` asset requests bypass the interceptor.
- **Storage**: `StorageService` is the sole interface to `localStorage`. Keys are defined in
  `shared/models/cart.model.ts` (`STORAGE_KEYS` const).
- **Backend**: PHP 8.x APIs at `https://lugarstore.net/api`. APIs are consumed as-is for Phase
  1–6. No PHP files are modified under any circumstance.
- **Hosting**: Hostinger shared hosting. Build output MUST be fully static
  (`ng build --output-mode static`). No Node.js server process. SSR via pre-rendering only —
  no runtime server-side rendering.

## Design System & Brand Standards

The following rules apply to every component and page, without exception:

### Color Tokens
| Token | Value | Usage |
|---|---|---|
| `--color-bg-primary` | `#F9F1E7` | Dominant background |
| `--color-bg-secondary` | `#EDE4D8` | Alternate section fills |
| `--color-bg-dark` | `#1A1A18` | Footer + one CTA section only |
| `--color-surface` | `#FFFFFF` | Cards, modals, forms |
| `--color-text-dark` | `#333333` | Primary text |
| `--color-text-muted` | `#7A6F65` | Captions, labels |
| `--color-gold` | `#B88E2F` | Primary accent — use sparingly |
| `--color-gold-hover` | `#9A7A32` | Gold hover state |
| `--color-border` | `#E8E8E8` | Borders, dividers |
| `--color-error` | `#E97171` | Validation errors |

### Content & Copy Standards
- All public-facing prices display in EGP using the `lgCurrencyEgp` pipe (format: `EGP 2,500`).
- Product prices range EGP 23,000–70,000+; copy MUST reflect luxury positioning.
- WhatsApp is the primary conversion channel — CTAs MUST route to WhatsApp where applicable.
- Arabic RTL is planned for a future phase; do not hard-code LTR-only layout assumptions that
  cannot be refactored.

### SEO & Meta
Every routed page MUST include:
- A unique `<title>` in the pattern `{Page} — Lugar Furniture`
- `<meta name="description">` with page-specific content
- `<meta property="og:image">` pointing to a relevant product or lifestyle image

## Governance

This constitution supersedes all other ad-hoc conventions. When a task appears to conflict with
a principle, the principle wins unless a formal amendment is recorded here.

### Amendment Procedure
1. Identify the principle or section to change and document the motivation.
2. Increment the version: MAJOR for principle removals or breaking redefinitions; MINOR for new
   principles or materially expanded guidance; PATCH for clarifications or wording fixes.
3. Update `LAST_AMENDED_DATE` to today's date (ISO 8601).
4. Propagate changes to `.specify/templates/plan-template.md`,
   `.specify/templates/spec-template.md`, and `.specify/templates/tasks-template.md` if any
   Constitution Check gates, task types, or section requirements change.
5. Commit with message: `docs: amend constitution to vX.Y.Z (<brief reason>)`

### Compliance Review
- Every plan generated by `/speckit.plan` MUST include a Constitution Check gate that verifies
  compliance with Principles I–V before Phase 0 research proceeds.
- Every code-generation task MUST pass the Self-Check in `CLAUDE.md` before being marked done.
- Complexity exceptions (e.g., justified use of a pattern that conflicts with Principle V) MUST
  be documented in the plan's Complexity Tracking table with a rationale.

### Runtime Guidance
The authoritative runtime development guide is `CLAUDE.md` at the repository root. The
constitution sets non-negotiable principles; `CLAUDE.md` provides implementation-level detail
(API endpoints, model shapes, SSR patterns, build order). When the two conflict, the constitution
takes precedence and `CLAUDE.md` MUST be updated to align.

**Version**: 1.0.1 | **Ratified**: 2026-03-23 | **Last Amended**: 2026-03-23
