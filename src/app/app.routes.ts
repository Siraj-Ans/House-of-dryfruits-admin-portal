import { Routes } from '@angular/router';

import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { DashboardComponent } from './admin-panel/dashboard/dashboard.component';
import { ProductComponent } from './admin-panel/product/product.component';
import { CategoryComponent } from './admin-panel/category/category.component';
import { OrderComponent } from './admin-panel/order/order.component';
import { AdminComponent } from './admin-panel/admin/admin.component';
import { SettingComponent } from './admin-panel/setting/setting.component';
import { CategoryEditComponent } from './admin-panel/category/category-edit/category-edit.component';
import { EditProductComponent } from './admin-panel/product/product-edit/product-edit.component';
import { AuthComponent } from './auth/auth.component';

import { authGuard } from './auth/auth.guard';
import { unSavedChangesGuard } from './admin-panel/category/unSavedChanges.guard';
import { canActivateEditComponent } from './admin-panel/category/category-edit/canActivateEditComponet.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'adminpanel/dashboard', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  {
    path: 'adminpanel',
    redirectTo: '/adminpanel/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'adminpanel',
    component: AdminPanelComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'products',
        component: ProductComponent,
        children: [
          { path: 'create-product', component: EditProductComponent },
          {
            path: 'edit-product/:id',
            component: EditProductComponent,
          },
        ],
      },
      {
        path: 'categories',
        component: CategoryComponent,
        children: [
          {
            path: 'edit-category/:id',
            component: CategoryEditComponent,
            canActivate: [authGuard, canActivateEditComponent],
            canDeactivate: [unSavedChangesGuard],
          },
        ],
      },
      { path: 'orders', component: OrderComponent },
      { path: 'admins', component: AdminComponent },
      { path: 'settings', component: SettingComponent },
    ],
  },
];
