import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

/**
 * `favorite-button` is a standalone, stateless toggle. It never owns the
 * favorite state itself — the consuming app passes in `active` as a prop
 * and listens for `favoriteToggle` to update its own store. This lets the
 * same component be reused inside `recipe-card` and independently on the
 * recipe detail page.
 */
@Component({
  tag: 'favorite-button',
  styleUrl: 'favorite-button.css',
  shadow: true,
})
export class FavoriteButton {
  /** Whether this recipe is currently favorited. */
  @Prop() active: boolean = false;

  /** Optional size variant for use in different contexts (card vs. detail page). */
  @Prop() size: 'sm' | 'lg' = 'sm';

  /** Fired on click with the value the app should set the favorite state to.
   * Named `favoriteToggle` (not `toggle`) to avoid colliding with the native
   * browser `ToggleEvent` type used by <details>/popover elements. */
  @Event() favoriteToggle!: EventEmitter<{ nextValue: boolean }>;

  private handleClick = (ev: MouseEvent) => {
    ev.stopPropagation();
    this.favoriteToggle.emit({ nextValue: !this.active });
  };

  render() {
    return (
      <button
        type="button"
        class={{ btn: true, 'btn--active': this.active, [`btn--${this.size}`]: true }}
        aria-pressed={this.active ? 'true' : 'false'}
        aria-label={this.active ? 'Remove from favorites' : 'Add to favorites'}
        onClick={this.handleClick}
      >
        <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
          <path d="M12 21s-6.7-4.35-9.33-8.2C.86 10.1 1.2 6.6 4 4.9 6.1 3.6 8.7 4.2 10 6.1L12 9l2-2.9c1.3-1.9 3.9-2.5 6-1.2 2.8 1.7 3.14 5.2 1.33 7.9C18.7 16.65 12 21 12 21z" />
        </svg>
      </button>
    );
  }
}