import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { Auth } from '../auth/auth';

export const permissionGuard: CanActivateChildFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const permission = route.data['permission'] as string | undefined;

  if (!permission || auth.hasPermission(permission)) {
    return true;
  }

  return router.createUrlTree(['/page-not-found']);
};
