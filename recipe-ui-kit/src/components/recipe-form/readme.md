# recipe-form



<!-- Auto Generated Below -->


## Overview

`recipe-form` handles add/edit for user-created recipes. Validation is
performed inside the component (title/image/category/ingredients/
instructions all required, at least one ingredient), and only a fully
valid `RecipeFormData` payload is ever emitted via `formSubmit`. The app
is responsible for persistence (localStorage) — this component has no
knowledge of how/where data is stored.

A named slot (`extra-fields`) lets the consuming app inject additional
form fields (e.g. prep time, servings) without forking this component.

## Properties

| Property      | Attribute | Description                                                  | Type             | Default     |
| ------------- | --------- | ------------------------------------------------------------ | ---------------- | ----------- |
| `initialData` | --        | Pass existing recipe data to switch the form into edit mode. | `RecipeFormData` | `undefined` |


## Events

| Event        | Description | Type                          |
| ------------ | ----------- | ----------------------------- |
| `formCancel` |             | `CustomEvent<void>`           |
| `formSubmit` |             | `CustomEvent<RecipeFormData>` |


## Slots

| Slot             | Description |
| ---------------- | ----------- |
| `"extra-fields"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
