import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { RecipeSummary } from '../../global/types';

/**
 * `meal-plan-slot` represents ONE day in the weekly planner. The consuming
 * SvelteKit app renders 7 of these in a grid (one per day) and owns the
 * actual week state — this component is a dumb, reusable cell: it shows
 * whichever recipe (if any) is assigned to `day`, and emits events when
 * the user wants to assign or remove one. Deliberately NOT a whole-week
 * component, so it stays reusable outside this exact feature and keeps
 * state management centralized in the app.
 */
@Component({
  tag: 'meal-plan-slot',
  styleUrl: 'meal-plan-slot.css',
  shadow: true,
})
export class MealPlanSlot {
  /** Day label this slot represents, e.g. "Monday". */
  @Prop() day: string = '';

  /** The recipe currently assigned to this day, or null if empty. Passed in as a prop by the app. */
  @Prop() assignedRecipe: RecipeSummary | null = null;

  /** Fired when the user clicks an empty slot — app should open a recipe picker and then update its store. */
  @Event() slotAssignRequest!: EventEmitter<{ day: string }>;

  /** Fired when the user removes the recipe from this day. */
  @Event() slotRemove!: EventEmitter<{ day: string; recipeId: string }>;

  private handleAssignClick = () => {
    this.slotAssignRequest.emit({ day: this.day });
  };

  private handleRemoveClick = (ev: MouseEvent) => {
    ev.stopPropagation();
    if (this.assignedRecipe) {
      this.slotRemove.emit({ day: this.day, recipeId: this.assignedRecipe.id });
    }
  };

  render() {
    return (
      <div class="slot">
        <div class="slot__day">{this.day}</div>
        {this.assignedRecipe ? (
          <div class="slot__filled">
            <img src={this.assignedRecipe.image} alt={this.assignedRecipe.title} class="slot__image" />
            <span class="slot__title">{this.assignedRecipe.title}</span>
            <button type="button" class="slot__remove" onClick={this.handleRemoveClick} aria-label="Remove recipe">
              ×
            </button>
          </div>
        ) : (
          <button type="button" class="slot__empty" onClick={this.handleAssignClick}>
            + Add recipe
          </button>
        )}
      </div>
    );
  }
}