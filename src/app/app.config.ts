import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';

export const appConfig: ApplicationConfig = {
  providers: [
  provideBrowserGlobalErrorListeners(),
  provideRouter(routes),
  provideClientHydration(withEventReplay()),
   providePrimeNG({
            theme: {
                preset: Aura
            }
        }),
    provideBrowserGlobalErrorListeners(),
   CookieService
]
};
