import {
  ActivatedRouteSnapshot,
  CanDeactivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { CategoryEditComponent } from './category-edit/category-edit.component';

export const unSavedChangesGuard: CanDeactivateFn<CategoryEditComponent> = (
  component: CategoryEditComponent,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot
) => {
  let canExitPage = component.canExit;

  if (!canExitPage) {
    return confirm('Do you want to discard the changes?');
  }

  return true;
};
