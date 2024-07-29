import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { FetchOrdersResponse } from './DashboardRes.model';

import { environment } from '../../../environments/environment.development';

const BACKEND_URL = environment.apiUrl + '/orders/';

@Injectable({
  providedIn: 'root',
})
export class DashboardDataStorageService {
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
      completed: boolean;
      createdAt: string;
      updatedAt: string;
      address2?: string;
    }[];
  }> {
    return this.http.get<FetchOrdersResponse>(BACKEND_URL + 'fetchOrders').pipe(
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
              completed: order.completed,
              createdAt: order.createdAt,
              updatedAt: order.updatedAt,
              address2: order.address2,
            };
          }),
        };
      })
    );
  }
}
