/**
 * Shared type contracts for the recipe-ui-kit component library.
 * These mirror the shape the consuming app (SvelteKit) will pass in as props
 * and receive back in custom event payloads.
 */

export interface RecipeSummary {
  id: string;
  title: string;
  image: string;
  category?: string;
  area?: string;
  isUserCreated?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Ingredient {
  name: string;
  quantity?: string;
}

export interface MealPlanEntry {
  day: DayOfWeek;
  recipe: RecipeSummary | null;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface RecipeFormData {
  id?: string;
  title: string;
  image: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Ingredient[];
  instructions: string;
}

export interface RecipeFormErrors {
  title?: string;
  image?: string;
  category?: string;
  ingredients?: string;
  instructions?: string;
}