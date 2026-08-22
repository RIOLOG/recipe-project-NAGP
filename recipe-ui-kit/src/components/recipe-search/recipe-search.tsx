import { Component, Prop, Event, EventEmitter, State, Watch, h } from '@stencil/core';

/**
 * `recipe-search` is a controlled-ish search input. It keeps its own draft
 * text as internal state for responsive typing, but never owns the "actual"
 * search query — it emits `searchSubmit` on enter/button click, and also a
 * debounced `searchChange` while typing, so the app can decide whether it
 * wants live search or submit-triggered search.
 */
@Component({
  tag: 'recipe-search',
  styleUrl: 'recipe-search.css',
  shadow: true,
})
export class RecipeSearch {
  private debounceTimer?: ReturnType<typeof setTimeout>;

  /** Initial/controlled value from the app (e.g. restored from URL query params). */
  @Prop() value: string = '';

  @Prop() placeholder: string = 'Search recipes…';

  /** Debounce delay in ms for the live `searchChange` event. */
  @Prop() debounceMs: number = 350;

  @State() draft: string = this.value;

  /** Fired (debounced) as the user types. */
  @Event() searchChange!: EventEmitter<{ query: string }>;

  /** Fired immediately on Enter or submit-button click. */
  @Event() searchSubmit!: EventEmitter<{ query: string }>;

  @Watch('value')
  syncFromProp(newValue: string) {
    this.draft = newValue;
  }

  private handleInput = (ev: InputEvent) => {
    this.draft = (ev.target as HTMLInputElement).value;
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.searchChange.emit({ query: this.draft });
    }, this.debounceMs);
  };

  private handleSubmit = (ev: Event) => {
    ev.preventDefault();
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.searchSubmit.emit({ query: this.draft });
  };

  render() {
    return (
      <form class="search" onSubmit={this.handleSubmit}>
        <input
          type="search"
          class="search__input"
          placeholder={this.placeholder}
          value={this.draft}
          onInput={this.handleInput}
          aria-label="Search recipes"
        />
        <button type="submit" class="search__btn">
          Search
        </button>
      </form>
    );
  }
}