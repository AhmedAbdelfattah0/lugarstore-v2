# Quickstart: Verify Pagination Smart Truncation Fix

## Prerequisites

- Dev server running: `ng serve`
- Browser open at `http://localhost:4200/products`

## Verification Steps

### Step 1 — Simulate many pages

Open browser devtools, intercept or mock the products API to return ≥ 73 products
(so `totalPages = ceil(73/12) = 7` — boundary case). With the fix applied, `total <= 5`
is the no-truncation guard, so 7 pages WILL use the window algorithm.

Alternatively, temporarily change `PAGE_SIZE` in `plp-state.service.ts` to `2` to produce
more pages from the real API product count. **Revert after testing.**

### Step 2 — Test page 1

With ≥ 6 total pages, page 1 active:
- ✅ Pagination bar shows: `← 1  2  ...  N →`
- ❌ Bug (before fix): `← 1  2  N →` (no ellipsis)

### Step 3 — Test a middle page

Navigate to page 5 (click page 2, then 3, then 4, then 5 or use arrow):
- ✅ `← 1  ...  4  5  6  ...  N →` with page 5 highlighted

### Step 4 — Test the last page

Click page `N`:
- ✅ `← 1  ...  N-1  N →`

### Step 5 — Test arrow boundaries

On page 1: click `←` — button should be visually disabled, page unchanged.
On page N: click `→` — button should be visually disabled, page unchanged.

### Step 6 — Build check

```bash
ng build
```

Expected: zero errors, zero warnings.

## What NOT to test here

- Visual styling of page buttons (out of scope)
- Product grid content (tested separately)
- Category/sort filters (tested separately)
