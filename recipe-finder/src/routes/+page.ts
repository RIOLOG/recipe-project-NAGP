import type { PageLoad } from './$types';
import { getCategories, getMealsByCategory } from '$lib/api/mealdb';

// Runs on the server during SSR and again on client-side navigation —
// SvelteKit's standard way to fetch data before a page renders.
export const ssr = false;

export const load: PageLoad = async () => {
	const [categories, initialMeals] = await Promise.all([
		getCategories(),
		getMealsByCategory('Chicken')
	]);

	return {
		categories,
		initialMeals
	};
};