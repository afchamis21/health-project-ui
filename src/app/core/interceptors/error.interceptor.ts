import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {ToastrService} from "ngx-toastr";
import {catchError, throwError} from "rxjs";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastrService = inject(ToastrService)


  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse) {
        const messages: string[] | undefined = error.error?.metadata?.messages
        messages?.forEach(message => {
          toastrService.error(message, "Erro")
        })
      }
      return throwError(() => error);
    })
  );
};
