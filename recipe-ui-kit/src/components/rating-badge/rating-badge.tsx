import { Component, Prop, h } from '@stencil/core';

/**
 * `rating-badge` shows a difficulty indicator. Public-API recipes (e.g. from
 * TheMealDB) don't include this data, so the consuming app should only
 * render this for user-created recipes where difficulty was captured via
 * `recipe-form`.
 */
@Component({
  tag: 'rating-badge',
  styleUrl: 'rating-badge.css',
  shadow: true,
})
export class RatingBadge {
  @Prop() difficulty: 'easy' | 'medium' | 'hard' = 'easy';

  private label(): string {
    return this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
  }

  render() {
    return <span class={{ badge: true, [`badge--${this.difficulty}`]: true }}>{this.label()}</span>;
  }
}