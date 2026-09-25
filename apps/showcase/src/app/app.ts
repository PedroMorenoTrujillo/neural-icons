import { NeuralIcon } from '@neural-icons/angular';
import { neuralIcons } from '@neural-icons/core/catalog';
import type { NeuralIconDefinition } from '@neural-icons/core';
import { iconSearch } from '@neural-icons/core/icons/search';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';

type VariantMode = 'both' | 'outline' | 'filled';
type Framework = 'angular' | 'react' | 'vue';
type Theme = 'light' | 'dark';

interface IconFamily {
  readonly name: string;
  readonly category: string;
  readonly keywords: readonly string[];
  readonly outline: NeuralIconDefinition;
  readonly filled: NeuralIconDefinition;
}

const filledByFamily = new Map(
  neuralIcons
    .filter((icon) => icon.variant === 'filled')
    .map((icon) => [icon.family, icon]),
);

const families: readonly IconFamily[] = neuralIcons
  .filter((icon) => icon.variant === 'outline')
  .map((outline) => {
    const filled = filledByFamily.get(outline.family);
    if (!filled) throw new Error(`Missing filled variant: ${outline.family}`);
    return {
      name: outline.family,
      category: outline.category,
      keywords: [...new Set([...outline.tags, ...filled.tags])],
      outline,
      filled,
    };
  });

const familyByName = new Map(families.map((family) => [family.name, family]));
const categories = [
  ...new Set(families.map((family) => family.category)),
].sort();

function exportName(name: string): string {
  return `icon${name.replace(/(^|-)([a-z0-9])/g, (_, _separator, letter: string) => letter.toUpperCase())}`;
}

@Component({
  imports: [NeuralIcon],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.theme-dark]': "theme() === 'dark'",
  },
})
export class App {
  private readonly destroyRef = inject(DestroyRef);
  protected readonly searchInput =
    viewChild<ElementRef<HTMLInputElement>>('searchInput');
  protected readonly detailPanel =
    viewChild<ElementRef<HTMLElement>>('detailPanel');
  protected readonly searchIcon = iconSearch;
  protected readonly query = signal('');
  protected readonly category = signal('all');
  protected readonly variantMode = signal<VariantMode>('both');
  protected readonly selectedName = signal<string | null>(null);
  protected readonly selectedVariant = signal<'outline' | 'filled'>('outline');
  protected readonly framework = signal<Framework>('angular');
  protected readonly theme = signal<Theme>('light');
  protected readonly isNarrow = signal(false);
  protected readonly previewColor = signal('#236ed8');
  protected readonly copyFeedback = signal('');
  protected readonly categories = categories;
  protected readonly total = families.length;
  protected readonly glyphTotal = neuralIcons.length;
  protected readonly sizes = [16, 20, 24, 32] as const;
  protected readonly colors = [
    '#236ed8',
    '#152033',
    '#de5e47',
    '#228b70',
  ] as const;

  protected readonly icons = computed(() => {
    const query = this.query().trim().toLowerCase();
    const category = this.category();
    return families.filter(
      (family) =>
        (category === 'all' || family.category === category) &&
        (!query ||
          [family.name, family.category, ...family.keywords].some((value) =>
            value.toLowerCase().includes(query),
          )),
    );
  });
  protected readonly selected = computed(() =>
    familyByName.get(this.selectedName() ?? ''),
  );
  protected readonly definition = computed(() => {
    const family = this.selected();
    return family?.[this.selectedVariant()];
  });
  protected readonly importStatement = computed(() => {
    const definition = this.definition();
    return definition
      ? `import { ${exportName(definition.name)} } from '@neural-icons/core/icons/${definition.name}';`
      : '';
  });
  protected readonly snippet = computed(() => {
    const definition = this.definition();
    if (!definition) return '';
    const symbol = exportName(definition.name);
    const imported = this.importStatement();
    switch (this.framework()) {
      case 'angular':
        return `import { Component } from '@angular/core';\n${imported}\nimport { NeuralIcon } from '@neural-icons/angular';\n\n@Component({\n  selector: 'app-icon-example',\n  imports: [NeuralIcon],\n  template: '<neural-icon [icon]="${symbol}" [size]="24" />',\n})\nexport class IconExample {\n  readonly ${symbol} = ${symbol};\n}`;
      case 'react':
        return `${imported}\nimport { NeuIcon } from '@neural-icons/react';\n\nexport function IconExample() {\n  return <NeuIcon icon={${symbol}} size={24} />;\n}`;
      case 'vue':
        return `<script setup lang="ts">\n${imported}\nimport { NeuIcon } from '@neural-icons/vue';\n</script>\n\n<template>\n  <NeuIcon :icon="${symbol}" :size="24" />\n</template>`;
    }
  });

  constructor() {
    // URL state is applied after hydration so server and first client render match.
    afterNextRender(() => {
      this.readUrl();
      const onPopState = () => this.readUrl();
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') this.onEscape();
        if (event.key === 'Tab') this.onTab(event);
      };
      const width = window.matchMedia('(max-width: 1000px)');
      const onWidthChange = () => {
        this.isNarrow.set(width.matches);
        if (width.matches && this.selectedName()) this.focusDetail();
      };
      onWidthChange();
      window.addEventListener('popstate', onPopState);
      document.addEventListener('keydown', onKeyDown);
      width.addEventListener('change', onWidthChange);
      this.destroyRef.onDestroy(() =>
        window.removeEventListener('popstate', onPopState),
      );
      this.destroyRef.onDestroy(() =>
        document.removeEventListener('keydown', onKeyDown),
      );
      this.destroyRef.onDestroy(() =>
        width.removeEventListener('change', onWidthChange),
      );
    });
  }

  protected setQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected clearQuery(): void {
    this.query.set('');
    this.searchInput()?.nativeElement.focus();
  }

  protected setCategory(event: Event): void {
    this.category.set((event.target as HTMLSelectElement).value);
  }

  protected setVariantMode(mode: VariantMode): void {
    this.variantMode.set(mode);
  }

  protected setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  protected setPreviewColor(color: string): void {
    this.previewColor.set(color);
  }

  protected selectFamily(name: string): void {
    this.selectedName.set(name);
    this.selectedVariant.set('outline');
    this.copyFeedback.set('');
    this.writeUrl(name);
    if (this.isNarrow()) this.focusDetail();
  }

  protected closeDetail(): void {
    const name = this.selectedName();
    if (!name) return;
    this.selectedName.set(null);
    this.copyFeedback.set('');
    this.writeUrl(null);
    window.setTimeout(() => {
      document.getElementById(`family-${name}`)?.focus();
    });
  }

  protected onEscape(): void {
    if (this.selectedName()) this.closeDetail();
  }

  protected onTab(event: KeyboardEvent): void {
    if (!this.isNarrow() || !this.selectedName()) return;
    const controls = Array.from(
      this.detailPanel()?.nativeElement.querySelectorAll<HTMLElement>(
        'button, a[href], input, select',
      ) ?? [],
    );
    if (!controls.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (
      !this.detailPanel()?.nativeElement.contains(document.activeElement)
    ) {
      event.preventDefault();
      first.focus();
    }
  }

  protected setSelectedVariant(variant: 'outline' | 'filled'): void {
    this.selectedVariant.set(variant);
    this.copyFeedback.set('');
  }

  protected setFramework(framework: Framework): void {
    this.framework.set(framework);
    this.copyFeedback.set('');
  }

  protected async copy(value: string, description: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
      this.copyFeedback.set(`${description} copied`);
    } catch {
      this.copyFeedback.set(
        `Could not copy ${description.toLowerCase()}. Select the text instead.`,
      );
    }
  }

  private readUrl(): void {
    const name = new URL(window.location.href).searchParams.get('icon');
    this.selectedName.set(name && familyByName.has(name) ? name : null);
    if (this.isNarrow() && this.selectedName()) this.focusDetail();
  }

  private writeUrl(name: string | null): void {
    const url = new URL(window.location.href);
    if (name) url.searchParams.set('icon', name);
    else url.searchParams.delete('icon');
    window.history.pushState({}, '', url);
  }

  private focusDetail(): void {
    window.setTimeout(() => {
      this.detailPanel()
        ?.nativeElement.querySelector<HTMLElement>('button')
        ?.focus();
    });
  }
}
