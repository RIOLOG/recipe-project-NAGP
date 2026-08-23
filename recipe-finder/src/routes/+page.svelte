<script lang="ts">
	import { goto } from '$app/navigation';
	import { searchMeals, getMealsByCategory } from '$lib/api/mealdb';
	import type { MealSummary } from '$lib/api/mealdb';
	import type { PageProps } from './$types';
	import { favorites } from '$lib/stores/favorites.svelte';
	import { userRecipes } from '$lib/stores/userRecipes.svelte';


	let { data }: PageProps = $props();

	let searchQuery = $state('');
	let activeCategory = $state('');
	let meals = $state<MealSummary[]>(data.initialMeals);
	let loading = $state(false);
	let errorMessage = $state('');
	let matchedUserRecipes = $state<typeof userRecipes.list>([]);


	function matchesUserRecipes(query: string) {
		const q = query.toLowerCase();
		return userRecipes.list.filter(
			(r) => r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
		);
	}

	async function handleSearch() {
		loading = true;
		errorMessage = '';
		try {
			if (searchQuery.trim()) {
				const apiResults = await searchMeals(searchQuery);
				meals = apiResults;
				matchedUserRecipes = matchesUserRecipes(searchQuery);
				activeCategory = '';
			} else if (activeCategory) {
				meals = await getMealsByCategory(activeCategory);
				matchedUserRecipes = userRecipes.list.filter((r) => r.category === activeCategory);
			} else {
				meals = data.initialMeals;
				matchedUserRecipes = [];
			}
		} catch (err) {
			errorMessage = 'Something went wrong fetching recipes. Please try again.';
		} finally {
			loading = false;
		}
	}

	async function handleCategoryClick(category: string) {
		activeCategory = category;
		searchQuery = '';
		loading = true;
		errorMessage = '';
		try {
			if (category) {
				meals = await getMealsByCategory(category);
				matchedUserRecipes = userRecipes.list.filter((r) => r.category === category);
			} else {
				meals = data.initialMeals;
				matchedUserRecipes = [];
			}
		} catch (err) {
			errorMessage = 'Something went wrong fetching recipes. Please try again.';
		} finally {
			loading = false;
		}
	}

	function openRecipe(id: string) {
		goto(`/recipes/${id}`);
	}
</script>

<h1>Recipe Finder & Meal Planner</h1>

<nav>
	<a href="/favorites">Favorites</a>
	<a href="/planner">Meal Planner</a>
	<a href="/recipes/new">Add Recipe</a>
</nav>

<form
	onsubmit={(e) => {
		e.preventDefault();
		handleSearch();
	}}
>
	<input type="search" placeholder="Search recipes…" bind:value={searchQuery} />
	<button type="submit">Search</button>
</form>

<div class="filters">
	<button onclick={() => handleCategoryClick('')} class:active={activeCategory === ''}>
		All
	</button>
	{#each data.categories as category}
		<button onclick={() => handleCategoryClick(category)} class:active={activeCategory === category}>
			{category}
		</button>
	{/each}
</div>

{#if (searchQuery.trim() || activeCategory ? matchedUserRecipes : userRecipes.list).length > 0}
	<section class="my-recipes">
		<h2>My Recipes</h2>
		<div class="grid">
			{#each (searchQuery.trim() || activeCategory ? matchedUserRecipes : userRecipes.list) as recipe (recipe.id)}
				<div class="card">
				<button class="card__body" onclick={() => openRecipe(recipe.id)}>
					<img src={recipe.image} alt={recipe.title} />
					<h3>{recipe.title}</h3>
					<span class="tag tag--{recipe.difficulty}">{recipe.difficulty}</span>
				</button>
				<button
					class="fav-btn"
					class:active={favorites.isFavorite(recipe.id)}
					onclick={() =>
						favorites.toggle({
							id: recipe.id,
							title: recipe.title,
							image: recipe.image,
							category: recipe.category
						})}
					aria-label="Toggle favorite"
				>
					♥
				</button>
			</div>
			{/each}
		</div>
	</section>
{/if}

{#if loading}
	<p>Loading…</p>
{:else if errorMessage}
	<p class="error">{errorMessage}</p>
{:else if meals.length === 0}
	<p>No recipes found. Try a different search.</p>
{:else}
	<div class="grid">
		{#each meals as meal (meal.id)}
			<div class="card">
				<button class="card__body" onclick={() => openRecipe(meal.id)}>
					<img src={meal.image} alt={meal.title} />
					<h3>{meal.title}</h3>
					{#if meal.category}<span class="tag">{meal.category}</span>{/if}
				</button>
				<button
					class="fav-btn"
					class:active={favorites.isFavorite(meal.id)}
					onclick={() => favorites.toggle(meal)}
					aria-label="Toggle favorite"
				>
					♥
				</button>
			</div>
		{/each}
	</div>
{/if}

<style>
	nav {
		display: flex;
		gap: 12px;
		margin-bottom: 16px;
	}
	form {
		display: flex;
		gap: 8px;
		margin-bottom: 12px;
	}
	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 20px;
	}
	.filters button.active {
		background: #4a6fff;
		color: white;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 16px;
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
	.card img {
		width: 100%;
		height: 140px;
		object-fit: cover;
		display: block;
	}
	.card h3 {
		font-size: 0.95rem;
		margin: 8px 10px 4px;
	}
	.tag {
		font-size: 0.75rem;
		color: #666;
		margin: 0 10px 10px;
		display: inline-block;
	}
	.error {
		color: #c0342c;
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
		color: #999;
		font-size: 1.1rem;
	}
	.fav-btn.active {
		color: #e0245e;
	}

	.my-recipes {
	margin-bottom: 24px;
	}
	.my-recipes h2 {
		font-size: 1.1rem;
		margin-bottom: 10px;
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

</style>