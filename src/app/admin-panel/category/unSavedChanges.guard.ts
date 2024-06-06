import {
  ActivatedRouteSnapshot,
  CanDeactivateFn,
  RouterStateSnapshot,
} from '@angular/router';

import { CategoryEditComponent } from './category-edit/category-edit.component';
import { AddProductComponent } from '../product/add-product/add-product.component';
import { EditProductComponent } from '../product/edit-product/edit-product.component';
import { inject } from '@angular/core';
import { ProductService } from '../product/product.service';

export const unSavedChangesGuard: CanDeactivateFn<
  CategoryEditComponent | AddProductComponent | EditProductComponent
> = (
  component: CategoryEditComponent | EditProductComponent | AddProductComponent,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot
) => {
  const productService = inject(ProductService);
  let canExitPage = component.canExit;

  if (!canExitPage) {
    const result = confirm('Do you want to discard the changes?');

    if (result) productService.updateEditAddMode.next(false);
    else return result;
  }

  return true;
};
