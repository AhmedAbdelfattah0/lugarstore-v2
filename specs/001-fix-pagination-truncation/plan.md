# Implementation Plan: Pagination Smart Truncation Fix

**Branch**: `001-fix-pagination-truncation` | **Date**: 2026-03-23 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-fix-pagination-truncation/spec.md`

## Summary

The `visiblePages` computed signal in `lg-pagination` omits the ellipsis before the last page
number when the user is on page 1. Root cause: the `total <= 7` no-truncation guard fires for
any store with ≤ 84 products (7 pages at `pageSize = 12`), preventing the window algorithm from
running. Fix: lower the guard threshold from `7` to `5`. All other algorithm logic is correct.
Change scope: one line in one file.

## Technical Context

**Language/Version**: TypeScript 5.x (Angular 21 project)
**Primary Dependencies**: Angular 21 Signals, ChangeDetectionStrategy.OnPush
**Storage**: N/A — pure computed signal, no persistence
**Testing**: Manual browser verification per `quickstart.md`; `ng build` for compile check
**Target Platform**: Browser (SSR pre-render via `ng build --output-mode static`, Hostinger)
**Project Type**: Angular standalone component fix
**Performance Goals**: No performance impact — computed signal, runs only on input change
**Constraints**: Standalone + OnPush; no logic outside the component; no new dependencies
**Scale/Scope**: Single component, single computed property, one-line change

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| I — Component Architecture | Standalone ✓, OnPush ✓, `lg-` prefix ✓, `inject()` ✓, zero new business logic | ✅ PASS |
| II — SSR Safety | No browser APIs touched; computed signal is SSR-safe | ✅ PASS |
| III — Data Normalization | No API data involved | ✅ PASS |
| IV — Design Fidelity | No styling changes | ✅ PASS |
| V — Simplicity & YAGNI | One-line fix; no new abstractions; no new files | ✅ PASS |

**Post-design re-check**: All gates still pass. Fix is narrowest possible change.

## Project Structure

### Documentation (this feature)

```text
specs/001-fix-pagination-truncation/
├── plan.md         ← this file
├── spec.md         ← feature specification
├── research.md     ← Phase 0: root cause analysis + algorithm traces
├── data-model.md   ← Phase 1: VisiblePage type + algorithm pseudocode
├── quickstart.md   ← Phase 1: manual verification steps
└── tasks.md        ← Phase 2 output (/speckit.tasks — not yet created)
```

### Source Code (one file changed)

```text
src/app/shared/components/filtering/lg-pagination/
└── lg-pagination.component.ts     ← ONLY file modified
    └── visiblePages computed signal
        └── change: `if (total <= 7)` → `if (total <= 5)`
```

**Structure Decision**: Single-project, single-file fix. No new files in `src/`.

## Complexity Tracking

> No Constitution Check violations — Complexity Tracking section not required.

---

## Phase 0: Research — Complete

Findings consolidated in `research.md`. Key conclusions:

1. **Root cause confirmed**: `if (total <= 7)` guard bypasses the window algorithm for stores
   with ≤ 84 products, producing `[1, 2, 3, ..., N]` (all pages, no ellipsis).

2. **Window algorithm is correct**: Manual traces for pages 1, 5, and 37 of a 37-page set all
   produce the expected output once the guard threshold is reduced.

3. **No architectural changes needed**: The component's `page` input and `pageChange` output
   contract remains unchanged. The component does not need to inject `FilterStateService`.

4. **No [NEEDS CLARIFICATION] items**: Spec acceptance criteria map directly to algorithm cases.

---

## Phase 1: Design — Complete

Artifacts generated:

- **`data-model.md`**: Documents `VisiblePage = number | '...'` union type and algorithm
  pseudocode with invariants.
- **`quickstart.md`**: Step-by-step browser verification for all three spec scenarios plus
  boundary (arrow buttons) and build check.
- **No `/contracts/`**: Internal UI component with no external API surface.

### The Fix (exact change)

**File**: `src/app/shared/components/filtering/lg-pagination/lg-pagination.component.ts`

```typescript
// BEFORE (line 27):
if (total <= 7) {
  return Array.from({ length: total }, (_, i) => i + 1);
}

// AFTER:
if (total <= 5) {
  return Array.from({ length: total }, (_, i) => i + 1);
}
```

That is the complete change. No other modifications.

### Verification matrix (from research.md)

| Page | Total | Expected bar | Algorithm output | Match |
|------|-------|--------------|-----------------|-------|
| 1 | 37 | `1  2  ...  37` | `[1, 2, '...', 37]` | ✅ |
| 5 | 37 | `1  ...  4  [5]  6  ...  37` | `[1, '...', 4, 5, 6, '...', 37]` | ✅ |
| 37 | 37 | `1  ...  36  37` | `[1, '...', 36, 37]` | ✅ |
| 1 | 5 | `1  2  3  4  5` (no ellipsis) | `[1, 2, 3, 4, 5]` | ✅ |
| 1 | 6 | `1  2  ...  6` | `[1, 2, '...', 6]` | ✅ |
