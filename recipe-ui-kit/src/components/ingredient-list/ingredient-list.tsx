import { Component, Prop, h } from '@stencil/core';
import { Ingredient } from '../../global/types';

/**
 * `ingredient-list` renders a recipe's ingredients on the detail page.
 * Accepts a JSON-serializable array of `{ name, quantity? }`.
 */

@Component({
  tag: 'ingredient-list',
  styleUrl: 'ingredient-list.css',
  shadow: true,
})

export class IngredientList {
  @Prop() ingredients: Ingredient[] = [];

  render() {
    if (!this.ingredients.length) {
      return <p class="empty">No ingredients listed.</p>;
    }
    return (
      <ul class="list">
        {this.ingredients.map(ing => (
          <li class="item">
            {ing.quantity && <span class="qty">{ing.quantity}</span>}
            <span class="name">{ing.name}</span>
          </li>
        ))}
      </ul>
    );
  }
}