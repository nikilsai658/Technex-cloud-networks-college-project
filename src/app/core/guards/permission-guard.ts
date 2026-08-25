import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Auth } from '../auth/auth';

export const permissionGuard: CanActivateChildFn = (route) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const auth = inject(Auth);
  const router = inject(Router);

  const permission = route.data['permission'] as string | undefined;

  if (!permission || auth.hasPermission(permission)) {
    return true;
  }

  return router.createUrlTree(['/page-not-found']);
};
