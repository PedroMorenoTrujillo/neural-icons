import { NeuralIcon } from '@neural-icons/angular';
import { iconGlobe } from '@neural-icons/core/icons/globe';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import type { Locale } from './showcase-copy';
import { showcaseCopy } from './showcase-copy';

type View = 'catalog' | 'guide';
type Theme = 'light' | 'dark';

@Component({
  selector: 'app-showcase-header',
  imports: [NeuralIcon],
  templateUrl: './showcase-header.html',
  styleUrl: './showcase-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ShowcaseHeader {
  protected readonly iconGlobe = iconGlobe;
  readonly copy = input.required<typeof showcaseCopy.en>();
  readonly view = input.required<View>();
  readonly locale = input.required<Locale>();
  readonly theme = input.required<Theme>();
  readonly isModalOpen = input.required<boolean>();
  readonly catalogHref = input.required<string>();
  readonly guideHref = input.required<string>();
  readonly navigate = output<{ event: MouseEvent; view: View }>();
  readonly localeChange = output<Locale>();
  readonly themeChange = output<Theme>();
}
