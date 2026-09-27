import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { SITE_ORIGIN } from './site-origin';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: SITE_ORIGIN, useValue: process.env['NEURAL_ICONS_SITE_ORIGIN'] ?? '' },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
