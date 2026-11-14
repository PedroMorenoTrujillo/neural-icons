import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { showcaseCopy, type Locale } from './showcase-copy';
import { EcosystemView } from './ecosystem-view';
import type { Theme } from './showcase-model';

type Framework = 'html' | 'angular' | 'react' | 'vue';

@Component({
  selector: 'app-guide-view',
  imports: [EcosystemView],
  templateUrl: './guide-view.html',
  styleUrl: './guide-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class GuideView {
  readonly copy = input.required<typeof showcaseCopy.en>();
  readonly locale = input.required<Locale>();
  readonly theme = input.required<Theme>();
  readonly framework = input.required<Framework>();
  readonly installSnippet = input.required<string>();
  readonly setupSnippet = input.required<string>();
  readonly colorSnippet = input.required<string>();
  readonly accessibilitySnippet = input.required<string>();
  readonly frameworkChange = output<Framework>();
}
