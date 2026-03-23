# Quickstart: Stroop Test Implementation

**Branch**: `007-stroop-test`

## 1. Setup
- Ensure `stroop-test` folder exists in `src/apps/`.
- Add `stroop-test` entry in `src/lib/stores/apps.js` to register the module.
- Add database migration in `src/lib/utils/db.js` for `stroop_sessions` and `stroop_profiles` stores.

## 2. Core Development Order
1.  **Utilities** (`src/apps/stroop-test/utils/`):
    - `colorEngine.js`: Handles stimulus generation and incongruency logic.
    - `metrics.js`: Handles RT tracking and $IG$ score calculation.
2.  **Stores** (`src/apps/stroop-test/stores/`):
    - `session.js`: Manages current session state, active stimulus, and RT tracking.
3.  **Components** (`src/apps/stroop-test/components/`):
    - `StimulusDisplay.svelte`: Renders the color word/symbols.
    - `ControlPanel.svelte`: Renders response buttons.
    - `ResultSummary.svelte`: Renders session performance.
4.  **Integration** (`src/apps/stroop-test/App.svelte`):
    - Connect UI to stores and trigger session start/stop.

## 3. Key Considerations
- **Baseline Dependence**: Always check if baseline `StroopProfile` exists before enabling "Interference" mode. If not, prompt the user to complete Word/Color baselines.
- **Debounce**: All tap handlers MUST use the 100ms debounce logic.
- **Persistence**: Save session results only upon session completion or user explicit exit (discarding state on accidental refresh/exit).
