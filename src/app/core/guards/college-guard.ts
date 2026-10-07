import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const collegeGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const router = inject(Router);

  const collegeCode = localStorage.getItem('collegecode');

  if (collegeCode) {
    return true;
  }

  return router.createUrlTree(['/auth/college']);
};
