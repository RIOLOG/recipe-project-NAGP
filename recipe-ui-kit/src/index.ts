/**
 * @fileoverview entry point for the recipe-ui-kit component library
 *
 * Re-exports shared TypeScript types so the consuming app (SvelteKit) can
 * import them for typing event payloads and props, e.g.:
 *   import type { RecipeSummary } from '@riolog/recipe-ui-kit/dist/types';
 *
 * Components themselves are NOT exported from here — consumers should use
 * the custom-elements bundle as documented in the README (defineCustomElements).
 */

export type * from './components.d.ts';
export * from './global/types';