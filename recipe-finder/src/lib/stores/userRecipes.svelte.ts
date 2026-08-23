export interface Ingredient {
	name: string;
}

export interface UserRecipe {
	id: string;
	title: string;
	image: string;
	category: string;
	difficulty: 'easy' | 'medium' | 'hard';
	ingredients: Ingredient[];
	instructions: string;
	createdAt: number;
}

const STORAGE_KEY = 'recipe-finder:user-recipes';


function loadFromStorage(): UserRecipe[] {
	if (typeof localStorage === 'undefined') return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

function saveToStorage(recipes: UserRecipe[]) {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}


function generateId(): string {
	// Prefixed so user-recipe IDs never collide with TheMealDB's numeric IDs
	// when both types of recipes flow through shared components/routes.
	return 'user-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

class UserRecipesStore {
	list = $state<UserRecipe[]>(loadFromStorage());

	getById(id: string): UserRecipe | undefined {
		return this.list.find((r) => r.id === id);
	}

	create(data: Omit<UserRecipe, 'id' | 'createdAt'>): UserRecipe {
		const recipe: UserRecipe = {
			...data,
			id: generateId(),
			createdAt: Date.now()
		};
		this.list = [...this.list, recipe];
		saveToStorage(this.list);
		return recipe;
	}

	update(id: string, data: Omit<UserRecipe, 'id' | 'createdAt'>) {
		this.list = this.list.map((r) => (r.id === id ? { ...r, ...data } : r));
		saveToStorage(this.list);
	}

	remove(id: string) {
		this.list = this.list.filter((r) => r.id !== id);
		saveToStorage(this.list);
	}
}

export const userRecipes = new UserRecipesStore();