<script lang="ts">
	import { goto } from '$app/navigation';
	import { userRecipes } from '$lib/stores/userRecipes.svelte';
	import { favorites } from '$lib/stores/favorites.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const meal = data.meal;
	let showDeleteConfirm = $state(false);

	function confirmDelete() {
		userRecipes.remove(meal.id);
		favorites.remove(meal.id);
		goto('/');
	}
</script>

<a href="/" class="back-link">← Back to recipes</a>

<div class="detail-hero">
	<img src={meal.image} alt={meal.title} class="detail-hero__image" />
	<div class="detail-hero__overlay"></div>
	<div class="detail-hero__content">
		<div class="detail-hero__badges">
			{#if meal.category}<span class="tag">{meal.category}</span>{/if}
			{#if meal.area}<span class="tag">{meal.area}</span>{/if}
			{#if data.isUserCreated && data.difficulty}
				<span class="tag tag--{data.difficulty}">{data.difficulty}</span>
			{/if}
		</div>
		<div class="detail-hero__title-row">
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
	</div>
</div>

{#if data.isUserCreated}
	<div class="owner-actions">
		<a href="/recipes/{meal.id}/edit" class="btn">✏️ Edit Recipe</a>
		<button class="btn btn--danger" onclick={() => (showDeleteConfirm = true)}>🗑️ Delete Recipe</button>
	</div>
{/if}

<div class="detail-body">
	<section class="detail-section">
		<h2>🧂 Ingredients</h2>
		<ingredient-list ingredients={meal.ingredients}></ingredient-list>
	</section>

	<section class="detail-section detail-section--instructions">
		<h2>👩‍🍳 Instructions</h2>
		<p class="instructions">{meal.instructions}</p>
	</section>
</div>

{#if showDeleteConfirm}
	<div
		class="modal-overlay"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onclick={() => (showDeleteConfirm = false)}
		onkeydown={(e) => e.key === 'Escape' && (showDeleteConfirm = false)}
	>
		<div class="modal" role="document" onclick={(e) => e.stopPropagation()}>
			<h3>Delete this recipe?</h3>
			<p>"{meal.title}" will be permanently removed. This cannot be undone.</p>
			<div class="modal-actions">
				<button class="btn" onclick={() => (showDeleteConfirm = false)}>Cancel</button>
				<button class="btn btn--danger btn--solid" onclick={confirmDelete}>Delete</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.detail-hero {
		position: relative;
		border-radius: 16px;
		overflow: hidden;
		margin-top: 8px;
		min-height: 280px;
		display: flex;
		align-items: flex-end;
	}

	.detail-hero__image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.detail-hero__overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.15) 55%, transparent 100%);
	}

	.detail-hero__content {
		position: relative;
		padding: 24px;
		width: 100%;
		color: white;
	}

	.detail-hero__badges {
		display: flex;
		gap: 8px;
		margin-bottom: 10px;
		flex-wrap: wrap;
	}

	.tag {
		font-size: 0.78rem;
		background: rgba(255, 255, 255, 0.85);
		padding: 4px 12px;
		border-radius: 999px;
		color: #2D2A26;
		text-transform: capitalize;
		font-weight: 600;
	}

	.tag--easy {
		background: #d4f5dd;
		color: #1e7d3c;
	}
	.tag--medium {
		background: #ffe9c2;
		color: #9a6a00;
	}
	.tag--hard {
		background: #ffd6d1;
		color: #b3261e;
	}

	.detail-hero__title-row {
		display: flex;
		align-items: center;
		gap: 14px;
		flex-wrap: wrap;
	}

	.detail-hero__title-row h1 {
		margin: 0;
		font-size: clamp(1.6rem, 4vw, 2.4rem);
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
	}

	.owner-actions {
		display: flex;
		gap: 10px;
		margin-top: 16px;
	}

	.btn {
		padding: 8px 16px;
		border-radius: 999px;
		border: 1px solid #F0E6DE;
		background: white;
		cursor: pointer;
		text-decoration: none;
		color: #2D2A26;
		font-size: 0.85rem;
		font-weight: 600;
	}

	.btn:hover {
		background: #FFF9F5;
	}

	.btn--danger {
		border-color: #FFD6D1;
		color: #B3261E;
	}

	.btn--danger:hover {
		background: #FFF3F1;
	}

	.detail-body {
		display: grid;
		grid-template-columns: 1fr 1.4fr;
		gap: 28px;
		margin-top: 28px;
	}

	.detail-section {
		background: white;
		border: 1px solid #F0E6DE;
		border-radius: 14px;
		padding: 20px;
	}

	.detail-section h2 {
		margin: 0 0 14px;
		font-size: 1.05rem;
	}

	.instructions {
		white-space: pre-line;
		line-height: 1.75;
		color: #4A4540;
		font-size: 0.95rem;
	}

	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.45);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}

	.modal {
		background: white;
		border-radius: 14px;
		padding: 24px;
		width: min(380px, 90vw);
	}

	.modal h3 {
		margin: 0 0 8px;
		font-size: 1.1rem;
	}

	.modal p {
		margin: 0 0 20px;
		color: #8A8580;
		font-size: 0.9rem;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
	}

	.btn--solid {
		background: #E0342C;
		border-color: #E0342C;
		color: white;
	}

	.btn--solid:hover {
		background: #C42C24;
	}

	@media (max-width: 720px) {
		.detail-body {
			grid-template-columns: 1fr;
		}
	}
</style>