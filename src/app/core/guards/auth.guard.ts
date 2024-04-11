import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth/auth.service";
import {ToastrService} from "ngx-toastr";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const toastr = inject(ToastrService)
  const router = inject(Router)

  if (authService.isLoggedIn) {
    return true
  }

  toastr.info("Você precisar estar logado para acessar essa página!")

  return router.createUrlTree(['/login'])
};
