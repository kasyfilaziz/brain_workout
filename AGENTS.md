# AGENTS.md - AI Coding Agent Guidelines

This file provides guidelines for AI coding agents working in this repository.

---

## 1. Build, Run & Development Commands

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build (Production)
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Running Tests
> **Note:** This project does not currently have a test framework configured.

---

## 2. Project Structure

```
src/
├── lib/
│   ├── components/    # Svelte components
│   ├── stores/         # Svelte stores (state management)
│   └── utils/          # Utility functions
├── App.svelte         # Root component
├── main.js            # Entry point
└── app.css            # Global styles
```

---

## 3. Code Style Guidelines

### General Principles
- **Best Practice Adherence:** Always implement code according to current industry standards.
- **Tool-First Research:** If best practice is unknown, use `websearch`, `context7`, or `webfetch` to verify.
- **Human-in-the-Loop:** If intent isn't 100% clear, ask the user for clarification. Never guess.

### Svelte Components
- Use `<script>` tag at the top for imports and logic
- Use template syntax with `{#if}`, `{#each}`, `{#await}`, etc.
- Use event handlers: `on:eventname` (e.g., `on:click`, `on:submit`)
- Use reactive declarations with `$:` for derived state
- Use `$storename` syntax to subscribe to Svelte stores

### JavaScript/ES Modules
- Use ES modules (`import`/`export`)
- Use `const` by default, `let` only when reassignment is needed
- Use async/await for asynchronous operations
- Use arrow functions for callbacks

### Naming Conventions
- **Components:** PascalCase (e.g., `StudyView.svelte`, `FlashCard.svelte`)
- **Files (JS):** camelCase (e.g., `db.js`, `flashcards.js`)
- **Functions:** camelCase with descriptive verb prefixes (e.g., `loadDecks`, `addCard`)
- **Constants:** UPPER_SNAKE_CASE for configuration
- **CSS Classes:** kebab-case (Tailwind convention)

### Imports
Group imports in order: external libraries → internal modules → components. Use relative imports for internal code.

Example:
```javascript
import { writable, derived } from 'svelte/store';
import { openDB } from 'idb';
import { dbPromise } from '../utils/db';
import Navbar from './lib/components/Navbar.svelte';
```

### Types
- This project uses **JavaScript** (not TypeScript)
- Use JSDoc comments for complex types if needed

### Error Handling
- Always use try/catch for async operations, especially database calls
- Provide meaningful error messages and handle edge cases

Example:
```javascript
export async function loadDecks() {
  try {
    const db = await dbPromise;
    const allDecks = await db.getAll('decks');
    decks.set(allDecks);
  } catch (error) {
    console.error('Failed to load decks:', error);
  }
}
```

### CSS & Styling
- Use **Tailwind CSS** for all styling
- Use dark mode classes: `dark:bg-gray-900`, `dark:text-gray-100`
- Keep custom CSS in component `<style>` blocks or `app.css`

---

## 4. Interaction Protocol

### Phase 1: Clarification & Ambiguity Check
- **Stop & Ask:** Analyze prompt for contradictions, vague terms, or missing context.
- **Zero Assumption Policy:** If intent isn't clear, ask user for clarification before proceeding.
- Use the `question` tool to ask clarifying questions.

### Phase 2: Problem Decomposition
Break the task into a structured roadmap using the `todowrite` tool. Each task must include:
- **References:** Documentation, specific files, or URLs to read
- **Methodology:** A brief "how-to" for solving that sub-task
- **Conclusion:** Expected outcome or definition of "done"

### Phase 3: Mode-Specific Output
- **Plan Mode:** Display roadmap and proposed logic for review. Do not modify files.
- **Build/Edit Mode:** Display roadmap and immediately begin implementation.

---

## 5. Post-Implementation Review

1. **Mandatory Re-Read:** Re-read every file you modified in its entirety.
2. **Consistency Check:** Ensure changes align with the original task, maintain style consistency.
3. **Verify Build:** Run `npm run build` to ensure the project compiles without errors.
4. **Commit & Push:** After successful build, commit changes and push to master branch:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin master
   ```

---

## 6. Technology Stack

- **Framework:** Svelte 4
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 3
- **Database:** IndexedDB (via `idb` library)
- **PWA:** vite-plugin-pwa
- **Package Manager:** npm

---

## 7. Important Notes

- This is a **client-side only** application (no backend API)
- Data persistence uses IndexedDB in the browser
- The app uses the SM-2 algorithm for spaced repetition (see `src/lib/utils/sm2.js`)
- Dark mode is supported via Tailwind's `dark:` modifier and Svelte store
- Routes are handled via state-based conditional rendering

## Active Technologies
- JavaScript (ES Modules), Svelte 4.x + Svelte 4.x, TailwindCSS 3.x, idb 8.x, vite-plugin-pwa (001-modular-app-container)
- IndexedDB via idb library (local-first) (001-modular-app-container)
- JavaScript (ES Modules) + Svelte 4.x, idb 8.x (IndexedDB), TailwindCSS 3.x (002-pomodoro-timer)
- IndexedDB via idb library (per constitution) (002-pomodoro-timer)
- JavaScript (ES Modules) + Svelte 4.x, idb 8.x, TailwindCSS 3.x (003-memory-match)
- IndexedDB (via idb library, shared `flashcard_db`) (003-memory-match)
- IndexedDB via idb library, shared `flashcard_db` (004-math-sprint)
- JavaScript (ES Modules), Svelte 4.x + Svelte 4, TailwindCSS 3, idb 8.x, vite-plugin-pwa (005-word-scramble)
- IndexedDB (idb library) - local persistence (005-word-scramble)
- JavaScript (ES Modules) - Svelte 4.x + Svelte 4.x, idb 8.x (IndexedDB), vite-plugin-pwa (006-sequence-recall)
- IndexedDB via idb library (per-app prefix `sequence_recall_*`) (006-sequence-recall)

## Recent Changes
- 001-modular-app-container: Added JavaScript (ES Modules), Svelte 4.x + Svelte 4.x, TailwindCSS 3.x, idb 8.x, vite-plugin-pwa
