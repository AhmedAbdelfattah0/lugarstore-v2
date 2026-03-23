---
description: "Task list for pagination smart truncation fix"
---

# Tasks: Pagination Smart Truncation Fix

**Input**: Design documents from `specs/001-fix-pagination-truncation/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Not requested — manual browser verification per quickstart.md.

**Organization**: All four user stories (US1–US4) are addressed by a single algorithm change.
Tasks are ordered: fix → build verification → manual smoke-test.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: Which user story the task belongs to
- File paths are absolute from repository root

---

## Phase 1: Setup

*No setup required — the component file exists and the branch is already checked out.*

---

## Phase 2: Foundational

*No new infrastructure required — pure in-place fix.*

---

## Phase 3: All User Stories — Threshold Fix (P1 + P2)

**Goal**: Lower the no-truncation guard from `total <= 7` to `total <= 5` in `visiblePages`
so the window algorithm fires for 6+ page totals, producing correct ellipsis on page 1 (US1),
middle pages (US2), last page (US3), and correct arrow boundaries (US4 — already correct, just
needs regression verification).

**Independent Test** (per quickstart.md):
1. Serve the app with a dataset that produces ≥ 6 pages.
2. On page 1: bar shows `1  2  ...  N`.
3. On page 5: bar shows `1  ...  4  [5]  6  ...  N`.
4. On page N: bar shows `1  ...  N-1  N`.
5. On page 1: previous arrow is disabled.
6. On page N: next arrow is disabled.

### Implementation

- [x] T001 [US1] [US2] [US3] [US4] Change `if (total <= 7)` to `if (total <= 5)` in the `visiblePages` computed signal in `src/app/shared/components/filtering/lg-pagination/lg-pagination.component.ts` (line 27)

**Checkpoint**: At this point all four user stories should be verifiable independently.

---

## Phase 4: Polish & Verification

**Purpose**: Confirm the fix compiles cleanly and all acceptance criteria pass in the browser.

- [x] T002 [P] Run `ng build` from repo root and verify zero errors and zero warnings (SC-005)
- [ ] T003 [P] Manually verify page-1 ellipsis per quickstart.md Step 2 (SC-001, FR-001)
- [ ] T004 [P] Manually verify middle-page double ellipsis per quickstart.md Step 3 (SC-002, FR-002)
- [ ] T005 [P] Manually verify last-page ellipsis per quickstart.md Step 4 (SC-003, FR-001)
- [ ] T006 [P] Manually verify arrow boundary states per quickstart.md Step 5 (SC-006, FR-006, FR-007)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: N/A — no blocking prerequisites
- **Fix (Phase 3)**: Can start immediately — T001 is the only implementation task
- **Polish (Phase 4)**: Depends on T001 completion; all T002–T006 can run in parallel after T001

### User Story Dependencies

- **US1, US2, US3, US4**: All resolved by T001 — no inter-story dependencies

### Within the Fix Phase

- T001 has no dependencies → complete it first
- T002–T006 all depend on T001; they are independent of each other → run in parallel

---

## Parallel Execution Example

```bash
# After T001 is done, run all verification tasks in parallel:
Task: "Run ng build"                              # T002
Task: "Verify page-1 ellipsis"                   # T003
Task: "Verify middle-page double ellipsis"        # T004
Task: "Verify last-page ellipsis"                 # T005
Task: "Verify arrow boundary states"              # T006
```

---

## Implementation Strategy

### MVP (Single change)

1. Apply T001 — one-line fix in one file
2. Run T002 — build passes
3. Run T003–T006 — smoke test in browser
4. Done ✅

### Incremental Delivery

Not applicable — the fix is atomic. All user stories are unblocked by the single threshold change.

---

## Notes

- T001 is the only implementation task; everything else is verification
- `[P]` on T002–T006 = they have no ordering constraints relative to each other
- No new files, no service changes, no template changes, no SCSS changes
- If the quickstart.md manual test requires a temporary `PAGE_SIZE` change, revert it before committing
