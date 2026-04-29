import { CanActivateFn } from '@angular/router';

export const featuresFlagGuard: CanActivateFn = (route, state) => {
  return true;
};
