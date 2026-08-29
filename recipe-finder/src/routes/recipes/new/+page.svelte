<script lang="ts">
	import { goto } from '$app/navigation';
	import { userRecipes } from '$lib/stores/userRecipes.svelte';
	import type { RecipeFormData } from '@riolog/recipe-ui-kit';

	function handleFormSubmit(e: CustomEvent<RecipeFormData>) {
		const data = e.detail;
		const recipe = userRecipes.create({
			title: data.title,
			image: data.image,
			category: data.category,
			difficulty: data.difficulty,
			ingredients: data.ingredients,
			instructions: data.instructions
		});
		goto(`/recipes/${recipe.id}`);
	}

	function handleFormCancel() {
		goto('/');
	}
</script>

<a href="/" class="back-link">← Back to recipes</a>
<h1>Add New Recipe</h1>

<recipe-form onformSubmit={handleFormSubmit} onformCancel={handleFormCancel}></recipe-form>