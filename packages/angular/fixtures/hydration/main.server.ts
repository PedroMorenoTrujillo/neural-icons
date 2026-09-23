import { provideZonelessChangeDetection } from '@angular/core';
import {
  BootstrapContext,
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { NeuralIconHydrationFixture, hydrationIconProviders } from './app';

export default (context: BootstrapContext) =>
  bootstrapApplication(
    NeuralIconHydrationFixture,
    {
      providers: [
        provideZonelessChangeDetection(),
        provideClientHydration(),
        provideServerRendering(),
        hydrationIconProviders,
      ],
    },
    context,
  );
