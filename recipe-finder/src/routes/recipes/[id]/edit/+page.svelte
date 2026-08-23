<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { userRecipes } from '$lib/stores/userRecipes.svelte';
	import { error } from '@sveltejs/kit';

	const recipeId = page.params.id;
	const existing = userRecipes.getById(recipeId);

	if (!existing) {
		error(404, 'Recipe not found or you do not have permission to edit it.');
	}

	let title = $state(existing.title);
	let image = $state(existing.image);
	let category = $state(existing.category);
	let difficulty = $state<'easy' | 'medium' | 'hard'>(existing.difficulty);
	let ingredientsText = $state(existing.ingredients.map((i) => i.name).join('\n'));
	let instructions = $state(existing.instructions);

	interface FormErrors {
		title?: string;
		image?: string;
		category?: string;
		ingredients?: string;
		instructions?: string;
	}
	let errors = $state<FormErrors>({});

	function parseIngredients() {
		return ingredientsText
			.split('\n')
			.map((line) => line.trim())
			.filter(Boolean)
			.map((line) => ({ name: line }));
	}

	function validate(ingredients: { name: string }[]): FormErrors {
		const e: FormErrors = {};
		if (!title.trim()) e.title = 'Title is required.';
		if (!image.trim()) e.image = 'Image URL is required.';
		if (!category.trim()) e.category = 'Category is required.';
		if (ingredients.length === 0) e.ingredients = 'Add at least one ingredient (one per line).';
		if (!instructions.trim() || instructions.trim().length < 10) {
			e.instructions = 'Instructions should be at least 10 characters.';
		}
		return e;
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		const ingredients = parseIngredients();
		const validationErrors = validate(ingredients);
		errors = validationErrors;
		if (Object.keys(validationErrors).length > 0) return;

		userRecipes.update(recipeId, {
			title: title.trim(),
			image: image.trim(),
			category: category.trim(),
			difficulty,
			ingredients,
			instructions: instructions.trim()
		});

		goto(`/recipes/${recipeId}`);
	}
</script>

<a href="/recipes/{recipeId}">← Back to recipe</a>
<h1>Edit Recipe</h1>

<form onsubmit={handleSubmit}>
	<label>
		<span>Title</span>
		<input type="text" bind:value={title} />
		{#if errors.title}<small class="error">{errors.title}</small>{/if}
	</label>

	<label>
		<span>Image URL</span>
		<input type="text" bind:value={image} />
		{#if errors.image}<small class="error">{errors.image}</small>{/if}
	</label>

	<label>
		<span>Category</span>
		<input type="text" bind:value={category} />
		{#if errors.category}<small class="error">{errors.category}</small>{/if}
	</label>

	<label>
		<span>Difficulty</span>
		<select bind:value={difficulty}>
			<option value="easy">Easy</option>
			<option value="medium">Medium</option>
			<option value="hard">Hard</option>
		</select>
	</label>

	<label>
		<span>Ingredients (one per line)</span>
		<textarea rows="5" bind:value={ingredientsText}></textarea>
		{#if errors.ingredients}<small class="error">{errors.ingredients}</small>{/if}
	</label>

	<label>
		<span>Instructions</span>
		<textarea rows="6" bind:value={instructions}></textarea>
		{#if errors.instructions}<small class="error">{errors.instructions}</small>{/if}
	</label>

	<div class="actions">
		<button type="button" onclick={() => goto(`/recipes/${recipeId}`)}>Cancel</button>
		<button type="submit" class="primary">Save changes</button>
	</div>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 14px;
		max-width: 500px;
		margin-top: 16px;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: 0.85rem;
	}
	input,
	select,
	textarea {
		padding: 8px 10px;
		border-radius: 8px;
		border: 1px solid #ddd;
		font-family: inherit;
		font-size: 0.95rem;
	}
	.error {
		color: #c0342c;
	}
	.actions {
		display: flex;
		gap: 10px;
		justify-content: flex-end;
	}
	.actions button {
		padding: 9px 18px;
		border-radius: 8px;
		border: 1px solid #ddd;
		background: white;
		cursor: pointer;
	}
	.actions .primary {
		background: #4a6fff;
		border-color: #4a6fff;
		color: white;
		font-weight: 600;
	}
</style>