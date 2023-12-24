import {HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {catchError, switchMap, throwError} from "rxjs";
import {inject} from "@angular/core";
import {JwtService} from "../services/jwt.service";
import {AuthService} from "../services/auth.service";

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService)

  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${jwtService.accessToken}`
    }
  });

  return next(req).pipe(
    catchError((error) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      if (req.url.includes('auth/login')) {
        return throwError(() => error);
      }

      if (req.url.includes('auth/refresh')) {
        handleLogout()
        return throwError(() => error);
      }

      if (error.status === 401) {
        return handle401Error(req, next);
      }

      return throwError(() => error);
    })
  );
};

function handleLogout() {
  const authService = inject(AuthService)
  authService.logout()
}

function handle401Error(request: HttpRequest<any>, next: HttpHandlerFn) {
  const authService = inject(AuthService)

  if (!isRefreshing) {
    isRefreshing = true;

    if (authService.isLoggedIn) {
      return authService.refreshTokens().pipe(
        switchMap((res) => {
          isRefreshing = false;

          return next(request.clone({
            setHeaders: {
              Authorization: `Bearer ${res.body.accessToken}`
            }
          }));
        }),
        catchError((error) => {
          isRefreshing = false;

          if (error.status == '401') {
            authService.logout();
          }

          return throwError(() => error);
        })
      );
    }
  }

  return next(request);
}
