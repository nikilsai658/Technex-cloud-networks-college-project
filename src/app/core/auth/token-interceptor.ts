import { HttpInterceptorFn } from '@angular/common/http';
import { tokenStorage } from './token-storage';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const token = tokenStorage.getAccess();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
