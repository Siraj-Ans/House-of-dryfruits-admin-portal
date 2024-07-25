import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';

import { OrderDataStorageService } from './order-dataStorage.service';
import { ToastService } from '../../toastr.service';

import { Order } from '../order/Order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  updateOrders = new Subject<Order[]>();
  updateLoadingStatus = new ReplaySubject<boolean>(0);
  updatingOrderStatus = new Subject<boolean>();
  updateMode = new Subject<boolean>();

  constructor(
    private orderDataStorageService: OrderDataStorageService,
    private toastr: ToastService
  ) {}

  getOrders(): void {
    this.updateLoadingStatus.next(true);
    this.orderDataStorageService.fetchOrders().subscribe({
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
        this.updateLoadingStatus.next(false);
      },
      complete: () => {
        this.updateLoadingStatus.next(false);
      },
    });
  }

  updateOrderStatus(
    paidStatus: string,
    shipmentStatus: string,
    trackingId: string,
    orderId: string
  ): void {
    this.updatingOrderStatus.next(true);
    this.orderDataStorageService
      .updateOrderStatus(paidStatus, shipmentStatus, trackingId, orderId)
      .subscribe({
        next: (res) => {
          this.updateMode.next(false);
          this.getOrders();
          this.toastr.showSuccess('Order status updated!', '', {
            toastClass: 'success-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
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
          this.updatingOrderStatus.next(false);
        },
        complete: () => {
          this.updatingOrderStatus.next(false);
        },
      });
  }
}
