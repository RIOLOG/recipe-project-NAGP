# 🍲 PlateShelf - Recipe Finder & Meal Planner

A modern Recipe Finder & Meal Planner platform built with **Svelte 5**, **SvelteKit**, and **StencilJS**. Discover recipes from a public API, view full recipe details, manage your own recipes, save favorites, and plan your week's meals — all powered by a custom-built, published web component library.

---

## 🔗 Links

| | |
|---|---|
| **Live app** | https://plateshelf.vercel.app/ |
| **GitHub repository** | https://github.com/RIOLOG/recipe-project-NAGP |
| **Stencil component library on npm** | https://www.npmjs.com/package/@riolog/recipe-ui-kit |

---

## 🏗️ Project structure

This is a monorepo containing two independent projects:

recipe-project/

├── recipe-ui-kit/ → StencilJS component library (published as @riolog/recipe-ui-kit)

└── recipe-finder/ → SvelteKit application (consumes the published npm package)


Each folder has its own README with project-specific details; this root README covers the project as a whole.

---

## 🧩 Tech stack

- **SvelteKit** (Svelte 5, runes-based reactivity) — routing, pages, state management
- **StencilJS** — framework-agnostic web component library
- **TheMealDB** — free public recipe API (search, browse, filter, detail lookup)
- **localStorage** — client-side persistence for favorites, meal plan, and user-created recipes (no backend/database)
- **Vercel** — deployment (via `@sveltejs/adapter-vercel`)

---

## ✨ Features

- **Recipe Discovery** — live debounced search, category filtering (fetched dynamically from TheMealDB), infinite-scroll browsing
- **Recipe Details** — full ingredients + instructions on a dedicated hero-style page
- **Recipe Management** — create, edit, delete your own recipes, with validation before saving
- **Favorites** — add/remove/view, works for both API recipes and your own
- **Weekly Meal Planner** — assign recipes to Breakfast/Lunch/Dinner slots across all 7 days, with a search-based recipe picker

---

## 📦 The component library — `@riolog/recipe-ui-kit`

A framework-agnostic Stencil web component library built specifically for this app, published to npm and consumed as a real dependency (not imported from source).

**8 components:**
| Component | Purpose |
|---|---|
| `recipe-card` | Displays a recipe summary; composes `favorite-button` and `rating-badge` internally; has a `footer` slot |
| `favorite-button` | Standalone favorite toggle, reused inside cards and on the detail page |
| `rating-badge` | Difficulty badge (Easy/Medium/Hard), shown only for user-created recipes |
| `recipe-search` | Search input with both debounced live search and submit-triggered search |
| `category-filter` | Row of selectable category chips |
| `recipe-form` | Add/edit form with built-in validation; has an `extra-fields` slot |
| `ingredient-list` | Renders a recipe's ingredient list |
| `meal-plan-slot` | A single day-cell for the weekly planner |

All components are Shadow DOM–encapsulated and themeable via `--ruk-*` CSS custom properties, set globally in `recipe-finder`'s root layout.


---

## 🚀 Setup instructions

### Prerequisites
- Node.js 18.17+ (developed and tested on Node 22)
- npm

### 1. Clone the repository
```bash
git clone [https://github.com/riolog/recipe-project.git](https://github.com/RIOLOG/recipe-project-NAGP.git)
cd recipe-project
```

### 2. Set up the Stencil component library (optional — already published to npm)
The published package is used by default; you only need this if you want to modify or rebuild the components yourself.
```bash
cd recipe-ui-kit
npm install
npm run build
```

### 3. Set up the SvelteKit application
```bash
cd ../recipe-finder
npm install
```

### 4. Start the development server
```bash
npm run dev
```
The app will be available at **http://localhost:5173**.

### 5. Type-checking (optional)
```bash
npm run check
```

### 6. Production build (optional, local)
```bash
npm run build
npm run preview
```
> **Windows note:** `@sveltejs/adapter-vercel` creates symlinks during the build, which requires either enabling **Developer Mode** (Settings → Privacy & Security → For Developers) or running the terminal as Administrator on Windows. This restriction does not apply on Vercel's own (Linux) build servers, so it does not affect actual deployment.

---

## 📝 Assumptions made

- **No backend/database.** The assignment did not mandate one, so all persistence (favorites, weekly meal plan, and user-created recipes) is implemented via browser `localStorage`, wrapped in Svelte 5 rune-based reactive stores.
- **TheMealDB** was chosen as the public recipe API (free, no API key required) over alternatives like Spoonacular.
- **User-created recipes are entirely separate from the API's data.** TheMealDB is treated as read-only; "add/edit/delete" only applies to recipes created within the app, which are prefixed with a `user-` id to avoid collisions with TheMealDB's numeric ids.
- **Client-side rendering (`ssr = false`)** is used on routes that depend on `localStorage`-backed data (home, recipe detail, planner), since SvelteKit's server-side rendering runs before browser storage is available. This avoids a mismatch between server-rendered and client-rendered content on page refresh.
- **Category filter options are fetched live from TheMealDB**, not hardcoded — they reflect whatever categories currently exist in the public API.
- **Weekly meal planner** supports three meal slots per day (Breakfast, Lunch, Dinner) rather than a single slot per day, as a deliberate enhancement beyond the minimum requirement.
- **Custom elements are registered via individual per-component imports** (`@riolog/recipe-ui-kit/components/<name>.js`) rather than Stencil's lazy-loader (`/loader`). The lazy-loader's internal dynamic `import()` calls are not reliably resolvable inside a bundler-processed production build (Vite/Rollup); importing each component's bundled file directly (which self-registers via `customElements.define()` on import) is fully bundler-compatible and works identically in dev and production.

---

## 🔌 Integration highlights

- **Props**: data flows from SvelteKit into every Stencil component via component properties (strings, booleans, and arrays/objects, e.g. `categories` on `category-filter`, `ingredients` on `ingredient-list`).
- **Custom events**: SvelteKit listens for and handles every custom event emitted by the Stencil components (`favoriteToggle`, `cardOpen`, `searchChange`/`searchSubmit`, `filterChange`, `formSubmit`/`formCancel`, `slotAssignRequest`/`slotRemove`).
- **Slots**: `recipe-card`'s `footer` slot is used to inject contextual hints (ingredient count for user recipes, a call-to-action for API recipes); `recipe-form`'s `extra-fields` slot demonstrates extending the form with app-specific fields (e.g. prep time) without forking the component.
- **Theming**: all components read colors via `--ruk-*` CSS custom properties, set once at the SvelteKit app's `:root` so the whole component library matches the app's visual identity without modifying component source.
- **Composition**: `recipe-card` internally composes `favorite-button` and `rating-badge`, demonstrating component-to-component reuse within the library itself, not just app-to-library.

---

## 📁 Versioning — `@riolog/recipe-ui-kit`

Follows semantic versioning; each release was published for a concrete reason:

| Version | Change |
|---|---|
| `0.1.0` | Initial publish — all 8 components |
| `0.2.0` | Fixed npm `exports` map so TypeScript can resolve the package's root type declarations for consumers |
| `0.2.1` | Fixed inconsistent recipe-card image sizing (`aspect-ratio` → fixed height, more reliable across flex layouts) |
| `0.2.2` | Added `dist/components` bundled (non-lazy) output as an importable entry point |
| `0.2.3` | Fixed `exports` wildcard pattern for `./components/*` subpath imports |
| `0.2.4` | Corrected wildcard extension matching so individual component imports resolve correctly (`./components/*.js`) |

---

## 👤 Author

Built by **Ankit Singh**.
