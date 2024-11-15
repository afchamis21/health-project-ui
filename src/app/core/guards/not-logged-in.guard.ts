import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth/auth.service";

export const notLoggedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (!authService.isLoggedIn) {
    return true
  }

  return router.createUrlTree(['/dashboard'])
};
