<script lang="ts">
	import { goto } from '$app/navigation';
	import { favorites } from '$lib/stores/favorites.svelte';

	function openRecipe(id: string) {
		goto(`/recipes/${id}`);
	}
</script>

<a href="/" class="back-link">← Back to recipes</a>
<h1>My Favorites</h1>

{#if favorites.list.length === 0}
	<p>You haven't favorited any recipes yet. Browse recipes and tap the heart to save them here.</p>
{:else}
	<div class="grid">
		{#each favorites.list as meal (meal.id)}
			<div class="card">
				<button class="card__body" onclick={() => openRecipe(meal.id)}>
					<img src={meal.image} alt={meal.title} />
					<h3>{meal.title}</h3>
				</button>
				<button class="fav-btn active" onclick={() => favorites.remove(meal.id)} aria-label="Remove favorite">
					♥
				</button>
			</div>
		{/each}
	</div>
{/if}

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 16px;
		margin-top: 16px;
	}
	.card {
		position: relative;
		border: 1px solid #ddd;
		border-radius: 10px;
		overflow: hidden;
		background: white;
	}
	.card__body {
		width: 100%;
		border: none;
		background: none;
		cursor: pointer;
		padding: 0;
		text-align: left;
	}
	.card__body img {
		width: 100%;
		height: 140px;
		object-fit: cover;
		display: block;
	}
	.card__body h3 {
		font-size: 0.95rem;
		margin: 8px 10px 10px;
	}
	.fav-btn {
		position: absolute;
		top: 8px;
		right: 8px;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: none;
		background: rgba(255, 255, 255, 0.9);
		cursor: pointer;
		color: #e0245e;
		font-size: 1.1rem;
	}
</style>