<script lang="ts">
	import { mealPlan, DAYS, type DayOfWeek } from '$lib/stores/mealPlan.svelte';
	import { searchMeals } from '$lib/api/mealdb';
	import type { MealSummary } from '$lib/api/mealdb';

	let pickerOpenFor = $state<DayOfWeek | null>(null);
	let pickerQuery = $state('');
	let pickerResults = $state<MealSummary[]>([]);
	let pickerLoading = $state(false);

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
			return;
		}
		pickerLoading = true;
		try {
			pickerResults = await searchMeals(pickerQuery);
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

<a href="/">← Back to recipes</a>
<h1>Weekly Meal Planner</h1>

<div class="week-grid">
	{#each DAYS as day}
		<div class="slot">
			<div class="slot__day">{day}</div>
			{#if mealPlan.plan[day]}
				<div class="slot__filled">
					<img src={mealPlan.plan[day]?.image} alt={mealPlan.plan[day]?.title} />
					<span class="slot__title">{mealPlan.plan[day]?.title}</span>
					<button class="slot__remove" onclick={() => mealPlan.remove(day)} aria-label="Remove">×</button>
				</div>
			{:else}
				<button class="slot__empty" onclick={() => openPicker(day)}>+ Add recipe</button>
			{/if}
		</div>
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
				<input type="search" placeholder="Search recipes…" bind:value={pickerQuery} autofocus />
				<button type="submit">Search</button>
			</form>

			{#if pickerLoading}
				<p>Searching…</p>
			{:else if pickerResults.length > 0}
				<div class="picker__results">
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