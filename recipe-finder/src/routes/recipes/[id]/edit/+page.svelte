<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { userRecipes } from '$lib/stores/userRecipes.svelte';
	import { error } from '@sveltejs/kit';
	import type { RecipeFormData } from '@riolog/recipe-ui-kit';

	const rawId = page.params.id;

	if (!rawId) {
		error(404, 'Recipe not found.');
	}

	const recipeId: string = rawId;
	const existing = userRecipes.getById(recipeId);

	if (!existing) {
		error(404, 'Recipe not found or you do not have permission to edit it.');
	}

	const initialData: RecipeFormData = {
		id: existing.id,
		title: existing.title,
		image: existing.image,
		category: existing.category,
		difficulty: existing.difficulty,
		ingredients: existing.ingredients,
		instructions: existing.instructions
	};

	function handleFormSubmit(e: CustomEvent<RecipeFormData>) {
		const data = e.detail;
		userRecipes.update(recipeId, {
			title: data.title,
			image: data.image,
			category: data.category,
			difficulty: data.difficulty,
			ingredients: data.ingredients,
			instructions: data.instructions
		});
		goto(`/recipes/${recipeId}`);
	}

	function handleFormCancel() {
		goto(`/recipes/${recipeId}`);
	}
</script>

<a href="/recipes/{recipeId}" class="back-link">← Back to recipe</a>
<h1>Edit Recipe</h1>

<recipe-form
	initialData={initialData}
	onformSubmit={handleFormSubmit}
	onformCancel={handleFormCancel}
></recipe-form>