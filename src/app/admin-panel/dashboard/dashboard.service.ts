import { Injectable } from '@angular/core';

import { OrderDataStorageService } from '../order/order-dataStorage.service';
import { ToastService } from '../../toastr.service';
import { Subject } from 'rxjs';
import { Order } from '../order/Order.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  updateOrders = new Subject<Order[]>();

  constructor(
    private dashboardDataStorageService: OrderDataStorageService,
    private toastr: ToastService
  ) {}

  getOrders(): void {
    this.dashboardDataStorageService.fetchOrders().subscribe({
      next: (res) => {
        this.updateOrders.next(res.orders);
      },
      error: (err) => {
        if (!err.status)
          this.toastr.showError('Server failed!', '', {
            toastClass: 'error-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
        else
          this.toastr.showError(err.error.message, '', {
            toastClass: 'error-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
      },
      complete: () => {},
    });
  }
}
