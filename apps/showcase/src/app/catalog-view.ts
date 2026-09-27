import { NeuralIcon } from '@neural-icons/angular';
import type { NeuralIconDefinition } from '@neural-icons/core';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { showcaseCopy, type Locale } from './showcase-copy';
import type { Framework, IconFamily } from './showcase-model';

@Component({
  selector: 'app-catalog-view',
  imports: [NeuralIcon],
  templateUrl: './catalog-view.html',
  styleUrl: './catalog-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogView {
  private readonly searchInput =
    viewChild<ElementRef<HTMLInputElement>>('searchInput');
  readonly copy = input.required<typeof showcaseCopy.en>();
  readonly locale = input.required<Locale>();
  readonly framework = input.required<Framework>();
  readonly icons = input.required<readonly IconFamily[]>();
  readonly categories = input.required<readonly string[]>();
  readonly category = input.required<string>();
  readonly query = input.required<string>();
  readonly selectedName = input.required<string | null>();
  readonly total = input.required<number>();
  readonly heroIcons = input.required<readonly NeuralIconDefinition[]>();
  readonly searchIcon = input.required<NeuralIconDefinition>();
  readonly guideHref = input.required<string>();
  readonly navigateGuide = output<MouseEvent>();
  readonly queryChange = output<string>();
  readonly clearSearch = output<void>();
  readonly categoryChange = output<string>();
  readonly familySelected = output<{ event: MouseEvent; name: string }>();

  focusFamily(name: string): void {
    document.getElementById(`family-${name}`)?.focus();
  }

  clearQuery(): void {
    this.clearSearch.emit();
    this.searchInput()?.nativeElement.focus();
  }

  onSearch(event: Event): void {
    this.queryChange.emit((event.target as HTMLInputElement).value);
  }

  familyHref(name: string): string {
    const params = new URLSearchParams({ icon: name });
    if (this.locale() === 'es') params.set('lang', 'es');
    if (this.framework() !== 'html') params.set('framework', this.framework());
    return `/?${params.toString()}`;
  }

  resultCount(count: number): string {
    return this.locale() === 'es'
      ? `${count} de ${this.total()} familias`
      : `${count} of ${this.total()} families`;
  }

  inspectLabel(name: string): string {
    return this.locale() === 'es'
      ? `Ver detalles de ${name}`
      : `Inspect ${name}`;
  }

  categoryLabel(category: string): string {
    const labels = this.copy();
    switch (category) {
      case 'action':
        return labels.action;
      case 'communication':
        return labels.communication;
      case 'file':
        return labels.file;
      case 'navigation':
        return labels.navigation;
      case 'status':
        return labels.status;
      case 'system':
        return labels.system;
      default:
        return category;
    }
  }
}
