import { HttpInterceptorFn } from '@angular/common/http';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req);

  // if status == 401
  // call refresh token api
  // update cookie
  // retry request
};