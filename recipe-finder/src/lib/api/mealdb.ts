/**
 * Thin wrapper around TheMealDB's free public API.
 * Docs: https://www.themealdb.com/api.php
 *
 * TheMealDB's own field names are verbose and inconsistent (idMeal,
 * strMeal, strMealThumb, strIngredient1..20, strMeasure1..20). We map
 * everything into our own clean shapes here, so the rest of the app never
 * has to deal with TheMealDB's raw response format directly.
 */


const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';


export interface MealSummary {
	id: string;
	title: string;
	image: string;
	category?: string;
}

export interface MealDetail extends MealSummary {
	area?: string;
	instructions: string;
	ingredients: { name: string; quantity?: string }[];
}

// Raw shape returned by TheMealDB — kept private to this file.
interface RawMeal {
	idMeal: string;
	strMeal: string;
	strMealThumb: string;
	strCategory?: string;
	strArea?: string;
	strInstructions?: string;
	[key: string]: string | undefined; // strIngredient1..20, strMeasure1..20
}

function mapSummary(raw: RawMeal): MealSummary {
	return {
		id: raw.idMeal,
		title: raw.strMeal,
		image: raw.strMealThumb,
		category: raw.strCategory
	};
}

function mapDetail(raw: RawMeal): MealDetail {
	const ingredients: { name: string; quantity?: string }[] = [];
	for (let i = 1; i <= 20; i++) {
		const name = raw[`strIngredient${i}`];
		const quantity = raw[`strMeasure${i}`];
		if (name && name.trim()) {
			ingredients.push({ name: name.trim(), quantity: quantity?.trim() || undefined });
		}
	}
	return {
		...mapSummary(raw),
		area: raw.strArea,
		instructions: raw.strInstructions ?? '',
		ingredients
	};
}

/** Search recipes by name. Empty query returns an empty list (TheMealDB's
 * search-by-name endpoint doesn't support browsing "all" recipes). */
export async function searchMeals(query: string): Promise<MealSummary[]> {
	if (!query.trim()) return [];
	const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
	const data = await res.json();
	const meals: RawMeal[] | null = data.meals;
	return meals ? meals.map(mapSummary) : [];
}

/** Fetch full detail for a single recipe by id. */
export async function getMealById(id: string): Promise<MealDetail | null> {
	const res = await fetch(`${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`);
	const data = await res.json();
	const meals: RawMeal[] | null = data.meals;
	return meals && meals.length > 0 ? mapDetail(meals[0]) : null;
}

/** Fetch the list of available categories, for the category-filter component. */
export async function getCategories(): Promise<string[]> {
	const res = await fetch(`${BASE_URL}/list.php?c=list`);
	const data = await res.json();
	const list: { strCategory: string }[] | null = data.meals;
	return list ? list.map((c) => c.strCategory) : [];
}

/** Browse recipes by category — used for the default/browse view and category-filter. */
export async function getMealsByCategory(category: string): Promise<MealSummary[]> {
	const res = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
	const data = await res.json();
	const meals: RawMeal[] | null = data.meals;
	return meals ? meals.map(mapSummary) : [];
}