import type { NeuralIconDefinition } from '@neural-icons/core';
import { NEURAL_ICON_STROKE_WIDTH } from '@neural-icons/core';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'neural-icon',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-neural-icon]': 'icon().name',
  },
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="cssSize()"
      [attr.height]="cssSize()"
      [attr.viewBox]="icon().viewBox"
      [attr.fill]="
        icon().variant === 'filled' && canFill() ? 'currentColor' : 'none'
      "
      [attr.stroke]="
        icon().variant === 'filled'
          ? (icon().stroke ?? 'currentColor')
          : 'currentColor'
      "
      [attr.stroke-width]="
        icon().variant === 'filled' ? filledStrokeWidth() : strokeWidth()
      "
      fill-rule="evenodd"
      clip-rule="evenodd"
      stroke-linecap="round"
      stroke-linejoin="round"
      focusable="false"
      [attr.role]="accessibleLabel() ? 'img' : null"
      [attr.aria-label]="accessibleLabel()"
      [attr.aria-hidden]="accessibleLabel() ? null : 'true'"
    >
      @if (icon().variant === 'filled' && canFill() && !icon().separatePaths) {
        <path [attr.d]="icon().paths.join(' ')" />
      } @else {
        @for (path of icon().paths; track $index) {
          <path [attr.d]="path" />
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex: 0 0 auto;
      line-height: 0;
      vertical-align: -0.125em;
    }

    svg {
      display: block;
      overflow: visible;
    }
  `,
})
export class NeuralIcon {
  readonly icon = input.required<NeuralIconDefinition>();
  readonly size = input<string | number>('1em');
  readonly strokeWidth = input<number>(NEURAL_ICON_STROKE_WIDTH);
  readonly label = input<string | null>(null);

  protected readonly accessibleLabel = computed(
    () => this.label()?.trim() || null,
  );

  protected readonly cssSize = computed(() => {
    const size = this.size();
    return typeof size === 'number' ? `${size}px` : size;
  });

  protected readonly filledStrokeWidth = computed(
    () => strokeWidthValue(this.strokeWidth()) * 1.28,
  );

  protected readonly canFill = computed(
    () =>
      this.icon().stroke !== 'currentColor' &&
      this.icon().paths.every((path) => path.trim().endsWith('z')),
  );
}

function strokeWidthValue(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : NEURAL_ICON_STROKE_WIDTH;
}
