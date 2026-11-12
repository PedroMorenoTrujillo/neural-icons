import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NeuralIcon } from '@neural-icons/angular';
import { iconArrowRight } from '@neural-icons/core/icons/arrow-right';
import { iconExternalLink } from '@neural-icons/core/icons/external-link';
import type { Locale } from './showcase-copy';
import type { Theme } from './showcase-model';

const copy = {
  en: {
    title: 'The Neural ecosystem',
    intro: 'Neural Icons is part of a family of tools for building interfaces. You can use the icons on their own.',
    explore: 'Explore the Neural ecosystem',
    web: { kind: 'Web components', description: 'Build Angular interfaces with components and themes you can adapt to your product.', preview: 'A card built with Neural UI · Screenshot in English', link: 'Explore Neural UI' },
    native: { kind: 'Mobile components', description: 'Build native interfaces for iOS and Android with Angular Native.', preview: 'Neural Native on iOS · Screenshot in English', link: 'Explore Neural Native' },
    charts: { kind: 'Native charts', description: 'Add interactive data visualizations to Angular Native apps.', preview: 'A line chart on iOS · Screenshot in English', link: 'Explore Neural Charts Native' },
    ai: { kind: 'Skills and MCP', description: 'Give your coding agent verified references for Neural’s public APIs.', preview: 'A button event in each public API', link: 'Get started with Neural AI' },
  },
  es: {
    title: 'El ecosistema Neural',
    intro: 'Neural Icons forma parte de una familia de herramientas para crear interfaces. Puedes usar los iconos de forma independiente.',
    explore: 'Explorar el ecosistema Neural',
    web: { kind: 'Componentes web', description: 'Crea interfaces Angular con componentes y temas que puedes adaptar a tu producto.', preview: 'Una tarjeta creada con Neural UI · Captura en inglés', link: 'Explorar Neural UI' },
    native: { kind: 'Componentes móviles', description: 'Crea interfaces nativas para iOS y Android con Angular Native.', preview: 'Neural Native en iOS · Captura en inglés', link: 'Explorar Neural Native' },
    charts: { kind: 'Gráficas nativas', description: 'Añade visualizaciones de datos interactivas a tus apps de Angular Native.', preview: 'Una gráfica de líneas en iOS · Captura en inglés', link: 'Explorar Neural Charts Native' },
    ai: { kind: 'Skills y MCP', description: 'Da a tu agente de programación referencias verificadas de las APIs públicas de Neural.', preview: 'El evento de un botón en cada API pública', link: 'Empezar con Neural AI' },
  },
};

@Component({
  selector: 'app-ecosystem-view',
  imports: [NeuralIcon],
  templateUrl: './ecosystem-view.html',
  styleUrl: './ecosystem-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcosystemView {
  readonly locale = input.required<Locale>();
  readonly theme = input.required<Theme>();
  protected readonly t = computed(() => copy[this.locale()]);
  protected readonly uiUrl = computed(() => `https://ui.neuralui.org/v2/${this.locale()}`);
  protected readonly products = computed(() => [
    { id: 'web', name: 'Neural UI Core', href: this.uiUrl(), ...this.t().web },
    { id: 'native', name: 'Neural Native', href: `https://native.neuralui.org/${this.locale()}`, ...this.t().native },
    { id: 'charts', name: 'Neural Charts Native', href: 'https://charts-native.neuralui.org/', ...this.t().charts },
    { id: 'ai', name: 'Neural AI', href: `${this.uiUrl()}/getting-started/ai-development`, ...this.t().ai },
  ]);
  protected readonly arrow = iconArrowRight;
  protected readonly external = iconExternalLink;
}
