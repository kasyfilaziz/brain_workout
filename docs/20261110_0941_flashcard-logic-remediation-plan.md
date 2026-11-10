# Flashcard Logic Remediation Plan

**Status**: Implemented and reviewed
**Date**: 2026-11-10
**Scope**: Flashcard study session, deck counts, data import, and related regression tests
**Current stack**: Svelte 4, Vite 4, Tailwind CSS 3, IndexedDB via `idb`

## Summary

The flashcard feature has a critical session-sequencing defect. The active study
queue is rebuilt whenever the `cards` store changes. Rating a card changes that
store, so the queue shrinks while `currentIndex` still refers to the previous
position. As a result, successful ratings can skip one or more cards.

The review also found stale deck counts, incomplete JSON restore behavior,
missing persistence error handling, and a CSV parser that does not support
quoted commas or multiline values. This plan fixes those issues without changing
the core SM-2 formula or the local-first architecture.

Keyboard navigation is already implemented and is outside the remediation
scope. It must remain covered by regression tests.

## Implementation Result

The plan was implemented on 2026-11-10. The failed-card policy from FC-07
remains unchanged: failed cards reset their interval to `0` and are scheduled
for 04:00 on the current or next applicable day.

| Verification | Evidence |
|---|---|
| Automated regression suite | 33 Node tests pass, including fake-IndexedDB restore coverage |
| Production build | `npm run build` passes; only pre-existing accessibility warnings remain |
| Independent review | DeepSeek approved the final state after three review rounds |
| Browser validation | Chrome on port 9223 completed a three-card quick-study session without skipping |
| Keyboard validation | `Space` flipped cards; `1`, `3`, and `5` submitted ratings |
| CSV validation | Quoted commas, escaped quotes, and multiline values imported correctly |
| JSON validation | Export, reset, and restore preserved `interval`, `easeFactor`, and `nextReview` |
| Statistics validation | Quick-study due count matched the sum of per-deck due counts before and after study |

## Evidence

The session defect was reproduced with three due cards:

1. Start a quick-study session with cards A, B, and C.
2. Rate card A as failed (`1`). Card A remains due and the session advances to B.
3. Flip card B and rate it as successful (`5`).
4. The session immediately shows the completed screen without displaying card C.

The deck count defect was also observed. The quick-study action reported three
due cards while the deck card reported `0 total kartu`.

## Findings

| ID | Severity | Finding | Evidence and root cause |
|---|---|---|---|
| FC-01 | Critical | A successful rating can skip cards | `sessionCards` is recalculated from `$cards`; `updateCard()` reloads the store and shrinks the queue during the active session |
| FC-02 | High | Deck totals and due counts can remain stale | Counts are calculated through helper functions called from the template; the rendered values do not reliably update when `$cards` changes |
| FC-03 | High | Rating can advance even when persistence fails | `updateCard(updatedCard)` is not awaited and has no error handling |
| FC-04 | Medium | JSON restore does not preserve review progress | `importJSON()` creates new decks and calls `addCard()`, which resets interval, ease factor, and next review |
| FC-05 | Medium | CSV import cannot parse valid quoted values | Rows are split on newlines before quote parsing, and the parser does not support escaped quotes or commas inside fields |
| FC-06 | Low | Quick-study completion copy mentions a single deck | The completion message always says “deck ini” even when the session spans multiple decks |
| FC-07 | Decision | Failed cards are due at 04:00 on the current day | If the current time is after 04:00, a failed card is immediately due again. This may be intentional, but the policy must be explicit |

## Goals

- Ensure each card in the initial session snapshot appears exactly once.
- Keep the session queue stable while cards are saved or external stores update.
- Make deck totals and due counts reactive and accurate.
- Preserve SM-2 scheduling fields during JSON backup restore.
- Prevent a card from advancing when its rating could not be saved.
- Support valid CSV fields containing commas, quotes, and line breaks.
- Add repeatable tests for queue construction, SM-2 scheduling, CSV parsing, and import normalization.

## Non-goals

- Changing the SM-2 formula.
- Changing the visual design of flashcards.
- Adding cloud sync or server-side storage.
- Changing the existing `Space` and `1`-`5` keyboard shortcuts.
- Defining a new study algorithm or card-ordering strategy.

## Proposed Architecture

### 1. Immutable Session Snapshot

Create a pure helper:

```text
src/apps/flashcard/utils/studyQueue.js
```

Responsibilities:

- Accept `cards`, `deckId`, `isQuickStudy`, and `now`.
- Return a new array containing only cards due at session start.
- Sort deterministically by `nextReview`, then card ID.
- Never read from IndexedDB or Svelte stores.

`StudyView.svelte` must build the queue once when the session starts. Later
changes to `$cards` must not replace the active queue.

Expected state after the fix:

```text
Session start: [A, B, C]
Rate A:        [A, B, C], currentIndex = 1
Rate B:        [A, B, C], currentIndex = 2
Rate C:        [A, B, C], session complete
```

The queue stores the cards selected at session start. A failed card remains in
the session history but is not duplicated automatically. It can appear in a
later session if its `nextReview` remains due.

### 2. Await Persistence Before Advancing

Convert the rating handler into an asynchronous flow:

1. Ignore the rating when a transition is active or the card is not flipped.
2. Set `isTransitioning = true`.
3. Await `updateCard(updatedCard)`.
4. Only after a successful save, flip the card back and advance the queue.
5. On failure, keep the current card visible, reset `isTransitioning`, and show a retryable error message.

The last-card completion flow must also await `settings.updateStudiedToday()` so
the study streak is not silently lost.

### 3. Reactive Deck Statistics

Build a reactive statistics map directly from `$cards`:

```text
deckStats = {
  [deckId]: {
    total: number,
    due: number
  }
}
```

Use this map in filtering, sorting, and deck-card rendering. The template must
not call a helper that reads `$cards` indirectly for displayed counts.

### 4. Backup-Aware JSON Restore

Add a store-level backup import function that:

- Uses one IndexedDB transaction for all imported decks and cards.
- Maps exported deck IDs to newly generated local deck IDs.
- Preserves `interval`, `easeFactor`, and `nextReview`.
- Applies safe defaults when an older backup omits scheduling fields.
- Keeps import additive so existing local data is not overwritten.
- Reports a clear error if the transaction fails.

Recommended defaults for legacy data:

| Field | Default |
|---|---|
| `interval` | `0` |
| `easeFactor` | `2.5` |
| `nextReview` | `Date.now()` |
| `createdAt` | `Date.now()` |

Duplicate deck-name conflict handling is intentionally deferred. The initial
fix preserves review progress while retaining additive import behavior.

### 5. CSV Parser Utility

Create a pure CSV parser:

```text
src/apps/flashcard/utils/csv.js
```

It must support:

- Comma-separated fields.
- Quoted fields.
- Commas inside quoted fields.
- Newlines inside quoted fields.
- Escaped quotes represented as `""`.
- Windows and Unix line endings.
- Header validation for `deck`, `depan`, and `belakang`.

The import UI should render parser errors by row without partially importing
invalid records.

## Point of Problem Roadmap

### Phase 1: Establish Regression Tests

**References**

- `src/apps/flashcard/components/StudyView.svelte`
- `src/lib/utils/sm2.js`
- `src/apps/flashcard/stores/flashcards.js`

**Methodology**

- Use Node's built-in `node:test` runner to avoid adding a test framework.
- Add `npm test` using `node --test`.
- Add tests for SM-2 intervals so future fixes cannot silently change scheduling.

**Conclusion**

- `npm test` runs without requiring a browser.
- Existing SM-2 behavior is locked by tests.

### Phase 2: Fix Session Queue and Persistence

**References**

- `src/apps/flashcard/components/StudyView.svelte`
- New file: `src/apps/flashcard/utils/studyQueue.js`

**Methodology**

- Extract queue construction into the pure helper.
- Snapshot the queue once when the study session initializes.
- Replace reactive queue replacement with stable session state.
- Await card persistence and streak persistence.
- Add an inline persistence error state.

**Conclusion**

- Three cards always produce three session positions.
- A successful rating cannot skip a card.
- A failed save does not advance or complete the session.

### Phase 3: Fix Deck Statistics Reactivity

**References**

- `src/apps/flashcard/components/Dashboard.svelte`

**Methodology**

- Replace indirect helper reads with a reactive `deckStats` map.
- Use the map for total counts, due counts, filtering, and urgency sorting.

**Conclusion**

- Deck cards update immediately after cards load or change.
- The due count shown by quick study matches the sum of per-deck due counts.

### Phase 4: Preserve Review Data During JSON Restore

**References**

- `src/apps/flashcard/components/ImportView.svelte`
- `src/apps/flashcard/stores/flashcards.js`
- `src/apps/flashcard/components/StatsView.svelte`

**Methodology**

- Add a transactional backup import function to the store.
- Normalize older card records before writing them.
- Preserve scheduling metadata while remapping deck IDs.
- Keep the current export schema and document additive restore behavior.

**Conclusion**

- Exporting and importing a backup preserves each card’s interval, ease factor, and next review.
- Existing local decks remain untouched.

### Phase 5: Replace the CSV Parser

**References**

- `src/apps/flashcard/components/ImportView.svelte`
- New file: `src/apps/flashcard/utils/csv.js`

**Methodology**

- Implement a character-based parser with quote state.
- Validate parsed headers and rows.
- Add tests for quoted commas, escaped quotes, and multiline fields.

**Conclusion**

- Valid standard CSV data imports without data corruption.
- Invalid rows are reported before any import begins.

### Phase 6: Copy and Regression Cleanup

**References**

- `src/apps/flashcard/components/StudyView.svelte`

**Methodology**

- Use different completion copy for deck study and quick study.
- Re-test keyboard `Space` and rating keys after the session-state refactor.
- Run the production build.

**Conclusion**

- Completion text matches the active session type.
- Keyboard and mouse flows behave identically.

## Acceptance Criteria

| ID | Acceptance criterion |
|---|---|
| AC-01 | A three-card session displays all three cards exactly once |
| AC-02 | Rating a card as successful does not shrink the active queue |
| AC-03 | A failed save keeps the same card visible and does not mark the session complete |
| AC-04 | Deck total and due counts update when cards load or change |
| AC-05 | Quick-study due count equals the sum of due counts across decks |
| AC-06 | JSON restore preserves `interval`, `easeFactor`, and `nextReview` |
| AC-07 | CSV import accepts quoted commas, escaped quotes, and multiline fields |
| AC-08 | `Space` flips the card and `1`-`5` submits ratings after the refactor |
| AC-09 | `npm test` and `npm run build` both pass |

## Test Plan

### Automated Tests

| Area | Cases |
|---|---|
| Study queue | Empty cards, deck session, quick-study session, stable snapshot, deterministic ordering |
| SM-2 | Failed rating, first success, subsequent success, minimum ease factor |
| CSV parser | Simple rows, quoted commas, escaped quotes, multiline values, malformed rows |
| Backup normalization | Full metadata, missing metadata, unknown deck references |

### Browser Tests

1. Create three due cards and start quick study.
2. Use `Space` and `1`-`5` to complete the session.
3. Confirm the counter progresses from 1/3 to 3/3 without skipping.
4. Confirm keyboard shortcuts are ignored while an input is focused.
5. Confirm the deck count changes immediately after adding or rating cards.
6. Export JSON, reset data, restore JSON, and confirm review scheduling is preserved.
7. Import CSV containing quoted commas and multiline values.

### Build Verification

```bash
npm test
npm run build
```

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Queue snapshot excludes cards added during an active session | This is expected behavior; added cards appear in the next session |
| JSON import creates duplicate deck names | Preserve current additive behavior in the first fix; add conflict resolution as a separate change |
| IDB transactions close during asynchronous imports | Use one `idb` transaction and await each request inside it |
| Changing failed-card due policy surprises users | Keep current due-date behavior unless a separate product decision changes it |
| Keyboard handling regresses during refactor | Retain browser keyboard tests in acceptance criteria |

## Constitution Check

| Principle | Plan alignment |
|---|---|
| Local-first data | No server or external API is introduced; IndexedDB remains the source of truth |
| Static deployment | Changes remain client-side and work with GitHub Pages |
| PWA/offline | No new network dependency is required |
| Extensible platform | Flashcard utilities remain isolated under the flashcard module |
| Data portability | JSON and CSV import/export behavior is improved |

## Actual File Impact

```text
src/apps/flashcard/components/Dashboard.svelte
src/apps/flashcard/components/ImportView.svelte
src/apps/flashcard/components/StudyView.svelte
src/apps/flashcard/stores/flashcards.js
src/apps/flashcard/utils/backup.js
src/apps/flashcard/utils/csv.js
src/apps/flashcard/utils/deckStats.js
src/apps/flashcard/utils/keyboard.js
src/apps/flashcard/utils/studyRating.js
src/apps/flashcard/utils/studyQueue.js
src/lib/stores/settings.js
tests/flashcard/backup.test.js
tests/flashcard/csv.test.js
tests/flashcard/deckStats.test.js
tests/flashcard/keyboard.test.js
tests/flashcard/studyRating.test.js
tests/flashcard/studyQueue.test.js
tests/flashcard/sm2.test.js
package.json
README.md
```

## Definition of Done

- All acceptance criteria pass.
- Automated tests and production build pass.
- The review findings FC-01 through FC-05 are resolved.
- The failed-card due-date policy is explicitly confirmed.
- The implementation is reviewed before commit and deployment.
