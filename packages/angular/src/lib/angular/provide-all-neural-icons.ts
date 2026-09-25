import { neuralIcons } from '@neural-icons/core/catalog';
import type { Provider } from '@angular/core';
import { provideNeuralIcons } from './provide-neural-icons';

/** Opt in to the complete catalog. This intentionally increases bundle size. */
export function provideAllNeuralIcons(): Provider[] {
  return provideNeuralIcons(...neuralIcons);
}
