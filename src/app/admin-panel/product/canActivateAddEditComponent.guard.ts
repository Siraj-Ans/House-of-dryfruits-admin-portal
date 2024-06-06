import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RedirectCommand,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ProductService } from './product.service';

export const canActivateAddEditComponentGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const productService = inject(ProductService);
  const router = inject(Router);
  const mode = productService.getEditAddMode();

  if (!mode)
    return new RedirectCommand(router.parseUrl('/adminpanel/products'));

  return true;
};
