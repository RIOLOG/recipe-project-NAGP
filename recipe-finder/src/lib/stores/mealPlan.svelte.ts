import type { MealSummary } from '$lib/api/mealdb';

const STORAGE_KEY = 'recipe-finder:meal-plan';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export type DayOfWeek = (typeof DAYS)[number];

export const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export type DayPlan = Record<MealType, MealSummary | null>;
export type MealPlan = Record<DayOfWeek, DayPlan>;

function emptyDayPlan(): DayPlan {
	return { Breakfast: null, Lunch: null, Dinner: null };
}

function emptyPlan(): MealPlan {
	return {
		Monday: emptyDayPlan(),
		Tuesday: emptyDayPlan(),
		Wednesday: emptyDayPlan(),
		Thursday: emptyDayPlan(),
		Friday: emptyDayPlan(),
		Saturday: emptyDayPlan(),
		Sunday: emptyDayPlan()
	};
}

function loadFromStorage(): MealPlan {
	if (typeof localStorage === 'undefined') return emptyPlan();
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return emptyPlan();
		const parsed = JSON.parse(raw);
		// Merge onto a fresh empty plan so any old single-slot data or
		// missing days/meal-types don't break the shape.
		const merged = emptyPlan();
		for (const day of DAYS) {
			if (parsed[day]) {
				merged[day] = { ...emptyDayPlan(), ...parsed[day] };
			}
		}
		return merged;
	} catch {
		return emptyPlan();
	}
}

function saveToStorage(plan: MealPlan) {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

class MealPlanStore {
	plan = $state<MealPlan>(loadFromStorage());

	assign(day: DayOfWeek, mealType: MealType, meal: MealSummary) {
		this.plan = {
			...this.plan,
			[day]: { ...this.plan[day], [mealType]: meal }
		};
		saveToStorage(this.plan);
	}

	remove(day: DayOfWeek, mealType: MealType) {
		this.plan = {
			...this.plan,
			[day]: { ...this.plan[day], [mealType]: null }
		};
		saveToStorage(this.plan);
	}
}

export const mealPlan = new MealPlanStore();