import { provideZonelessChangeDetection } from '@angular/core';
import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
import { NeuralIconHydrationFixture } from './app';

bootstrapApplication(NeuralIconHydrationFixture, {
  providers: [provideZonelessChangeDetection(), provideClientHydration()],
}).catch((error) => console.error(error));
