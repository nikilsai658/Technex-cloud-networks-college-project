import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const assignmentGuard: CanActivateFn = () => {
  const router = inject(Router);

  const assignmentId = sessionStorage.getItem('activeAssignmentId');

  if (assignmentId) {
    return true;
  }

  return router.createUrlTree(['/student/assignments']);
};