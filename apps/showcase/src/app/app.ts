import { NeuralIcon } from '@neural-icons/angular';
import { neuralIcons } from '@neural-icons/core';
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
  protected readonly total = neuralIcons.length;
  protected readonly icons = computed(() => {
    const query = this.query().trim().toLowerCase();
    if (!query) return neuralIcons;

    return neuralIcons.filter(
      (icon) =>
        icon.name.includes(query) ||
        icon.category.includes(query) ||
        icon.tags.some((tag) => tag.includes(query)),
    );
  });

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
