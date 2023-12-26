import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {JwtService} from "../services/jwt.service";
import {AuthService} from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private authService?: AuthService

  constructor(
    private jwtService: JwtService,
  ) {
    this.authService = AuthService.getRef()!
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.jwtService.accessToken}`
      }
    });

    return next.handle(req).pipe(
      catchError((error) => {
        if (!(error instanceof HttpErrorResponse)) {
          return throwError(() => error);
        }

        if (error.status !== 401) {
          return throwError(() => error);
        }

        if (req.url.includes('auth/login') || req.url.includes('auth/refresh')) {
          return throwError(() => error);
        }

        return this.handle401Error(req, next);
      })
    );
  }

  handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      if (this.authService?.isLoggedIn) {
        return this.authService.refreshTokens().pipe(
          switchMap((res) => {
            this.isRefreshing = false;

            return next.handle(request.clone({
              setHeaders: {
                Authorization: `Bearer ${res.body.accessToken}`
              }
            }));
          }),
          catchError((error) => {
            this.isRefreshing = false;

            if (error.status == '401') {
              this.authService?.logout();
            }

            return throwError(() => error);
          })
        );
      }
    }

    return next.handle(request);
  }
}
