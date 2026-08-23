import type { PageLoad } from './$types';
import { getMealById } from '$lib/api/mealdb';
import { userRecipes } from '$lib/stores/userRecipes.svelte';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
	// User-created recipes are prefixed with 'user-' (see generateId() in
	// userRecipes.svelte.ts) — check that first since it's a local lookup,
	// no network call needed.
	if (params.id.startsWith('user-')) {
		const recipe = userRecipes.getById(params.id);
		if (!recipe) {
			error(404, 'Recipe not found');
		}
		return {
			meal: {
				id: recipe.id,
				title: recipe.title,
				image: recipe.image,
				category: recipe.category,
				area: undefined,
				instructions: recipe.instructions,
				ingredients: recipe.ingredients
			},
			isUserCreated: true,
			difficulty: recipe.difficulty
		};
	}

	// Otherwise, treat it as a TheMealDB recipe.
	const meal = await getMealById(params.id);
	if (!meal) {
		error(404, 'Recipe not found');
	}
	return { meal, isUserCreated: false, difficulty: undefined };
};