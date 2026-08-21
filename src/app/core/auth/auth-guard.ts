import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const cookie = inject(CookieService);
  const router = inject(Router);

  if (cookie.get('token')) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};
