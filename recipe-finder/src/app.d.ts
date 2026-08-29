// Ambient declarations for Stencil custom elements from @riolog/recipe-ui-kit,
// so TypeScript recognizes these tags in Svelte templates (props + custom events).
declare namespace svelteHTML {
	interface IntrinsicElements {
		'recipe-card': {
			recipeId?: string;
			cardTitle?: string;
			image?: string;
			category?: string;
			isFavorite?: boolean;
			isUserCreated?: boolean;
			difficulty?: 'easy' | 'medium' | 'hard';
			oncardOpen?: (e: CustomEvent<{ recipeId: string }>) => void;
			onfavoriteToggle?: (e: CustomEvent<{ recipeId: string; nextValue: boolean }>) => void;
		};
		'favorite-button': {
			active?: boolean;
			size?: 'sm' | 'lg';
			onfavoriteToggle?: (e: CustomEvent<{ nextValue: boolean }>) => void;
		};
		'rating-badge': {
			difficulty?: 'easy' | 'medium' | 'hard';
		};
		'recipe-search': {
			value?: string;
			placeholder?: string;
			debounceMs?: number;
			onsearchChange?: (e: CustomEvent<{ query: string }>) => void;
			onsearchSubmit?: (e: CustomEvent<{ query: string }>) => void;
		};
		'category-filter': {
			categories?: string[];
			activeCategory?: string;
			onfilterChange?: (e: CustomEvent<{ category: string }>) => void;
		};
		'recipe-form': {
			initialData?: unknown;
			onformSubmit?: (e: CustomEvent<unknown>) => void;
			onformCancel?: (e: CustomEvent<void>) => void;
		};
		'ingredient-list': {
			ingredients?: { name: string; quantity?: string }[];
		};
		'meal-plan-slot': {
			day?: string;
			assignedRecipe?: unknown;
			onslotAssignRequest?: (e: CustomEvent<{ day: string }>) => void;
			onslotRemove?: (e: CustomEvent<{ day: string; recipeId: string }>) => void;
		};
	}
}

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};