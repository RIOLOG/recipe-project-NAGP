import type { MealSummary } from '$lib/api/mealdb';

const STORAGE_KEY = 'recipe-finder:meal-plan';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export type DayOfWeek = (typeof DAYS)[number];

export type MealPlan = Record<DayOfWeek, MealSummary | null>;

function emptyPlan(): MealPlan {
	return {
		Monday: null,
		Tuesday: null,
		Wednesday: null,
		Thursday: null,
		Friday: null,
		Saturday: null,
		Sunday: null
	};
}

function loadFromStorage(): MealPlan {
	if (typeof localStorage === 'undefined') return emptyPlan();
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? { ...emptyPlan(), ...JSON.parse(raw) } : emptyPlan();
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

	assign(day: DayOfWeek, meal: MealSummary) {
		this.plan = { ...this.plan, [day]: meal };
		saveToStorage(this.plan);
	}

	remove(day: DayOfWeek) {
		this.plan = { ...this.plan, [day]: null };
		saveToStorage(this.plan);
	}
}

export const mealPlan = new MealPlanStore();