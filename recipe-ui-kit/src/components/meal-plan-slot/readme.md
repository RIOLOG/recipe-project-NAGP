# meal-plan-slot



<!-- Auto Generated Below -->


## Overview

`meal-plan-slot` represents ONE day in the weekly planner. The consuming
SvelteKit app renders 7 of these in a grid (one per day) and owns the
actual week state — this component is a dumb, reusable cell: it shows
whichever recipe (if any) is assigned to `day`, and emits events when
the user wants to assign or remove one. Deliberately NOT a whole-week
component, so it stays reusable outside this exact feature and keeps
state management centralized in the app.

## Properties

| Property         | Attribute | Description                                                                                  | Type            | Default |
| ---------------- | --------- | -------------------------------------------------------------------------------------------- | --------------- | ------- |
| `assignedRecipe` | --        | The recipe currently assigned to this day, or null if empty. Passed in as a prop by the app. | `RecipeSummary` | `null`  |
| `day`            | `day`     | Day label this slot represents, e.g. "Monday".                                               | `string`        | `''`    |


## Events

| Event               | Description                                                                                           | Type                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `slotAssignRequest` | Fired when the user clicks an empty slot — app should open a recipe picker and then update its store. | `CustomEvent<{ day: string; }>`                   |
| `slotRemove`        | Fired when the user removes the recipe from this day.                                                 | `CustomEvent<{ day: string; recipeId: string; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
