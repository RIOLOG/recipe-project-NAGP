import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

/**
 * `category-filter` renders a row of selectable chips (categories/cuisines).
 * `categories` is passed in as a JSON-serializable array of strings, and
 * `activeCategory` reflects the currently selected one (or empty for "All").
 * The consuming app owns the actual filtering logic.
 */
@Component({
  tag: 'category-filter',
  styleUrl: 'category-filter.css',
  shadow: true,
})
export class CategoryFilter {
  /** Available category labels to render as chips. */
  @Prop() categories: string[] = [];

  /** Currently active category, empty string means "All". */
  @Prop() activeCategory: string = '';

  /** Fired when the user picks a different chip. */
  @Event() filterChange!: EventEmitter<{ category: string }>;

  private select(category: string) {
    this.filterChange.emit({ category });
  }

  render() {
    const all = ['', ...this.categories];
    return (
      <div class="filter" role="tablist">
        {all.map(cat => (
          <button
            type="button"
            role="tab"
            aria-selected={this.activeCategory === cat ? 'true' : 'false'}
            class={{ chip: true, 'chip--active': this.activeCategory === cat }}
            onClick={() => this.select(cat)}
          >
            {cat === '' ? 'All' : cat}
          </button>
        ))}
      </div>
    );
  }
}