import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthServices } from '../../features/services/auth/auth-services';

// Module-level so concurrent requests share one in-flight refresh call.
let isRefreshing = false;
const refreshedToken$ = new BehaviorSubject<string | null>(null);

function withAuthHeader(
  req: HttpRequest<unknown>,
  token: string
): HttpRequest<unknown> {

  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const cookie = inject(CookieService);
  const authServices = inject(AuthServices);

  // Never attempt a refresh for the login/refresh calls themselves —
  // that would loop forever if the refresh token is also invalid.
  const isAuthRoute =
    req.url.includes('Auth/login') ||
    req.url.includes('Auth/refresh-token');

  return next(req).pipe(

    catchError((error: unknown) => {

      if (
        !(error instanceof HttpErrorResponse) ||
        error.status !== 401 ||
        isAuthRoute
      ) {
        return throwError(() => error);
      }

      const refreshToken = cookie.get('refresh');

      if (!refreshToken) {
        return throwError(() => error);
      }

      if (isRefreshing) {

        // A refresh is already in flight — wait for it, then retry.
        return refreshedToken$.pipe(
          filter((token): token is string => token !== null),
          take(1),
          switchMap(token => next(withAuthHeader(req, token)))
        );

      }

      isRefreshing = true;
      refreshedToken$.next(null);

      return authServices.refreshToken(refreshToken).pipe(

        switchMap((res: any) => {

          const data = res?.data || res;

          const newAccessToken = data?.accessToken;
          const newRefreshToken = data?.refreshToken;

          if (!newAccessToken) {
            isRefreshing = false;
            return throwError(() => error);
          }

          cookie.set('token', newAccessToken, 7, '/');

          if (newRefreshToken) {
            cookie.set('refresh', newRefreshToken, 7, '/');
          }

          isRefreshing = false;
          refreshedToken$.next(newAccessToken);

          return next(withAuthHeader(req, newAccessToken));

        }),

        catchError((refreshError) => {

          // Refresh token itself is invalid/expired — Api's own
          // 401 handling will clear cookies and redirect to login.
          isRefreshing = false;
          refreshedToken$.next(null);

          return throwError(() => refreshError);

        })

      );

    })

  );

};
