import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FetchOrders } from './OrderRes.model';
import { map, Observable } from 'rxjs';

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
      createdAt: string;
      updatedAt: string;
      address2?: string;
    }[];
  }> {
    return this.http
      .get<FetchOrders>('http://localhost:3000/api/orders/fetchOrders')
      .pipe(
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
