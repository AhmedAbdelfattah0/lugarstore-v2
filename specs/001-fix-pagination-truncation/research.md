# Research: Pagination Smart Truncation Fix

## Decision: Root cause of the missing ellipsis

**Decision**: The ellipsis omission on page 1 is caused by the `total <= 7` guard in
`visiblePages`. When the product catalogue has ≤ 84 items (which gives `totalPages ≤ 7` with
`pageSize = 12`), the guard fires and all pages are returned without any ellipsis. The window
algorithm below the guard is never reached. The guard threshold of 7 is too high — it suppresses
truncation for lists where truncation would genuinely help readability.

**Rationale**:
- With `totalPages ≤ 5`, showing all pages inline is clean (max 5 buttons).
- At 6+ pages, smart truncation produces a shorter, cleaner bar.
- The current threshold of 7 means up to 7 page buttons appear without truncation, which is
  acceptable visually — but it means any store with ≤ 84 products never triggers the truncation
  path, masking the ellipsis behavior entirely during development.
- Lowering the threshold to 5 makes the truncation path exercisable with fewer products and
  produces the expected `1  2  ...  N` pattern at page 1 for 6+ page totals.

**Alternatives considered**:
- Keep threshold at 7, add a separate fix only for the "page 1 shows last page without '...'"
  case → rejected because the threshold is the root cause; fixing downstream symptoms leaves the
  guard brittle.
- Remove the guard entirely and let the window algorithm handle all cases → rejected because
  the window algorithm pushes `1` then the window then `total`, which double-counts `1` and
  `total` for very small page counts. The guard is still needed, just at threshold 5.

---

## Decision: Window algorithm correctness

**Decision**: The window algorithm is correct for the cases described in the spec. The fix is
limited to lowering the threshold from `<= 7` to `<= 5`.

**Verification traces** (after threshold change, all use `pageSize = 12`):

| Total pages | Current | Result | Pass? |
|-------------|---------|--------|-------|
| 37 | 1 | `[1, 2, '...', 37]` | ✅ |
| 37 | 5 | `[1, '...', 4, 5, 6, '...', 37]` | ✅ |
| 37 | 37 | `[1, '...', 36, 37]` | ✅ |
| 6 | 1 | `[1, 2, '...', 6]` | ✅ |
| 5 | 1 | `[1, 2, 3, 4, 5]` (no truncation) | ✅ |
| 8 | 4 | `[1, '...', 3, 4, 5, '...', 8]` | ✅ |

Window trace for page 5 of 37:
- `push 1` → `[1]`
- `current (5) > 3` → `push '...'` → `[1, '...']`
- `start = max(2, 4) = 4`, `end = min(36, 6) = 6` → push 4, 5, 6 → `[1, '...', 4, 5, 6]`
- `current (5) < total-2 (35)` → `push '...'` → `[1, '...', 4, 5, 6, '...']`
- `push 37` → `[1, '...', 4, 5, 6, '...', 37]` ✅

---

## Decision: Component architecture — no change to input/output contract

**Decision**: Keep `page` as an `input.required<number>()`. The "currentPage() alias" in the
spec description refers to using `this.page()` as the current-page reference inside `visiblePages`
— it does not require injecting `FilterStateService` into the component.

**Rationale**: The component is a dumb display component; it receives page number from outside
(currently wired from `filterState.page()` in the PLP template). Injecting `FilterStateService`
directly would couple a shared UI component to a feature-specific service, violating
Principle I and Principle V.

---

## Scope confirmed

One-line change: `if (total <= 7)` → `if (total <= 5)` in `lg-pagination.component.ts`.

No template changes. No SCSS changes. No service changes. No new files.
