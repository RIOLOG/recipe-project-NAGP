# recipe-search



<!-- Auto Generated Below -->


## Overview

`recipe-search` is a controlled-ish search input. It keeps its own draft
text as internal state for responsive typing, but never owns the "actual"
search query — it emits `searchSubmit` on enter/button click, and also a
debounced `searchChange` while typing, so the app can decide whether it
wants live search or submit-triggered search.

## Properties

| Property      | Attribute     | Description                                                                  | Type     | Default             |
| ------------- | ------------- | ---------------------------------------------------------------------------- | -------- | ------------------- |
| `debounceMs`  | `debounce-ms` | Debounce delay in ms for the live `searchChange` event.                      | `number` | `350`               |
| `placeholder` | `placeholder` |                                                                              | `string` | `'Search recipes…'` |
| `value`       | `value`       | Initial/controlled value from the app (e.g. restored from URL query params). | `string` | `''`                |


## Events

| Event          | Description                                        | Type                              |
| -------------- | -------------------------------------------------- | --------------------------------- |
| `searchChange` | Fired (debounced) as the user types.               | `CustomEvent<{ query: string; }>` |
| `searchSubmit` | Fired immediately on Enter or submit-button click. | `CustomEvent<{ query: string; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
