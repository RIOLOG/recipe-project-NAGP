# @riolog/recipe-ui-kit

A framework-agnostic **StencilJS** web component library built for the [PlateShelf](https://plateshelf.vercel.app/) Recipe Finder & Meal Planner app. Published to npm and consumed by the [`recipe-finder`](../recipe-finder) SvelteKit application as a real dependency — not imported from source.

📦 **npm:** https://www.npmjs.com/package/@riolog/recipe-ui-kit

---

## Components

| Component | Description | Key props | Key events | Slots |
|---|---|---|---|---|
| `recipe-card` | Displays a recipe summary in a grid. Internally composes `favorite-button` and `rating-badge`. | `recipeId`, `cardTitle`, `image`, `category`, `isFavorite`, `isUserCreated`, `difficulty` | `cardOpen`, `favoriteToggle` | `footer` |
| `favorite-button` | Standalone favorite toggle, reusable inside cards or independently. | `active`, `size` (`sm`/`lg`) | `favoriteToggle` | — |
| `rating-badge` | Difficulty indicator (Easy/Medium/Hard). | `difficulty` | — | — |
| `recipe-search` | Search input with both debounced live search and submit-triggered search. | `value`, `placeholder`, `debounceMs` | `searchChange`, `searchSubmit` | — |
| `category-filter` | Row of selectable category chips. | `categories` (string[]), `activeCategory` | `filterChange` | — |
| `recipe-form` | Add/edit form with built-in validation. Only emits on a fully valid payload. | `initialData` | `formSubmit`, `formCancel` | `extra-fields` |
| `ingredient-list` | Renders a recipe's ingredient list. | `ingredients` | — | — |
| `meal-plan-slot` | A single day-cell for a weekly meal planner. | `day`, `assignedRecipe` | `slotAssignRequest`, `slotRemove` | — |

All components use **Shadow DOM** and are themeable via CSS custom properties prefixed `--ruk-*` (e.g. `--ruk-accent-color`, `--ruk-card-bg`, `--ruk-radius`), with sensible fallback defaults — consumers can restyle the entire library from a single `:root` block without touching component source.

---

## Installation

```bash
npm install @riolog/recipe-ui-kit
```

## Usage in a bundler-based app (Vite, webpack, etc.)

Import each component individually — this triggers self-registration via `customElements.define()` on import, and is fully compatible with bundler production builds:

```ts
import '@riolog/recipe-ui-kit/components/recipe-card.js';
import '@riolog/recipe-ui-kit/components/favorite-button.js';
// ...import any other components you use
```

Then use the tags directly in your markup:

```html
<recipe-card
  recipe-id="123"
  card-title="Pasta Primavera"
  image="/pasta.jpg"
></recipe-card>
```

> **Note:** the lazy-loader entry (`@riolog/recipe-ui-kit/loader`) is also published, but its internal dynamic `import()` calls are not reliably resolved by bundlers in a production build. Prefer the individual component imports shown above for bundler-based apps.

## Types

Shared TypeScript types (`RecipeSummary`, `Ingredient`, `MealPlanEntry`, `RecipeFormData`, etc.) are exported from the package root:

```ts
import type { RecipeSummary, RecipeFormData } from '@riolog/recipe-ui-kit';
```

---

## Local development

```bash
npm install
npm start      # dev server with live reload
npm run build  # production build
```

## Publishing

```bash
npm run build
npm publish
```

`publishConfig.access` is set to `public` in `package.json`, required since this is a scoped package (`@riolog/...`).

---

## License

MIT