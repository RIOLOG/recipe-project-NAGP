import { Component, Prop, State, Event, EventEmitter, Watch, h } from '@stencil/core';
import { RecipeFormData, RecipeFormErrors, Ingredient } from '../../global/types';

/**
 * `recipe-form` handles add/edit for user-created recipes. Validation is
 * performed inside the component (title/image/category/ingredients/
 * instructions all required, at least one ingredient), and only a fully
 * valid `RecipeFormData` payload is ever emitted via `formSubmit`. The app
 * is responsible for persistence (localStorage) — this component has no
 * knowledge of how/where data is stored.
 *
 * A named slot (`extra-fields`) lets the consuming app inject additional
 * form fields (e.g. prep time, servings) without forking this component.
 */
@Component({
  tag: 'recipe-form',
  styleUrl: 'recipe-form.css',
  shadow: true,
})
export class RecipeForm {
  /** Pass existing recipe data to switch the form into edit mode. */
  @Prop() initialData?: RecipeFormData;

  @State() title: string = '';
  @State() image: string = '';
  @State() category: string = '';
  @State() difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  @State() ingredientsText: string = '';
  @State() instructions: string = '';
  @State() errors: RecipeFormErrors = {};

  @Event() formSubmit!: EventEmitter<RecipeFormData>;
  @Event() formCancel!: EventEmitter<void>;

  componentWillLoad() {
    this.hydrate(this.initialData);
  }

  @Watch('initialData')
  onInitialDataChange(next?: RecipeFormData) {
    this.hydrate(next);
  }

  private hydrate(data?: RecipeFormData) {
    this.title = data?.title ?? '';
    this.image = data?.image ?? '';
    this.category = data?.category ?? '';
    this.difficulty = data?.difficulty ?? 'easy';
    this.instructions = data?.instructions ?? '';
    this.ingredientsText = (data?.ingredients ?? [])
      .map(i => (i.quantity ? `${i.quantity} ${i.name}` : i.name))
      .join('\n');
    this.errors = {};
  }

  /** Each line becomes one ingredient. Free-form text (e.g. "200g flour") is
   * kept as a single `name` field rather than trying to split quantity from
   * name — this avoids fragile parsing while still giving structured data. */
  private parseIngredients(): Ingredient[] {
    return this.ingredientsText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => ({ name: line }));
  }

  private validate(ingredients: Ingredient[]): RecipeFormErrors {
    const errors: RecipeFormErrors = {};
    if (!this.title.trim()) errors.title = 'Title is required.';
    if (!this.image.trim()) errors.image = 'Image URL is required.';
    if (!this.category.trim()) errors.category = 'Category is required.';
    if (ingredients.length === 0) errors.ingredients = 'Add at least one ingredient (one per line).';
    if (!this.instructions.trim() || this.instructions.trim().length < 10) {
      errors.instructions = 'Instructions should be at least 10 characters.';
    }
    return errors;
  }

  private handleSubmit = (ev: Event) => {
    ev.preventDefault();
    const ingredients = this.parseIngredients();
    const errors = this.validate(ingredients);
    this.errors = errors;
    if (Object.keys(errors).length > 0) return;

    this.formSubmit.emit({
      id: this.initialData?.id,
      title: this.title.trim(),
      image: this.image.trim(),
      category: this.category.trim(),
      difficulty: this.difficulty,
      ingredients,
      instructions: this.instructions.trim(),
    });
  };

  private handleCancel = () => {
    this.formCancel.emit();
  };

  render() {
    return (
      <form class="form" onSubmit={this.handleSubmit} novalidate>
        <label class="field">
          <span>Title</span>
          <input
            type="text"
            value={this.title}
            onInput={e => (this.title = (e.target as HTMLInputElement).value)}
          />
          {this.errors.title && <small class="error">{this.errors.title}</small>}
        </label>

        <label class="field">
          <span>Image URL</span>
          <input
            type="text"
            value={this.image}
            onInput={e => (this.image = (e.target as HTMLInputElement).value)}
          />
          {this.errors.image && <small class="error">{this.errors.image}</small>}
        </label>

        <label class="field">
          <span>Category</span>
          <input
            type="text"
            value={this.category}
            onInput={e => (this.category = (e.target as HTMLInputElement).value)}
          />
          {this.errors.category && <small class="error">{this.errors.category}</small>}
        </label>

        <label class="field">
          <span>Difficulty</span>
          <select
            onChange={e => (this.difficulty = (e.target as HTMLSelectElement).value as any)}
          >
            <option value="easy" selected={this.difficulty === 'easy'}>Easy</option>
            <option value="medium" selected={this.difficulty === 'medium'}>Medium</option>
            <option value="hard" selected={this.difficulty === 'hard'}>Hard</option>
          </select>
        </label>

        <label class="field">
          <span>Ingredients (one per line)</span>
          <textarea
            rows={5}
            value={this.ingredientsText}
            onInput={e => (this.ingredientsText = (e.target as HTMLTextAreaElement).value)}
          ></textarea>
          {this.errors.ingredients && <small class="error">{this.errors.ingredients}</small>}
        </label>

        <label class="field">
          <span>Instructions</span>
          <textarea
            rows={6}
            value={this.instructions}
            onInput={e => (this.instructions = (e.target as HTMLTextAreaElement).value)}
          ></textarea>
          {this.errors.instructions && <small class="error">{this.errors.instructions}</small>}
        </label>

        <slot name="extra-fields"></slot>

        <div class="actions">
          <button type="button" class="btn btn--ghost" onClick={this.handleCancel}>
            Cancel
          </button>
          <button type="submit" class="btn btn--primary">
            {this.initialData?.id ? 'Save changes' : 'Add recipe'}
          </button>
        </div>
      </form>
    );
  }
}