<script lang="ts">
	import { mealPlan, DAYS, MEAL_TYPES, type DayOfWeek, type MealType } from '$lib/stores/mealPlan.svelte';
	import { searchMeals } from '$lib/api/mealdb';
	import { userRecipes } from '$lib/stores/userRecipes.svelte';
	import type { MealSummary } from '$lib/api/mealdb';

	let pickerOpenFor = $state<{ day: DayOfWeek; mealType: MealType } | null>(null);
	let pickerQuery = $state('');
	let pickerResults = $state<MealSummary[]>([]);
	let pickerUserResults = $state<typeof userRecipes.list>([]);
	let pickerLoading = $state(false);
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	function openPicker(day: DayOfWeek, mealType: MealType) {
		pickerOpenFor = { day, mealType };
		pickerQuery = '';
		pickerResults = [];
		pickerUserResults = [];
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
			mealPlan.assign(pickerOpenFor.day, pickerOpenFor.mealType, meal);
		}
		closePicker();
	}

	const mealTypeIcon: Record<MealType, string> = {
		Breakfast: '🍳',
		Lunch: '🥪',
		Dinner: '🍝'
	};
</script>

<a href="/" class="back-link">← Back to recipes</a>
<h1>Weekly Meal Planner</h1>

<div class="week-grid">
	{#each DAYS as day}
		<div class="day-column">
			<div class="day-column__header">{day}</div>
			{#each MEAL_TYPES as mealType}
				<div class="meal-slot">
					<div class="meal-slot__label">{mealTypeIcon[mealType]} {mealType}</div>
					{#if mealPlan.plan[day][mealType]}
						<div class="meal-slot__filled">
							<img
								src={mealPlan.plan[day][mealType]?.image}
								alt={mealPlan.plan[day][mealType]?.title}
							/>
							<span class="meal-slot__title">{mealPlan.plan[day][mealType]?.title}</span>
							<button
								class="meal-slot__remove"
								onclick={() => mealPlan.remove(day, mealType)}
								aria-label="Remove"
							>
								×
							</button>
						</div>
					{:else}
						<button class="meal-slot__empty" onclick={() => openPicker(day, mealType)}>
							+ Add
						</button>
					{/if}
				</div>
			{/each}
		</div>
	{/each}
</div>

{#if pickerOpenFor}
	<div
		class="picker-overlay"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onclick={closePicker}
		onkeydown={(e) => e.key === 'Escape' && closePicker()}
	>
		<div
			class="picker"
			role="document"
			onclick={(e) => e.stopPropagation()}
		>
			<h2>
				Choose a recipe — {pickerOpenFor.day} · {mealTypeIcon[pickerOpenFor.mealType]}
				{pickerOpenFor.mealType}
			</h2>
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
		grid-template-columns: repeat(7, minmax(150px, 1fr));
		gap: 12px;
		margin-top: 16px;
		overflow-x: auto;
	}
	.day-column {
		display: flex;
		flex-direction: column;
		gap: 8px;
		border: 1px solid #e2e2e2;
		border-radius: 12px;
		padding: 10px;
		background: white;
	}
	.day-column__header {
		font-size: 0.85rem;
		font-weight: 700;
		text-align: center;
		padding-bottom: 6px;
		border-bottom: 1px solid #eee;
	}
	.meal-slot {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.meal-slot__label {
		font-size: 0.7rem;
		font-weight: 600;
		color: #888;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}
	.meal-slot__empty {
		border: 1px dashed #ddd;
		border-radius: 8px;
		background: #fafafa;
		color: #4a6fff;
		font-size: 0.78rem;
		padding: 10px 4px;
		cursor: pointer;
	}
	.meal-slot__empty:hover {
		background: #f0f2ff;
	}
	.meal-slot__filled {
		position: relative;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid #eee;
	}
	.meal-slot__filled img {
		width: 100%;
		height: 54px;
		object-fit: cover;
		display: block;
	}
	.meal-slot__title {
		display: block;
		font-size: 0.72rem;
		font-weight: 600;
		padding: 4px 6px;
		background: white;
	}
	.meal-slot__remove {
		position: absolute;
		top: 4px;
		right: 4px;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: none;
		background: rgba(0, 0, 0, 0.6);
		color: white;
		font-size: 0.75rem;
		cursor: pointer;
		line-height: 1;
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
	.picker h2 {
		font-size: 1.05rem;
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