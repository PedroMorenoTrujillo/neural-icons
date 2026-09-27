import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { showcaseCopy } from './showcase-copy';

type Framework = 'html' | 'angular' | 'react' | 'vue';

@Component({
  selector: 'app-guide-view',
  templateUrl: './guide-view.html',
  styleUrl: './guide-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class GuideView {
  readonly copy = input.required<typeof showcaseCopy.en>();
  readonly framework = input.required<Framework>();
  readonly installSnippet = input.required<string>();
  readonly setupSnippet = input.required<string>();
  readonly colorSnippet = input.required<string>();
  readonly accessibilitySnippet = input.required<string>();
  readonly frameworkChange = output<Framework>();
}
