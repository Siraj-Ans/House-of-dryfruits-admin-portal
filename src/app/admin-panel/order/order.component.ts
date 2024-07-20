import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

import { OrderService } from './order.service';

import { Order } from './Order.model';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './order.component.html',
})
export class OrderComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  updateOrdersSubscription: Subscription | undefined;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders();

    this.updateOrdersSubscription = this.orderService.updateOrders.subscribe(
      (orders) => {
        this.orders = orders;
      }
    );
  }

  ngOnDestroy(): void {
    this.updateOrdersSubscription?.unsubscribe();
  }
}
