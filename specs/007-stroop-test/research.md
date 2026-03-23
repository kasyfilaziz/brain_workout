# Research: Stroop Test Implementation

**Date**: 2026-03-23
**Feature**: [specs/007-stroop-test/spec.md](specs/007-stroop-test/spec.md)

## Decision Log

- **Decision**: Use `performance.now()` for millisecond-precise reaction time (RT) measurements in browser.
- **Rationale**: `Date.now()` is insufficiently precise for cognitive testing (often capped at 10-15ms resolution).
- **Alternatives considered**: `Date.now()`, `console.time()`.

- **Decision**: Store Stroop sessions in a separate IndexedDB object store named `stroop_sessions`.
- **Rationale**: Keeps Stroop data isolated from Flashcards and other workout modules, preventing schema collisions.
- **Alternatives considered**: Single generic `app_data` store with prefixing.

- **Decision**: Use a centralized `ColorEngine` utility to generate stimulus pairs.
- **Rationale**: Simplifies logic for ensuring incongruency (word != ink color) and facilitates easy expansion for high-contrast palettes.
- **Alternatives considered**: Inline generation within the `App.svelte` component.

## Best Practices

- **Color Accessibility**: Ensure high-contrast palettes pass WCAG 2.1 AA standards for the chosen colors (e.g., specific Blue/Yellow palette).
- **Debounce**: Implement a 100ms debounce on input buttons to prevent accidental double-taps (as specified in edge cases).
- **Feedback timing**: Visual feedback should be nearly instantaneous (16ms frame), while haptic feedback (vibration) can follow immediately to confirm input.
