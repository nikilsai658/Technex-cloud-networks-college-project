import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

// Reads localStorage directly rather than going through UserStore/Auth —
// UserStore populates its signal after the first render (afterNextRender)
// to keep SSR hydration stable, but this guard runs during route
// resolution, before that render happens. It needs the permissions
// synchronously, so it can't depend on the deferred signal.
function getStoredPermissions(): any[] {

  try {

    const stored = localStorage.getItem('user');

    if (!stored) {
      return [];
    }

    return JSON.parse(stored)?.permissions ?? [];

  } catch {

    return [];

  }

}

export const permissionGuard: CanActivateChildFn = (route) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const router = inject(Router);

  const permission = route.data['permission'] as string | undefined;

  if (!permission) {
    return true;
  }

  const hasPermission = getStoredPermissions()
    .some((p: any) => p.code === permission);

  if (hasPermission) {
    return true;
  }

  return router.createUrlTree(['/page-not-found']);
};
