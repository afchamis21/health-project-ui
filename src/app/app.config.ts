import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi} from "@angular/common/http";
import {apiKeyInterceptor} from "./core/interceptors/api-key.interceptor";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideToastr} from "ngx-toastr";
import {errorInterceptor} from "./core/interceptors/error.interceptor";
import {AuthInterceptor} from "./core/interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([apiKeyInterceptor, errorInterceptor]),
      withInterceptorsFromDi()
    ),
    provideAnimations(),
    provideToastr({
      progressBar: true,
      newestOnTop: true,
      maxOpened: 3,
      autoDismiss: true
    }), {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};
