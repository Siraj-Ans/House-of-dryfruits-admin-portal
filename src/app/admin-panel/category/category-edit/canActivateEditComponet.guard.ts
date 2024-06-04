import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RedirectCommand,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { CategoryService } from '../category.service';

export const canActivateEditComponent: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(CategoryService);
  const router = inject(Router);
  let mode = authService.getEditMode();

  if (mode === 'no-edit')
    return new RedirectCommand(router.parseUrl('/adminpanel/categories'));

  return true;
};
