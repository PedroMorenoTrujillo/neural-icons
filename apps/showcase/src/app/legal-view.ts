import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LEGAL_CONTENT, type LegalPageType } from './legal-content';
import type { Locale } from './showcase-copy';

export function legalKindFromUrl(url: URL): LegalPageType | null {
  const match = url.pathname.match(/^\/(?:es\/)?(legal-notice|privacy|cookies)\/?$/);
  return match ? match[1] as LegalPageType : null;
}

@Component({
  selector: 'app-legal-view',
  template: `
    <article class="legal-page">
      <h1>{{ content().title }}</h1><p>{{ content().updated }}</p><p>{{ content().notice }}</p>
      @for (section of content().sections; track section.heading) {
        <section><h2>{{ section.heading }}</h2>@for (paragraph of section.paragraphs; track paragraph) { <p>{{ paragraph }}</p> }</section>
      }
      @if (kind() === 'cookies') {
        <section><h2>{{ locale() === 'es' ? 'Inventario' : 'Inventory' }}</h2>
          <p><code>neural-icons-analytics-consent</code>: {{ locale() === 'es' ? 'localStorage necesario para recordar aceptación o rechazo, fecha y versión; válido hasta 12 meses.' : 'necessary localStorage for the choice, date and version; valid for up to 12 months.' }}</p>
          <p><code>neural-icons-theme</code>: {{ locale() === 'es' ? 'preferencia local del tema; hasta borrarla en el navegador.' : 'local theme preference; until cleared in the browser.' }}</p>
          <p><code>_ga, _ga_&lt;ID&gt;</code>: {{ locale() === 'es' ? 'cookies de Google Analytics solo tras aceptar; máximo 12 meses sin renovación automática, limitadas a icons.neuralui.org.' : 'Google Analytics cookies only after acceptance; up to 12 months without automatic renewal, scoped to icons.neuralui.org.' }}</p>
        </section>
      }
      <nav [attr.aria-label]="locale() === 'es' ? 'Proveedores y derechos' : 'Providers and rights'">
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google</a>
        <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Cloudflare</a>
        <a href="https://www.aepd.es/" target="_blank" rel="noopener noreferrer">AEPD</a>
      </nav>
    </article>
  `,
  styles: `:host { display: block; min-width: 0; } .legal-page { max-width: 76ch; margin-inline: auto; padding: 2rem 1rem; overflow-wrap: anywhere; } section { margin-block: 2rem; } p { line-height: 1.75; } nav { display: flex; flex-wrap: wrap; gap: 1rem; } a { color: var(--accent); }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalView {
  readonly kind = input.required<LegalPageType>();
  readonly locale = input.required<Locale>();
  readonly content = computed(() => LEGAL_CONTENT[this.locale()][this.kind()]);
}
