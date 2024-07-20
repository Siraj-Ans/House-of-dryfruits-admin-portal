import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { OrderDataStorageService } from './order-dataStorage.service';

import { Order } from './Order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  updateOrders = new Subject<Order[]>();

  constructor(private orderDataStorageService: OrderDataStorageService) {}

  getOrders(): void {
    this.orderDataStorageService.fetchOrders().subscribe({
      next: (res) => {
        this.updateOrders.next(res.orders);
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
