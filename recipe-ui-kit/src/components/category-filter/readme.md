# category-filter



<!-- Auto Generated Below -->


## Overview

`category-filter` renders a row of selectable chips (categories/cuisines).
`categories` is passed in as a JSON-serializable array of strings, and
`activeCategory` reflects the currently selected one (or empty for "All").
The consuming app owns the actual filtering logic.

## Properties

| Property         | Attribute         | Description                                          | Type       | Default |
| ---------------- | ----------------- | ---------------------------------------------------- | ---------- | ------- |
| `activeCategory` | `active-category` | Currently active category, empty string means "All". | `string`   | `''`    |
| `categories`     | --                | Available category labels to render as chips.        | `string[]` | `[]`    |


## Events

| Event          | Description                                 | Type                                 |
| -------------- | ------------------------------------------- | ------------------------------------ |
| `filterChange` | Fired when the user picks a different chip. | `CustomEvent<{ category: string; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
