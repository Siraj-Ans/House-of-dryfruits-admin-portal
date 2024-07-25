import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { FetchOrders, UpdateOrderPaidResponse } from './OrderRes.model';

import { environment } from '../../../environments/environment.development';

const BACKEND_URL = environment.apiUrl + '/orders/';

@Injectable({
  providedIn: 'root',
})
export class OrderDataStorageService {
  constructor(private http: HttpClient) {}

  fetchOrders(): Observable<{
    message: string;
    orders: {
      id: string;
      user: string;
      emailAddress: string;
      country: string;
      phoneNumber: string;
      firstName: string;
      lastName: string;
      city: string;
      postalCode: number;
      address1: string;
      paymentMethod: string;
      productInfo: {
        productName: string;
        quantity: number;
        productsTotal: number;
      }[];
      paid: boolean;
      fullfilled: boolean;
      trackingId: string;
      createdAt: string;
      updatedAt: string;
      address2?: string;
    }[];
  }> {
    return this.http.get<FetchOrders>(BACKEND_URL + 'fetchOrders').pipe(
      map((res) => {
        return {
          message: res.message,
          orders: res.orders.map((order) => {
            return {
              id: order._id,
              user: order.user,
              emailAddress: order.emailAddress,
              country: order.country,
              phoneNumber: order.phoneNumber,
              firstName: order.firstName,
              lastName: order.lastName,
              city: order.city,
              postalCode: order.postalCode,
              address1: order.address1,
              paymentMethod: order.paymentMethod,
              productInfo: order.productInfo,
              paid: order.paid,
              fullfilled: order.fullfilled,
              trackingId: order.trackingId,
              createdAt: order.createdAt,
              updatedAt: order.updatedAt,
              address2: order.address2,
            };
          }),
        };
      })
    );
  }

  updateOrderStatus(
    paidStatus: string,
    shipmentStatus: string,
    trackingId: string,
    orderId: string
  ): Observable<{
    message: string;
  }> {
    console.log(paidStatus, shipmentStatus, trackingId);

    return this.http.put<UpdateOrderPaidResponse>(BACKEND_URL + 'updateOrder', {
      paidStatus: paidStatus,
      shipmentStatus: shipmentStatus,
      trackingId: trackingId,
      orderId: orderId,
    });
  }
}
