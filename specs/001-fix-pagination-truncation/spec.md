# Feature Specification: Pagination Smart Truncation Fix

**Feature Branch**: `001-fix-pagination-truncation`
**Created**: 2026-03-23
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 — First-Page Ellipsis (Priority: P1)

A shopper lands on the products page at page 1 of many (e.g. 37 pages). The pagination
bar shows the first two page numbers, an ellipsis, and the last page number — giving a
clear sense of scale without crowding the interface.

**Why this priority**: This is the default state every visitor sees. The missing ellipsis
makes pagination look broken and undermines trust at the most visible entry point.

**Independent Test**: Open the products page with enough products to produce ≥ 6 pages.
With page 1 active, the bar should render `1  2  ...  37` and nothing else.

**Acceptance Scenarios**:

1. **Given** 37 total pages and page 1 is active, **When** the pagination bar renders,
   **Then** it shows exactly: `1  2  ...  37` — no extra numbers, no missing ellipsis.
2. **Given** any total ≥ 6 pages and page 1 is active, **When** the bar renders,
   **Then** an ellipsis appears between the early page numbers and the last page.

---

### User Story 2 — Middle-Page Double Ellipsis (Priority: P1)

A shopper navigates to a middle page (e.g. page 5 of 37). The bar shows: first page,
ellipsis, the page before the active, the active page (highlighted), the page after,
another ellipsis, and the last page — giving full directional context.

**Why this priority**: Middle-page navigation is the most common browsing pattern after
the initial landing. Missing ellipses cause disorientation.

**Independent Test**: Navigate to page 5 of 37. The bar should render
`1  ...  4  [5]  6  ...  37` with page 5 visually highlighted.

**Acceptance Scenarios**:

1. **Given** 37 total pages and page 5 is active, **When** the bar renders,
   **Then** it shows: `1  ...  4  [5]  6  ...  37`.
2. **Given** the active page is not adjacent to page 1 or the last page,
   **When** the bar renders, **Then** ellipses appear on both sides of the active group.
3. **Given** the active page is adjacent to page 1 (e.g. page 2),
   **When** the bar renders, **Then** no leading ellipsis appears (consecutive pages).
4. **Given** the active page is adjacent to the last page,
   **When** the bar renders, **Then** no trailing ellipsis appears.

---

### User Story 3 — Last-Page Ellipsis (Priority: P2)

A shopper navigates to the last page of results. The bar mirrors the first-page pattern:
first page, ellipsis, second-to-last page, and last page.

**Why this priority**: Less frequent than first/middle-page states but required for
visual consistency and a polished feel.

**Independent Test**: Navigate to page 37 of 37. The bar should render `1  ...  36  37`.

**Acceptance Scenarios**:

1. **Given** 37 total pages and page 37 is active, **When** the bar renders,
   **Then** it shows exactly: `1  ...  36  37`.
2. **Given** any last page is active, **When** the bar renders,
   **Then** no trailing ellipsis appears after the last page number.

---

### User Story 4 — Previous / Next Arrow Navigation (Priority: P1)

A shopper uses the left/right arrows to move one page at a time. The bar updates to
reflect the new active page with correct truncation on every transition.

**Why this priority**: Arrow navigation is the primary way shoppers page through results
without clicking individual numbers.

**Independent Test**: On page 5, click the next arrow. Active page becomes 6, product
grid updates, truncation re-renders correctly (`1  ...  5  [6]  7  ...  37`).

**Acceptance Scenarios**:

1. **Given** page 1 is active, **When** the previous arrow is clicked,
   **Then** the button is visually disabled and the page does not change.
2. **Given** the last page is active, **When** the next arrow is clicked,
   **Then** the button is visually disabled and the page does not change.
3. **Given** any non-boundary page is active, **When** the shopper clicks next or previous,
   **Then** the active page changes by ±1 and the product grid updates.

---

### Edge Cases

- What happens when total pages = 1? The pagination bar should not render at all.
- What happens when total pages ≤ 5? All page numbers display without any ellipsis.
- What happens on page 2 or page (last − 1)? No ellipsis appears on the side where
  the active group is already adjacent to the boundary page.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The pagination bar MUST display a trailing ellipsis and the last page number
  when the active page is not adjacent to the end of the range.
- **FR-002**: The pagination bar MUST display a leading ellipsis and page 1 when the active
  page is not adjacent to the start of the range.
- **FR-003**: Ellipsis indicators MUST be non-interactive; clicking them MUST have no effect.
- **FR-004**: The active page number MUST be visually distinguished from inactive page numbers.
- **FR-005**: Clicking any page number MUST update both the active page indicator and the
  product grid displayed above the pagination bar.
- **FR-006**: The previous-page arrow MUST be disabled when page 1 is active.
- **FR-007**: The next-page arrow MUST be disabled when the last page is active.
- **FR-008**: The pagination bar MUST NOT render any ellipsis when total pages ≤ 5.
- **FR-009**: The pagination bar MUST NOT render at all when there is only 1 page of results.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On page 1 with ≥ 6 total pages, the pagination bar shows an ellipsis before
  the last page number — verified in all tested product category views.
- **SC-002**: On any middle page not adjacent to the boundary, both leading and trailing
  ellipses appear — 100% of tested middle-page states pass.
- **SC-003**: On the last page, an ellipsis appears after page 1 — verified in all tested views.
- **SC-004**: Clicking a page number or an arrow updates the product grid within one render
  cycle — no stale content visible.
- **SC-005**: The application build completes with zero errors and zero warnings after the fix.
- **SC-006**: Arrow buttons are visually disabled at the boundary pages — confirmed by
  inspection on page 1 (previous) and last page (next).

## Assumptions

- Total page count is determined by the product list state and passed into the pagination
  control as an input.
- The "window" around the active page is always 1 page on each side
  (i.e. active−1, active, active+1).
- Page numbers are 1-indexed.
- Fix scope is limited to the truncation/visible-pages logic. No changes to visual styling,
  spacing, colors, or arrow button design are in scope.
