import type { NeuralIconDefinition, NeuralIconName } from '@neural-icons/core';
import { NEURAL_ICON_STROKE_WIDTH } from '@neural-icons/core';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  isDevMode,
} from '@angular/core';
import { NEURAL_ICON_REGISTRATIONS } from './provide-neural-icons';

@Component({
  selector: 'neural-icon',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-neural-icon]': 'iconName()',
  },
  template: `
    @if (resolvedIcon(); as definition) {
      <svg
        xmlns="http://www.w3.org/2000/svg"
        [attr.width]="cssSize()"
        [attr.height]="cssSize()"
        [attr.viewBox]="definition.viewBox"
        [attr.fill]="
          definition.variant === 'filled' && canFill() ? 'currentColor' : 'none'
        "
        [attr.stroke]="
          definition.variant === 'filled'
            ? (definition.stroke ?? 'currentColor')
            : 'currentColor'
        "
        [attr.stroke-width]="
          definition.variant === 'filled' ? filledStrokeWidth() : strokeWidth()
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
        @if (
          definition.variant === 'filled' &&
          canFill() &&
          !definition.separatePaths
        ) {
          <path [attr.d]="definition.paths.join(' ')" />
        } @else {
          @for (path of definition.paths; track $index) {
            <path [attr.d]="path" />
          }
        }
      </svg>
    }
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
  readonly icon = input.required<NeuralIconDefinition | NeuralIconName>();
  readonly size = input<string | number>('1em');
  readonly strokeWidth = input<number>(NEURAL_ICON_STROKE_WIDTH);
  readonly label = input<string | null>(null);

  private readonly registeredIcons = new Map<string, NeuralIconDefinition>(
    (inject(NEURAL_ICON_REGISTRATIONS, { optional: true }) ?? []).map(
      (icon) => [icon.name, icon],
    ),
  );
  private readonly warnedMissingNames = new Set<string>();

  protected readonly iconName = computed(() => {
    const icon = this.icon();
    return typeof icon === 'string' ? icon : icon.name;
  });

  protected readonly resolvedIcon = computed(() => {
    const requested = this.icon();
    if (typeof requested !== 'string') return requested;
    const definition = this.registeredIcons.get(requested);
    if (!definition && isDevMode() && !this.warnedMissingNames.has(requested)) {
      this.warnedMissingNames.add(requested);
      console.warn(
        `[neural-icons] Icon "${requested}" is not registered. Import its definition and add it to provideNeuralIcons(...).`,
      );
    }
    return definition;
  });

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

  protected readonly canFill = computed(() => {
    const icon = this.resolvedIcon();
    return (
      !!icon &&
      icon.stroke !== 'currentColor' &&
      icon.paths.every((path) => path.trim().endsWith('z'))
    );
  });
}

function strokeWidthValue(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : NEURAL_ICON_STROKE_WIDTH;
}
