import { NeuralIcon } from '@neural-icons/angular';
import { neuralIcons } from '@neural-icons/core';
import type { NeuralIconDefinition } from '@neural-icons/core';
import { iconSearch } from '@neural-icons/core/icons/search';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

@Component({
  imports: [NeuralIcon],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly query = signal('');
  protected readonly searchIcon = iconSearch;
  protected readonly iconCards = computed(() => {
    const filledByName = new Map(
      neuralIcons
        .filter((icon) => icon.variant === 'filled')
        .map((icon) => [icon.name.replace(/-filled$/, ''), icon]),
    );

    return neuralIcons
      .filter((icon) => icon.variant === 'outline')
      .map((outline) => ({
        outline,
        filled: filledByName.get(outline.name),
      }));
  });
  protected readonly total = this.iconCards().length;
  protected readonly filledTotal = neuralIcons.filter(
    (icon) => icon.variant === 'filled',
  ).length;
  protected readonly icons = computed(() => {
    const query = this.query().trim().toLowerCase();
    if (!query) return this.iconCards();

    return this.iconCards().filter(({ outline }) =>
      [outline.name, outline.category, ...outline.tags].some((value) =>
        value.includes(query),
      ),
    );
  });

  protected iconLabel(icon: NeuralIconDefinition, variant: string): string {
    return `${icon.name} ${variant}`;
  }

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
