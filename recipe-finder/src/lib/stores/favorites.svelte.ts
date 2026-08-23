import type { MealSummary } from '$lib/api/mealdb';

const STORAGE_KEY = 'recipe-finder:favorites';

function loadFromStorage(): MealSummary[] {
	if (typeof localStorage === 'undefined') return []; // guards against SSR (no localStorage on server)
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

function saveToStorage(favorites: MealSummary[]) {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

// Module-level $state — this is what makes it "shared" across every
// component that imports { favorites } from this file. Any component that
// reads `favorites.list` re-renders automatically when it changes.
class FavoritesStore {
	list = $state<MealSummary[]>(loadFromStorage());

	isFavorite(id: string): boolean {
		return this.list.some((m) => m.id === id);
	}

	add(meal: MealSummary) {
		if (!this.isFavorite(meal.id)) {
			this.list = [...this.list, meal];
			saveToStorage(this.list);
		}
	}

	remove(id: string) {
		this.list = this.list.filter((m) => m.id !== id);
		saveToStorage(this.list);
	}

	toggle(meal: MealSummary) {
		if (this.isFavorite(meal.id)) {
			this.remove(meal.id);
		} else {
			this.add(meal);
		}
	}
}

export const favorites = new FavoritesStore();