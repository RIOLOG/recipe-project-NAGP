# PlateShelf — SvelteKit Application

The SvelteKit frontend for **PlateShelf**, a Recipe Finder & Meal Planner. This app consumes [`@riolog/recipe-ui-kit`](https://www.npmjs.com/package/@riolog/recipe-ui-kit) — a StencilJS component library — as a published npm dependency.

🔗 **Live app:** https://plateshelf.vercel.app/

🔗 **Parent monorepo:** https://github.com/RIOLOG/recipe-project-NAGP

---

## Tech stack

- **SvelteKit** on **Svelte 5** (runes-based reactivity: `$state`, `$props`, `$effect`)
- **TypeScript**
- **@riolog/recipe-ui-kit** — published Stencil web component library (see [its README](../recipe-ui-kit/README.md))
- **TheMealDB** — free public recipe API
- **localStorage** — persistence for favorites, meal plan, and user-created recipes
- **@sveltejs/adapter-vercel** — deployment target

---

## Getting started

### Prerequisites
- Node.js 18.17+ (developed on Node 22)

### Install
```bash
npm install
```

### Run the dev server
```bash
npm run dev
```
App runs at **http://localhost:5173**.

### Type-check
```bash
npm run check
```

### Production build
```bash
npm run build
npm run preview
```
> **Windows only:** `adapter-vercel` uses filesystem symlinks during build, which requires Developer Mode enabled (Settings → Privacy & Security → For Developers) or an elevated terminal. Not an issue on Vercel's own Linux build servers — this only affects previewing a production build locally on Windows.

---

## Project structure

```text
recipe-finder/
├── src/
│   ├── hooks.client.ts          # Registers @riolog/recipe-ui-kit custom elements
│   ├── lib/
│   │   ├── api/
│   │   │   └── mealdb.ts        # TheMealDB API wrapper
│   │   │                         # (search, filter, categories, detail lookup)
│   │   └── stores/               # Svelte 5 rune-based state, backed by localStorage
│   │       ├── favorites.svelte.ts
│   │       ├── mealPlan.svelte.ts
│   │       └── userRecipes.svelte.ts
│   └── routes/
│       ├── +layout.svelte       # Header/footer app shell, global theming
│       │                         # (--ruk-* variables)
│       ├── +page.svelte         # Home: discovery, search, filter, my recipes
│       ├── favorites/
│       │   └── +page.svelte
│       ├── planner/
│       │   └── +page.svelte
│       └── recipes/
│           ├── new/
│           │   └── +page.svelte
│           └── [id]/
│               ├── +page.svelte # Recipe detail
│               └── edit/
│                   └── +page.svelte
```

## How `@riolog/recipe-ui-kit` is consumed

1. **Installed as a real npm dependency:**
```json
   "dependencies": { "@riolog/recipe-ui-kit": "^0.2.4" }
```
2. **Registered once, globally**, in `src/hooks.client.ts`:
```ts
   import '@riolog/recipe-ui-kit/components/recipe-card.js';
   import '@riolog/recipe-ui-kit/components/favorite-button.js';
   // ...one import per component used in the app
```
   Each import self-registers its custom element via `customElements.define()`.
3. **Used directly in `.svelte` templates** as HTML tags, with data passed via props and app logic wired to custom events:
```svelte
   <recipe-card
     recipeId={meal.id}
     cardTitle={meal.title}
     image={meal.image}
     isFavorite={favorites.isFavorite(meal.id)}
     oncardOpen={(e) => openRecipe(e.detail.recipeId)}
     onfavoriteToggle={() => favorites.toggle(meal)}
   >
     <span slot="footer">Tap to view full recipe</span>
   </recipe-card>
```
4. **Themed globally** — `--ruk-*` CSS custom properties are set once in `src/routes/+layout.svelte`'s `:root` block, restyling every component in the library to match the app's coral color palette.

---

## Notable implementation details

- **`ssr = false`** is set on routes that read `localStorage`-backed state (home, recipe detail, planner) — SvelteKit's server-side render runs before browser storage exists, so these routes are rendered client-side only to avoid a mismatch between server and client output on refresh.
- **Infinite scroll** on the home page uses an `IntersectionObserver` watching a sentinel element, rather than a manual "Load more" click.
- **User-created recipe IDs** are prefixed `user-` to avoid collisions with TheMealDB's numeric IDs, since both types of recipes can appear in the same routes/components.
- **Custom elements are imported individually** (not via the lazy-loader) — see the root README's "Assumptions" section for why.

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run check` | Type-check with `svelte-check` |