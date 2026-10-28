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
import { showcaseCopy } from './showcase-copy';
import type { Framework, IconFamily } from './showcase-model';

type Variant = 'outline' | 'filled';
type CopyItem = 'name' | 'import' | 'asset' | 'snippet';

@Component({
  selector: 'app-detail-panel',
  imports: [NeuralIcon],
  templateUrl: './detail-panel.html',
  styleUrl: './detail-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DetailPanel {
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  readonly copy = input.required<typeof showcaseCopy.en>();
  readonly family = input.required<IconFamily>();
  readonly definition = input.required<NeuralIconDefinition | undefined>();
  readonly selectedVariant = input.required<Variant>();
  readonly framework = input.required<Framework>();
  readonly isNarrow = input.required<boolean>();
  readonly previewColor = input.required<string>();
  readonly sizes = input.required<readonly number[]>();
  readonly colors = input.required<readonly string[]>();
  readonly importStatement = input.required<string>();
  readonly svgAssetPath = input.required<string>();
  readonly snippet = input.required<string>();
  readonly copyFeedback = input.required<string>();
  readonly closeRequested = output<void>();
  readonly variantChange = output<Variant>();
  readonly frameworkChange = output<Framework>();
  readonly colorChange = output<string>();
  readonly copyRequested = output<{ value: string; item: CopyItem }>();

  focusClose(): void {
    this.panel()?.nativeElement.querySelector<HTMLElement>('button')?.focus();
  }

  trapFocus(event: KeyboardEvent): void {
    const panel = this.panel()?.nativeElement;
    const controls = Array.from(
      panel?.querySelectorAll<HTMLElement>('button, a[href], input, select') ??
        [],
    );
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (!panel?.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
    }
  }

  categoryLabel(category: string): string {
    const labels = this.copy();
    switch (category) {
      case 'action':
        return labels.action;
      case 'commerce':
        return labels.commerce;
      case 'communication':
        return labels.communication;
      case 'file':
        return labels.file;
      case 'media':
        return labels.media;
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

  variantLabel(variant: Variant): string {
    return this.copy()[variant];
  }

  frameworkLabel(): string {
    const framework = this.framework();
    return framework === 'html'
      ? 'HTML'
      : framework[0].toUpperCase() + framework.slice(1);
  }
}
