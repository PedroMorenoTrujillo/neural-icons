import type { NeuralIconDefinition } from '@neural-icons/core';
import { InjectionToken } from '@angular/core';
import type { Provider } from '@angular/core';

export const NEURAL_ICON_REGISTRATIONS = new InjectionToken<
  readonly NeuralIconDefinition[]
>('Neural icon registrations');

/** Register only the definitions an application uses. Later registrations win. */
export function provideNeuralIcons(
  ...icons: readonly NeuralIconDefinition[]
): Provider[] {
  return icons.map((icon) => ({
    provide: NEURAL_ICON_REGISTRATIONS,
    useValue: icon,
    multi: true,
  }));
}
