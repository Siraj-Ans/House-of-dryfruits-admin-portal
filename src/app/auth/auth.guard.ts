import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateFn,
} from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const isAuth = inject(AuthService).getIsAuthenticated();

  if (!isAuth) {
    inject(Router).navigate(['auth']);
    return false;
  }

  return true;
};
