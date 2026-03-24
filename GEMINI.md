# AI Coding Agent Standard Operating Procedures

This document defines the mandatory behavior and execution standards for the AI agent within this project. These rules apply to all languages (JavaScript, Svelte, CSS, etc.) and take precedence over default behaviors.

---

## 1. Industry Standards & Best Practices
**Goal:** Production-grade quality regardless of the language.

* **Best Practice Adherence:** Always implement code according to current industry standards. Use idiomatic formatting and performance optimization for JavaScript and Svelte.
* **Tool-First Research:** If the specific "best practice" for a library or framework version (e.g., Svelte 4, Tailwind CSS 3) is unknown, you **must** use `websearch`, `google_web_search`, or `web_fetch` to verify.
* **Human-in-the-Loop:** If tools are unavailable or documentation is ambiguous, stop and ask the user for the specific documentation or architectural preference. Never "hallucinate" a standard.

## 2. Interaction & Problem Solving Protocol
**Goal:** To eliminate assumptions and provide a transparent roadmap for the user.

### Phase 1: Clarification & Ambiguity Check
* **Stop & Ask:** Before thinking or planning, analyze the prompt for contradictions, vague terms, or missing context.
* **Zero Assumption Policy:** Even in "Build/Edit" mode, if the intent isn't 100% clear, you must ask the user for clarification before proceeding. Do not guess.
* **Use Question Tools:** Use `ask_user` or relevant question tools to ask questions to the user.

### Phase 2: Problem Decomposition (The "Point of Problem")
Once the intent is clear, break the prompt into a structured roadmap. Use `todowrite` (or available task tools) so the user can track progress. Each "Point of Problem" must include:
* **References:** Documentation, specific files, or URLs to be read.
* **Methodology:** A brief "how-to" for solving that specific sub-task.
* **Conclusion:** The expected outcome or definition of "done" for that point.
* **Hierarchy:** Complex tasks should use nested "child" points for granular tracking.

### Phase 3: Mode-Specific Output
* **Plan Mode:** Display the "Point of Problem" roadmap and the proposed logic for review. Do not modify files. Use `enter_plan_mode` if available.
* **Build/Edit Mode:** Display the roadmap and immediately begin the implementation of the points.

## 3. Post-Implementation "Deep Review"
**Goal:** Integrity and consistency.

* **Mandatory Re-Read:** After completing the main work (especially in Build/Edit mode), you must re-read every file you modified in its entirety.
* **Consistency Check:** Perform a deep review to ensure the changes align with the original "Point of Problem," maintain style consistency, and do not introduce regressions or broken dependencies.
* **Verification:** Run `npm run build` to ensure the project compiles without errors before finalizing.

---

## 4. Project-Specific Implementation Guidelines

### Build, Run & Development Commands
- **Installation:** `npm install`
- **Development:** `npm run dev`
- **Build:** `npm run build`
- **Preview:** `npm run preview`
- **Running Tests:** Note: This project does not currently have a test framework configured.

### Project Structure
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

### Code Style Guidelines
- **Svelte Components:** Use `<script>` tag at the top for imports and logic; use template syntax (`{#if}`, `{#each}`); use event handlers (`on:eventname`); use reactive declarations (`$:`); use `$storename` syntax to subscribe to stores.
- **JavaScript/ES Modules:** Use ES modules (`import`/`export`); use `const` by default; use `async/await` for async operations; use arrow functions for callbacks.
- **Naming Conventions:** PascalCase for components (e.g., `FlashCard.svelte`); camelCase for files (`db.js`), functions (`loadDecks`), and variables; UPPER_SNAKE_CASE for constants; kebab-case for CSS/Tailwind classes.
- **Imports:** Group imports: external libraries → internal modules → components. Use relative imports for internal code.
- **Error Handling:** Always use `try/catch` for async operations, especially database calls; provide meaningful error messages.
- **CSS & Styling:** Use **Tailwind CSS** for all styling; support dark mode via `dark:` modifier; keep custom CSS in component `<style>` blocks or `app.css`.

### Technology Stack
- **Framework:** Svelte 4
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 3
- **Database:** IndexedDB (via `idb` library)
- **PWA:** `vite-plugin-pwa`
- **Package Manager:** npm
- **Note:** Client-side only; SM-2 algorithm used for spaced repetition (`src/lib/utils/sm2.js`).

### Active Technologies (Reference)
- JavaScript (ES Modules), Svelte 4.x, TailwindCSS 3.x, idb 8.x, vite-plugin-pwa (Used across all modular apps: 001-006).
- IndexedDB via `idb` library for local-first persistence.

### Recent Changes
- **001-modular-app-container:** Initial setup with Svelte 4, Tailwind CSS, and PWA support.
- **Docs:** Refactored SOPs to align with standard AI agent behavior guidelines.
