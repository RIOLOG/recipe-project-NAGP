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

<section class="hero">
	<h1>Find your next favorite recipe</h1>
	<p class="hero__subtitle">Search thousands of recipes, save favorites, and plan your week.</p>
</section>


<recipe-search
	class="search-bar"
	value={searchQuery}
	placeholder="Search recipes…"
	onsearchSubmit={(e: CustomEvent<{ query: string }>) => {
		searchQuery = e.detail.query;
		handleSearch();
	}}
></recipe-search>

<category-filter
	class="filter-category"
	categories={data.categories}
	activeCategory={activeCategory}
	onfilterChange={(e: CustomEvent<{ category: string }>) => handleCategoryClick(e.detail.category)}
></category-filter>

{#if (searchQuery.trim() || activeCategory ? matchedUserRecipes : userRecipes.list).length > 0}
	<section class="my-recipes">

		<h2 class="section-title">📖 My Recipes</h2>

		<div class="grid">
			{#each (searchQuery.trim() || activeCategory ? matchedUserRecipes : userRecipes.list) as recipe (recipe.id)}
				<recipe-card
					recipeId={recipe.id}
					cardTitle={recipe.title}
					image={recipe.image}
					category={recipe.category}
					isFavorite={favorites.isFavorite(recipe.id)}
					isUserCreated={true}
					difficulty={recipe.difficulty}
					oncardOpen={(e: CustomEvent<{ recipeId: string }>) => openRecipe(e.detail.recipeId)}
					onfavoriteToggle={() =>
						favorites.toggle({
							id: recipe.id,
							title: recipe.title,
							image: recipe.image,
							category: recipe.category
						})}
				></recipe-card>
			{/each}
		</div>
	</section>
{/if}

{#if loading}
	<div class="state-msg">Loading recipes…</div>
{:else if errorMessage}
	<div class="state-msg state-msg--error">{errorMessage}</div>
{:else if meals.length === 0}
	<div class="state-msg">No recipes found. Try a different search or category.</div>
{:else}
	<div class="grid">
		{#each meals as meal (meal.id)}
			<recipe-card
				recipeId={meal.id}
				cardTitle={meal.title}
				image={meal.image}
				category={meal.category}
				isFavorite={favorites.isFavorite(meal.id)}
				oncardOpen={(e: CustomEvent<{ recipeId: string }>) => openRecipe(e.detail.recipeId)}
				onfavoriteToggle={(e: CustomEvent<{ recipeId: string; nextValue: boolean }>) =>
					favorites.toggle(meal)}
			>
				<span slot="footer" class="footer-hint">Tap to view full recipe</span>
			</recipe-card>
		{/each}
	</div>
{/if}

<style>
	nav {
		display: flex;
		gap: 12px;
		margin-bottom: 16px;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 16px;
	}
	.search-bar {
		display: block;
		margin-bottom: 12px;
		min-height: 44px;
	}
	.filter-category {
		margin-bottom: 16px;
	}
	.error {
		color: #c0342c;
	}
	.footer-hint {
		font-size: 0.75rem;
		color: #999;
	}

	.my-recipes .grid {
		grid-template-columns: repeat(auto-fill, minmax(200px, 220px));
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
	.hero {
		text-align: center;
		padding: 32px 0 28px;
	}

	.hero h1 {
		font-size: 2.1rem;
		margin: 0 0 8px;
		color: #1a1a1a;
	}

	.hero__subtitle {
		font-size: 1rem;
		color: #777;
		margin: 0;
	}

	.section-title {
		font-size: 1.15rem;
		margin-bottom: 12px;
	}

	.state-msg {
		text-align: center;
		padding: 40px 20px;
		color: #888;
		font-size: 0.95rem;
		background: white;
		border-radius: 12px;
		border: 1px solid #eee;
	}

	.state-msg--error {
		color: #c0342c;
		border-color: #f3d3d0;
		background: #fdf3f2;
	}
</style>