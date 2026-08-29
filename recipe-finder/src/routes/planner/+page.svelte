<script lang="ts">
	import { mealPlan, DAYS, type DayOfWeek } from '$lib/stores/mealPlan.svelte';
	import { searchMeals } from '$lib/api/mealdb';
	import type { MealSummary } from '$lib/api/mealdb';
	import { userRecipes } from '$lib/stores/userRecipes.svelte';

	let pickerOpenFor = $state<DayOfWeek | null>(null);
	let pickerQuery = $state('');
	let pickerResults = $state<MealSummary[]>([]);
	let pickerLoading = $state(false);
	let pickerUserResults = $state<typeof userRecipes.list>([]);
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	function openPicker(day: DayOfWeek) {
		pickerOpenFor = day;
		pickerQuery = '';
		pickerResults = [];
	}

	function closePicker() {
		pickerOpenFor = null;
	}

	async function runPickerSearch() {
		if (!pickerQuery.trim()) {
			pickerResults = [];
			pickerUserResults = [];
			return;
		}
		pickerLoading = true;
		try {
			const q = pickerQuery.toLowerCase();
			pickerResults = await searchMeals(pickerQuery);
			pickerUserResults = userRecipes.list.filter(
				(r) => r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
			);
		} finally {
			pickerLoading = false;
		}
	}

	function assignMeal(meal: MealSummary) {
		if (pickerOpenFor) {
			mealPlan.assign(pickerOpenFor, meal);
		}
		closePicker();
	}
</script>

<a href="/" class="back-link">← Back to recipes</a>
<h1>Weekly Meal Planner</h1>

<div class="week-grid">
	{#each DAYS as day}
		<meal-plan-slot
			day={day}
			assignedRecipe={mealPlan.plan[day]}
			onslotAssignRequest={(e: CustomEvent<{ day: string }>) => openPicker(e.detail.day as DayOfWeek)}
			onslotRemove={(e: CustomEvent<{ day: string; recipeId: string }>) =>
				mealPlan.remove(e.detail.day as DayOfWeek)}
		></meal-plan-slot>
	{/each}
</div>



{#if pickerOpenFor}
	<div class="picker-overlay" onclick={closePicker}>
		<div class="picker" onclick={(e) => e.stopPropagation()}>
			<h2>Choose a recipe for {pickerOpenFor}</h2>
			<form
				onsubmit={(e) => {
					e.preventDefault();
					runPickerSearch();
				}}
			>
				<input
					type="search"
					placeholder="Search recipes…"
					bind:value={pickerQuery}
					oninput={() => {
						if (debounceTimer) clearTimeout(debounceTimer);
						debounceTimer = setTimeout(() => runPickerSearch(), 350);
					}}
					autofocus
				/>
				<button type="submit">Search</button>
				
			</form>

		{#if pickerLoading}
			<p>Searching…</p>
		{:else if pickerResults.length > 0 || pickerUserResults.length > 0}
			<div class="picker__results">
				{#each pickerUserResults as recipe (recipe.id)}
					<button class="picker__result" onclick={() => assignMeal(recipe)}>
						<img src={recipe.image} alt={recipe.title} />
						<span>{recipe.title} (yours)</span>
					</button>
				{/each}
				{#each pickerResults as meal (meal.id)}
					<button class="picker__result" onclick={() => assignMeal(meal)}>
						<img src={meal.image} alt={meal.title} />
						<span>{meal.title}</span>
					</button>
				{/each}
			</div>
		{:else if pickerQuery.trim()}
			<p>No results. Try another search.</p>
		{/if}

			<button class="picker__close" onclick={closePicker}>Cancel</button>
		</div>
	</div>
{/if}

<style>
	.week-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 12px;
		margin-top: 16px;
	}
	.slot {
		border: 1px solid #ddd;
		border-radius: 10px;
		overflow: hidden;
		min-height: 160px;
		display: flex;
		flex-direction: column;
	}
	.slot__day {
		padding: 8px 10px;
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		color: #666;
		border-bottom: 1px solid #eee;
	}
	.slot__empty {
		flex: 1;
		border: none;
		background: none;
		color: #4a6fff;
		cursor: pointer;
		font-size: 0.85rem;
	}
	.slot__filled {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.slot__filled img {
		width: 100%;
		height: 80px;
		object-fit: cover;
	}
	.slot__title {
		padding: 8px;
		font-size: 0.85rem;
		font-weight: 600;
	}
	.slot__remove {
		position: absolute;
		top: 6px;
		right: 6px;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		border: none;
		background: rgba(0, 0, 0, 0.55);
		color: white;
		cursor: pointer;
	}
	.picker-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
	}
	.picker {
		background: white;
		border-radius: 12px;
		padding: 20px;
		width: min(500px, 90vw);
		max-height: 80vh;
		overflow-y: auto;
	}
	.picker form {
		display: flex;
		gap: 8px;
		margin-bottom: 12px;
	}
	.picker__results {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.picker__result {
		display: flex;
		align-items: center;
		gap: 10px;
		border: 1px solid #eee;
		border-radius: 8px;
		padding: 6px;
		background: none;
		cursor: pointer;
		text-align: left;
	}
	.picker__result img {
		width: 44px;
		height: 44px;
		border-radius: 6px;
		object-fit: cover;
	}
	.picker__close {
		margin-top: 12px;
		background: none;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 6px 14px;
		cursor: pointer;
	}
</style>