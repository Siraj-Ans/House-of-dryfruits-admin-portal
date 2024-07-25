import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { LoadSpinner } from '../../shared/load-spinner/load-spinner.component';
import { PulseLoadSpinnerComponent } from '../../shared/pulse-load-spinner/pulse-load-spinner.component';

import { OrderService } from './order.service';

import { Order } from './Order.model';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    LoadSpinner,
    PulseLoadSpinnerComponent,
    LoadSpinner,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  orderForm!: FormGroup;
  updateMode = false;
  selectedOrderId: string | undefined;
  loading = false;
  updatingOrderStatus = false;
  paidLoadingStatus = false;
  fullfilledLoadingStatus = false;
  updateOrdersSubscription: Subscription | undefined;
  updateLoadingStatusSubscription: Subscription | undefined;
  updatingOrderStatusSubscription: Subscription | undefined;
  updateModeSubscription: Subscription | undefined;

  constructor(private orderService: OrderService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.orderService.getOrders();

    this.orderForm = this.fb.group({
      paidStatus: ['null', Validators.required], // Default empty value
      shipmentStatus: ['null', Validators.required], // Default empty value
      trackingId: ['null', Validators.required], // Default empty value
    });

    this.updateOrdersSubscription = this.orderService.updateOrders.subscribe(
      (orders) => {
        this.orders = orders;
      }
    );

    this.updateLoadingStatusSubscription =
      this.orderService.updateLoadingStatus.subscribe((status) => {
        this.loading = status;
      });

    this.updatingOrderStatusSubscription =
      this.orderService.updatingOrderStatus.subscribe((status) => {
        this.updatingOrderStatus = status;
      });

    this.updateModeSubscription = this.orderService.updateMode.subscribe(
      (status) => {
        this.updateMode = status;
      }
    );
  }

  onSubmit(): void {
    if (this.orderForm.invalid) return;

    this.orderService.updateOrderStatus(
      this.orderForm.value.paidStatus,
      this.orderForm.value.shipmentStatus,
      this.orderForm.value.trackingId,
      this.selectedOrderId!
    );
  }

  onUpdateProductStatus(i: number): void {
    this.orderForm.setValue({
      paidStatus: this.orders[i].paid ? 'paid' : 'unpaid',
      shipmentStatus: this.orders[i].fullfilled,
      trackingId: this.orders[i].trackingId ? this.orders[i].trackingId : null,
    });
    this.selectedOrderId = this.orders[i].id;

    if (!this.updateMode) this.updateMode = !this.updateMode;
  }

  ngOnDestroy(): void {
    this.updateOrdersSubscription?.unsubscribe();
    this.updateLoadingStatusSubscription?.unsubscribe();
    this.updatingOrderStatusSubscription?.unsubscribe();
    this.updateModeSubscription?.unsubscribe();
  }
}
