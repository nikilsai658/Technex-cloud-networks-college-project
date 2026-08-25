import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const assignmentGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const router = inject(Router);

  const assignmentId = sessionStorage.getItem('activeAssignmentId');

  if (assignmentId) {
    return true;
  }

  return router.createUrlTree(['/student/assignments']);
};