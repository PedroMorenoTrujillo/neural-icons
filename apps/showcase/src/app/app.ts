import { iconSearch } from '@neural-icons/core/icons/search';
import { iconHome } from '@neural-icons/core/icons/home';
import { iconMessage } from '@neural-icons/core/icons/message';
import { iconSparkles } from '@neural-icons/core/icons/sparkles';
import { showcaseCopy, type Locale } from './showcase-copy';
import { SITE_ORIGIN } from './site-origin';
import { ShowcaseHeader } from './showcase-header';
import { GuideView } from './guide-view';
import { CatalogView } from './catalog-view';
import { DetailPanel } from './detail-panel';
import type { Framework, Theme, View } from './showcase-model';
import {
  categories,
  families,
  familyByName,
  spanishSearchTerms,
} from './showcase-data';
import {
  exportName,
  imageSnippet,
  inlineSvgSnippet,
  usageSnippet,
} from './showcase-snippets';
import { Meta, Title } from '@angular/platform-browser';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DOCUMENT,
  DestroyRef,
  inject,
  REQUEST,
  signal,
  ViewEncapsulation,
  viewChild,
} from '@angular/core';

type CopyItem = 'name' | 'import' | 'asset' | 'snippet';

function frameworkFromUrl(url: URL): Framework {
  const value = url.searchParams.get('framework');
  return value === 'angular' || value === 'react' || value === 'vue'
    ? value
    : 'html';
}

function viewFromUrl(url: URL): View {
  return !url.searchParams.has('icon') &&
    (url.searchParams.get('view') === 'guide' ||
      ['#installation', '#usage', '#color'].includes(url.hash))
    ? 'guide'
    : 'catalog';
}

@Component({
  imports: [ShowcaseHeader, GuideView, CatalogView, DetailPanel],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.theme-dark]': "theme() === 'dark'",
  },
})
export class App {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly request = inject(REQUEST, { optional: true });
  private readonly siteOrigin = inject(SITE_ORIGIN, { optional: true });
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly initialUrl = new URL(
    this.request?.url ??
      (typeof window === 'undefined'
        ? 'http://localhost/'
        : window.location.href),
  );
  protected readonly detailPanel = viewChild(DetailPanel);
  protected readonly searchIcon = iconSearch;
  protected readonly heroIcons = [iconHome, iconMessage, iconSparkles] as const;
  protected readonly locale = signal<Locale>(
    this.initialUrl.searchParams.get('lang') === 'es' ? 'es' : 'en',
  );
  protected readonly t = computed(() => showcaseCopy[this.locale()]);
  protected readonly query = signal('');
  protected readonly view = signal<View>(viewFromUrl(this.initialUrl));
  protected readonly category = signal('all');
  protected readonly selectedName = signal<string | null>(
    familyByName.has(this.initialUrl.searchParams.get('icon') ?? '')
      ? this.initialUrl.searchParams.get('icon')
      : null,
  );
  protected readonly selectedVariant = signal<'outline' | 'filled'>(
    this.initialUrl.searchParams.get('variant') === 'filled'
      ? 'filled'
      : 'outline',
  );
  protected readonly framework = signal<Framework>(
    frameworkFromUrl(this.initialUrl),
  );
  protected readonly theme = signal<Theme>('light');
  protected readonly isNarrow = signal(false);
  protected readonly previewColor = signal('#236ed8');
  protected readonly copyFeedback = signal('');
  protected readonly categories = categories;
  protected readonly total = families.length;
  protected readonly sizes = [16, 20, 24, 32] as const;
  protected readonly colors = [
    '#236ed8',
    '#152033',
    '#de5e47',
    '#228b70',
  ] as const;

  protected viewHref(view: View): string {
    const params = new URLSearchParams();
    if (view === 'guide') params.set('view', 'guide');
    if (this.locale() === 'es') params.set('lang', 'es');
    if (this.framework() !== 'html') params.set('framework', this.framework());
    const query = params.toString();
    return query ? `/?${query}` : '/';
  }

  protected readonly icons = computed(() => {
    const query = this.query().trim().toLowerCase();
    const category = this.category();
    return families.filter(
      (family) =>
        (category === 'all' || family.category === category) &&
        (!query ||
          [
            family.name,
            family.category,
            this.categoryLabel(family.category),
            ...family.keywords,
            ...(this.locale() === 'es'
              ? (spanishSearchTerms[family.name] ?? [])
              : []),
          ].some((value) => value.toLowerCase().includes(query))),
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
  protected readonly svgAssetPath = computed(() => {
    const definition = this.definition();
    return definition ? `/icons/${definition.name}.svg` : '';
  });
  protected readonly installSnippet = computed(() => {
    const framework = this.framework();
    return framework === 'html'
      ? '/icons/search.svg'
      : `npm install @neural-icons/core@0.0.1-next.2 @neural-icons/${framework}@0.0.1-next.2`;
  });
  protected readonly setupSnippet = computed(() =>
    this.framework() === 'html'
      ? imageSnippet(iconSearch, this.locale() === 'es' ? 'Buscar' : 'Search')
      : usageSnippet(this.framework(), iconSearch),
  );
  protected readonly colorSnippet = computed(() => {
    switch (this.framework()) {
      case 'angular':
        return `<neural-icon [icon]="iconSearch" class="brand" />\n\n.brand { color: #8b5cf6; }`;
      case 'react':
        return `<NeuIcon icon={iconSearch} className="brand" />\n\n.brand { color: #8b5cf6; }`;
      case 'vue':
        return `<NeuIcon :icon="iconSearch" class="brand" />\n\n.brand { color: #8b5cf6; }`;
      case 'html':
        return inlineSvgSnippet(iconSearch);
    }
  });
  protected readonly accessibilitySnippet = computed(() => {
    const label = this.locale() === 'es' ? 'Buscar' : 'Search';
    switch (this.framework()) {
      case 'html': {
        const decorative = inlineSvgSnippet(iconSearch).split('\n\n<style>')[0];
        const informative = decorative.replace(
          'aria-hidden="true"',
          `role="img" aria-label="${label}"`,
        );
        return `<img src="/icons/search.svg" alt="">\n<img src="/icons/search.svg" alt="${label}">\n\n${informative}\n\n<button type="button" aria-label="${label}">\n  <img src="/icons/search.svg" alt="">\n</button>`;
      }
      case 'angular':
        return `<neural-icon [icon]="iconSearch" label="${label}" />\n<button type="button" aria-label="${label}">\n  <neural-icon [icon]="iconSearch" />\n</button>`;
      case 'react':
        return `<NeuIcon icon={iconSearch} aria-label="${label}" />\n<button type="button" aria-label="${label}">\n  <NeuIcon icon={iconSearch} />\n</button>`;
      case 'vue':
        return `<NeuIcon :icon="iconSearch" aria-label="${label}" />\n<button type="button" aria-label="${label}">\n  <NeuIcon :icon="iconSearch" />\n</button>`;
    }
  });
  protected readonly snippet = computed(() => {
    const definition = this.definition();
    return definition ? usageSnippet(this.framework(), definition) : '';
  });

  protected categoryLabel(category: string): string {
    const labels = this.t();
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

  constructor() {
    this.updateSeo(this.initialUrl);
    afterNextRender(() => {
      this.readUrl();
      try {
        const saved = window.localStorage.getItem('neural-icons-theme');
        this.theme.set(
          saved === 'light' || saved === 'dark'
            ? saved
            : window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light',
        );
      } catch {
        this.theme.set(
          window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light',
        );
      }
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

  protected clearQuery(): void {
    this.query.set('');
  }

  protected setCategory(category: string): void {
    this.category.set(category);
  }

  protected setLocale(locale: Locale): void {
    if (this.locale() === locale) return;
    this.locale.set(locale);
    this.copyFeedback.set('');
    const url = new URL(window.location.href);
    if (locale === 'es') url.searchParams.set('lang', 'es');
    else url.searchParams.delete('lang');
    window.history.pushState({}, '', url);
    this.updateSeo(url);
  }

  protected setView(event: MouseEvent, view: View): void {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    if (this.view() === view) return;
    this.view.set(view);
    this.selectedName.set(null);
    this.copyFeedback.set('');
    const url = new URL(window.location.href);
    if (view === 'guide') url.searchParams.set('view', 'guide');
    else url.searchParams.delete('view');
    url.searchParams.delete('icon');
    url.searchParams.delete('variant');
    url.hash = '';
    window.history.pushState({}, '', url);
    this.updateSeo(url);
    window.scrollTo({ top: 0 });
  }

  protected setTheme(theme: Theme): void {
    this.theme.set(theme);
    try {
      window.localStorage.setItem('neural-icons-theme', theme);
    } catch {
      // The selected theme still works when storage is unavailable.
    }
  }

  protected setPreviewColor(color: string): void {
    this.previewColor.set(color);
  }

  protected selectFamily(event: MouseEvent, name: string): void {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
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
    this.detailPanel()?.trapFocus(event);
  }

  protected setSelectedVariant(variant: 'outline' | 'filled'): void {
    if (this.selectedVariant() === variant) return;
    this.selectedVariant.set(variant);
    this.copyFeedback.set('');
    const url = new URL(window.location.href);
    if (variant === 'filled') url.searchParams.set('variant', 'filled');
    else url.searchParams.delete('variant');
    window.history.pushState({}, '', url);
    this.updateSeo(url);
  }

  protected setFramework(framework: Framework): void {
    if (this.framework() === framework) return;
    this.framework.set(framework);
    this.copyFeedback.set('');
    const url = new URL(window.location.href);
    if (framework === 'html') url.searchParams.delete('framework');
    else url.searchParams.set('framework', framework);
    window.history.pushState({}, '', url);
    this.updateSeo(url);
  }

  protected async copy(value: string, item: CopyItem): Promise<void> {
    const description = this.t()[item];
    try {
      await navigator.clipboard.writeText(value);
      this.copyFeedback.set(
        this.locale() === 'es'
          ? `Copiado: ${description}`
          : `${description} copied`,
      );
    } catch {
      this.copyFeedback.set(
        this.locale() === 'es'
          ? `No se pudo copiar ${description.toLowerCase()}. Selecciona el texto para copiarlo.`
          : `Could not copy ${description.toLowerCase()}. Select the text instead.`,
      );
    }
  }

  private readUrl(): void {
    const url = new URL(window.location.href);
    const locale: Locale = url.searchParams.get('lang') === 'es' ? 'es' : 'en';
    this.locale.set(locale);
    const name = url.searchParams.get('icon');
    this.view.set(viewFromUrl(url));
    this.selectedName.set(name && familyByName.has(name) ? name : null);
    this.selectedVariant.set(
      url.searchParams.get('variant') === 'filled' ? 'filled' : 'outline',
    );
    this.framework.set(frameworkFromUrl(url));
    this.updateSeo(url);
    if (this.isNarrow() && this.selectedName()) this.focusDetail();
  }

  private writeUrl(name: string | null): void {
    const url = new URL(window.location.href);
    if (name) url.searchParams.set('icon', name);
    else url.searchParams.delete('icon');
    url.searchParams.delete('variant');
    window.history.pushState({}, '', url);
    this.updateSeo(url);
  }

  private updateSeo(url: URL): void {
    const locale = this.locale();
    const name = this.selectedName();
    const guide = this.view() === 'guide' && !name;
    const title = name
      ? locale === 'es'
        ? `${name} — Icono de Neural Icons`
        : `${name} — Neural Icons icon`
      : guide
        ? locale === 'es'
          ? 'Instalación y uso — Neural Icons'
          : 'Install and use — Neural Icons'
        : locale === 'es'
          ? 'Catálogo de iconos — Neural Icons'
          : 'Icon catalog — Neural Icons';
    const description = name
      ? locale === 'es'
        ? `Compara ${name} en contorno y relleno, copia el SVG o úsalo en HTML, Angular, React y Vue.`
        : `Compare ${name} in outline and filled, copy its SVG, or use it in HTML, Angular, React and Vue.`
      : guide
        ? locale === 'es'
          ? 'Instala Neural Icons y aprende a usar sus SVG en HTML, Angular, React y Vue sin Neural UI.'
          : 'Install Neural Icons and use its SVGs in HTML, Angular, React and Vue without Neural UI.'
        : locale === 'es'
          ? 'Explora 197 familias de Neural Icons con variantes de contorno y relleno para HTML, Angular, React y Vue.'
          : 'Explore 197 Neural Icons families with outline and filled variants for HTML, Angular, React and Vue.';
    this.document.documentElement.lang = locale;
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    const canonical = new URL('/', this.siteOrigin || url.origin);
    if (name) canonical.searchParams.set('icon', name);
    else if (guide) canonical.searchParams.set('view', 'guide');
    if (locale === 'es') canonical.searchParams.set('lang', 'es');
    this.meta.updateTag({ property: 'og:url', content: canonical.href });
    this.setHeadLink('canonical', canonical.href);
    for (const language of ['en', 'es'] as const) {
      const alternate = new URL(canonical);
      if (language === 'es') alternate.searchParams.set('lang', 'es');
      else alternate.searchParams.delete('lang');
      this.setHeadLink('alternate', alternate.href, language);
    }
    this.meta.updateTag({
      name: 'robots',
      content:
        url.searchParams.has('icon') && !name
          ? 'noindex, follow'
          : 'index, follow',
    });
  }

  private setHeadLink(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang
      ? `link[rel="${rel}"][hreflang="${hreflang}"]`
      : `link[rel="${rel}"]`;
    let link = this.document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.document.createElement('link');
      link.rel = rel;
      if (hreflang) link.hreflang = hreflang;
      this.document.head.appendChild(link);
    }
    link.href = href;
  }

  private focusDetail(): void {
    window.setTimeout(() => {
      this.detailPanel()?.focusClose();
    });
  }
}
