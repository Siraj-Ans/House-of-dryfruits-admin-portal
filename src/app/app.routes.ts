import { Routes } from '@angular/router';

import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { DashboardComponent } from './admin-panel/dashboard/dashboard.component';
import { ProductComponent } from './admin-panel/product/product.component';
import { CategoryComponent } from './admin-panel/category/category.component';
import { OrderComponent } from './admin-panel/order/order.component';
import { AdminComponent } from './admin-panel/admin/admin.component';
import { SettingComponent } from './admin-panel/setting/setting.component';
import { AuthComponent } from './auth/auth.component';

import { authGuard } from './auth/auth.guard';

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
      { path: 'products', component: ProductComponent },
      { path: 'categories', component: CategoryComponent },
      { path: 'orders', component: OrderComponent },
      { path: 'admins', component: AdminComponent },
      { path: 'settings', component: SettingComponent },
    ],
  },
];
