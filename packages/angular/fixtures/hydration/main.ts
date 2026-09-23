import { provideZonelessChangeDetection } from '@angular/core';
import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
import { NeuralIconHydrationFixture, hydrationIconProviders } from './app';

bootstrapApplication(NeuralIconHydrationFixture, {
  providers: [
    provideZonelessChangeDetection(),
    provideClientHydration(),
    hydrationIconProviders,
  ],
}).catch((error) => console.error(error));
