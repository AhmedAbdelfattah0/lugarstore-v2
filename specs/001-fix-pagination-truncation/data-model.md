# Data Model: Pagination Smart Truncation Fix

## VisiblePage (union type)

The `visiblePages` computed signal returns `(number | '...')[]`. This is not a new type —
it already exists in the component. Documented here for reference.

```
VisiblePage = number | '...'
```

| Value | Meaning | Rendered as |
|-------|---------|-------------|
| `number` | A clickable page button | `<button class="page-item">N</button>` |
| `'...'` | A non-interactive gap indicator | `<span class="page-dots">...</span>` |

## Algorithm: visiblePages

**Inputs**:
- `total` — total page count (`Math.ceil(itemCount / pageSize)`)
- `current` — the active 1-indexed page number

**Output**: ordered array of `VisiblePage` values representing the pagination bar

**Rules** (after fix):

```
if total ≤ 5:
  return [1, 2, ..., total]          ← no truncation, show all

else:
  result = [1]
  if current > 3:
    result.push('...')               ← leading gap
  for i = max(2, current-1) to min(total-1, current+1):
    result.push(i)                   ← active window
  if current < total - 2:
    result.push('...')               ← trailing gap
  result.push(total)
  return result
```

**Key invariants**:
- Page `1` always appears first.
- Page `total` always appears last.
- No duplicate page numbers in the output.
- `'...'` never appears at position 0 or last.
- `'...'` never appears between two consecutive integers.
