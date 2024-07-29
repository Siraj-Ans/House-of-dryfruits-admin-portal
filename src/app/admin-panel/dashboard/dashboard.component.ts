import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { subHours } from 'date-fns';

import { AuthService } from '../../auth/auth.service';

import { User } from '../../auth/user.model';
import { Order } from '../order/Order.model';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: undefined | User;
  orders: Order[] = [];
  ordersToday: Order[] = [];
  ordersWeek: Order[] = [];
  ordersMonth: Order[] = [];
  userSubscription: undefined | Subscription;
  updateOrdersSubscription: undefined | Subscription;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.updateUser.subscribe((user) => {
      this.user = user;
    });

    this.dashboardService.getOrders();

    this.updateOrdersSubscription =
      this.dashboardService.updateOrders.subscribe((orders) => {
        this.orders = orders;

        this.ordersToday = this.orders.filter(
          (order) =>
            order.completed &&
            new Date(order.createdAt) > subHours(new Date(), 24)
        );

        this.ordersWeek = this.orders.filter(
          (order) =>
            order.completed &&
            new Date(order.createdAt) > subHours(new Date(), 24 * 7)
        );

        this.ordersMonth = this.orders.filter(
          (order) =>
            order.completed &&
            new Date(order.createdAt) > subHours(new Date(), 24 * 30)
        );
      });
  }

  ordersTotal(orders: Order[]): string {
    let sum = 0;

    orders.forEach((order) => {
      order.productInfo.forEach((productInfo) => {
        const productSum = productInfo.productsTotal * productInfo.quantity;
        sum += productSum;
      });
    });

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
    }).format(sum);
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.updateOrdersSubscription?.unsubscribe();
  }
}
