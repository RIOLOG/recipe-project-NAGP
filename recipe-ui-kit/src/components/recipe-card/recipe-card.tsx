import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

/**
 * `recipe-card` displays a single recipe summary for use in grids, search
 * results, and favorites lists. It composes `favorite-button` and
 * `rating-badge` internally, but the actual favorite/rating state is always
 * owned by the consuming app — this component is purely presentational and
 * communicates via events.
 */
@Component({
  tag: 'recipe-card',
  styleUrl: 'recipe-card.css',
  shadow: true,
})
export class RecipeCard {
  /** Unique identifier of the recipe, passed back in emitted events. */
  @Prop() recipeId!: string;

  /** Recipe title. */
  @Prop() cardTitle: string = 'Untitled recipe';

  /** Recipe thumbnail image URL. */
  @Prop() image: string = '';

  /** Optional category/cuisine label, e.g. "Dessert" or "Italian". */
  @Prop() category?: string;

  /** Whether this recipe is currently in the user's favorites. */
  @Prop() isFavorite: boolean = false;

  /** Whether this recipe was created by the user (vs. sourced from the API). */
  @Prop() isUserCreated: boolean = false;

  /** Optional difficulty, only meaningful for user-created recipes. */
  @Prop() difficulty?: 'easy' | 'medium' | 'hard';

  /** Fired when the card body (not the favorite button) is clicked — app should navigate to the detail page. */
  @Event() cardOpen!: EventEmitter<{ recipeId: string }>;

  /** Fired when the favorite toggle inside the card is pressed. */
  @Event() favoriteToggle!: EventEmitter<{ recipeId: string; nextValue: boolean }>;

  private handleOpen = () => {
    this.cardOpen.emit({ recipeId: this.recipeId });
  };

  private handleFavorite = (ev: CustomEvent<{ nextValue: boolean }>) => {
    ev.stopPropagation();
    this.favoriteToggle.emit({ recipeId: this.recipeId, nextValue: ev.detail.nextValue });
  };

  render() {
    return (
      <div class="card" onClick={this.handleOpen}>
        <div class="card__media">
          {this.image ? <img src={this.image} alt={this.cardTitle} loading="lazy" /> : <div class="card__media-placeholder" />}
          <favorite-button
            class="card__favorite"
            active={this.isFavorite}
            onFavoriteToggle={this.handleFavorite}
          />
        </div>
        <div class="card__body">
          <h3 class="card__title">{this.cardTitle}</h3>
          <div class="card__meta">
            {this.category && <span class="card__category">{this.category}</span>}
            {this.isUserCreated && this.difficulty && <rating-badge difficulty={this.difficulty} />}
          </div>
          <slot name="footer"></slot>
        </div>
      </div>
    );
  }
}