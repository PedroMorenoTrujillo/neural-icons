import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { NeuralIcon } from '@neural-icons/angular';
import { iconArrowRight } from '@neural-icons/core/icons/arrow-right';
import { EcosystemView } from './ecosystem-view';
import { showcaseCopy, type Locale } from './showcase-copy';
import { showcasePath } from './showcase-url';
import type { IconFamily, Theme, View } from './showcase-model';

const translations = {
  en: {
    headline: 'SVG icons for the web',
    description: 'A consistent set of icons in outline and filled for HTML, Angular, React and Vue.',
    explore: 'Explore icons',
    preview: 'Try the two styles',
    families: 'icon families',
    variants: 'SVG variants',
    usage: 'Use the SVG directly in HTML or import individual icons with your framework adapter. Style inline SVGs and icon components with CSS through currentColor.',
  },
  es: {
    headline: 'Iconos SVG para la web',
    description: 'Una colección de iconos con variantes de contorno y relleno para HTML, Angular, React y Vue.',
    explore: 'Explorar iconos',
    preview: 'Prueba los dos estilos',
    families: 'familias de iconos',
    variants: 'variantes SVG',
    usage: 'Usa el SVG directamente en HTML o importa cada icono con el adaptador de tu framework. Da color con CSS a los SVG en línea y a los componentes mediante currentColor.',
  },
};

@Component({
  selector: 'app-home-view',
  imports: [NeuralIcon, EcosystemView],
  templateUrl: './home-view.html',
  styleUrl: './home-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeView {
  readonly locale = input.required<Locale>();
  readonly theme = input.required<Theme>();
  readonly total = input.required<number>();
  readonly featured = input.required<readonly IconFamily[]>();
  readonly catalogHref = input.required<string>();
  readonly guideHref = input.required<string>();
  readonly navigate = output<{ event: MouseEvent; view: View }>();
  protected readonly variant = signal<'outline' | 'filled'>('outline');
  protected readonly copy = computed(() => showcaseCopy[this.locale()]);
  protected readonly t = computed(() => translations[this.locale()]);
  protected readonly arrow = iconArrowRight;

  protected iconHref(name: string): string {
    const path = showcasePath(this.locale(), name, 'catalog');
    return this.variant() === 'filled' ? `${path}?variant=filled` : path;
  }
}
