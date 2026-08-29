<script lang="ts">

	import { goto } from '$app/navigation';
	import { userRecipes } from '$lib/stores/userRecipes.svelte';
	import type { PageProps } from './$types';
	import { favorites } from '$lib/stores/favorites.svelte';


	let { data }: PageProps = $props();
	const meal = data.meal;

	function handleDelete() {
		if (confirm('Delete this recipe? This cannot be undone.')) {
			userRecipes.remove(meal.id);
			favorites.remove(meal.id); // clean up orphaned favorite, if any
			goto('/');
		}
	}

</script>

<a href="/" class="back-link">← Back to recipes</a>

<div class="detail">
	<img src={meal.image} alt={meal.title} />

	<div class="info">

		<div class="header">
		<div class="title-row">
			<h1>{meal.title}</h1>
			<favorite-button
				size="lg"
				active={favorites.isFavorite(meal.id)}
				onfavoriteToggle={() =>
					favorites.toggle({
						id: meal.id,
						title: meal.title,
						image: meal.image,
						category: meal.category
					})}
			></favorite-button>
		</div>
			{#if data.isUserCreated}
				<div class="owner-actions">
					<a href="/recipes/{meal.id}/edit" class="btn">Edit</a>
					<button class="btn btn--danger" onclick={handleDelete}>Delete</button>
				</div>
			{/if}
		</div>

		<div class="meta">
			{#if meal.category}<span class="tag">{meal.category}</span>{/if}
			{#if meal.area}<span class="tag">{meal.area}</span>{/if}
			{#if data.isUserCreated && data.difficulty}
				<span class="tag tag--{data.difficulty}">{data.difficulty}</span>
			{/if}
		</div>

		<h2>Ingredients</h2>

			<ingredient-list ingredients={meal.ingredients}></ingredient-list>

		<h2>Instructions</h2>
		<p class="instructions">{meal.instructions}</p>
	</div>
</div>

<style>
	.detail {
		display: grid;
		grid-template-columns: 300px 1fr;
		gap: 24px;
		margin-top: 16px;
	}
	.detail img {
		width: 100%;
		border-radius: 12px;
		object-fit: cover;
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 12px;
	}
	.owner-actions {
		display: flex;
		gap: 8px;
		flex-shrink: 0;
	}
	.btn {
		padding: 6px 14px;
		border-radius: 8px;
		border: 1px solid #ddd;
		background: white;
		cursor: pointer;
		text-decoration: none;
		color: #333;
		font-size: 0.85rem;
	}
	.btn--danger {
		border-color: #c0342c;
		color: #c0342c;
	}
	.meta {
		display: flex;
		gap: 8px;
		margin-bottom: 16px;
	}
	.tag {
		font-size: 0.8rem;
		background: #f2f2f2;
		padding: 3px 10px;
		border-radius: 999px;
		color: #666;
		text-transform: capitalize;
	}
	.tag--easy {
		background: #e3f6e8;
		color: #1e7d3c;
	}
	.tag--medium {
		background: #fff3d9;
		color: #9a6a00;
	}
	.tag--hard {
		background: #fde3e3;
		color: #b3261e;
	}
	.ingredients {
		list-style: none;
		padding: 0;
	}
	.ingredients li {
		padding: 6px 0;
		border-bottom: 1px solid #eee;
	}
	.instructions {
		white-space: pre-line;
		line-height: 1.6;
	}
	.title-row {
		display: flex;
		align-items: center;
		gap: 10px;
	}
</style>