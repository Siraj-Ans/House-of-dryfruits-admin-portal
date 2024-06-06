import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import {
  CreateProductReponse,
  DeleteProductResponse,
  FetchProductResponse,
  UpdateProductResponse,
} from './ProductRes.model';

@Injectable({ providedIn: 'root' })
export class ProductDataStorageService {
  constructor(private http: HttpClient) {}

  fetchProducts(): Observable<{
    message: string;
    products: {
      id: string;
      productName: string;
      productCategory: {
        id: string;
        categoryName: string;
        properties: { property: string; values: string[] }[];
      };
      productImages: string[];
      description: string;
      priceInUSD: number;
    }[];
  }> {
    return this.http
      .get<FetchProductResponse>(
        'http://localhost:3000/api/products/fetchProducts'
      )
      .pipe(
        map((res) => {
          return {
            message: res.message,
            products: res.products.map((product) => {
              return {
                id: product._id,
                productName: product.productName,
                productCategory: {
                  id: product.productCategory._id,
                  categoryName: product.productCategory.categoryName,
                  properties: product.productCategory.properties,
                },
                productImages: product.productImages,
                description: product.description,
                priceInUSD: product.priceInUSD,
              };
            }),
          };
        })
      );
  }

  createProduct(product: FormData): Observable<{
    message: string;
    product: {
      id: string;
      productName: string;
      productCategory: {
        id: string;
        categoryName: string;
        properties: { property: string; values: string[] }[];
      };
      productImages: string[];
      description: string;
      priceInUSD: number;
    };
  }> {
    return this.http
      .post<CreateProductReponse>(
        'http://localhost:3000/api/products/createProduct',
        product
      )
      .pipe(
        map((res) => {
          return {
            message: res.message,
            product: {
              id: res.product._id,
              productName: res.product.productName,
              description: res.product.description,
              priceInUSD: res.product.priceInUSD,
              productImages: res.product.productImages,
              productCategory: {
                id: res.product.productCategory._id,
                categoryName: res.product.productCategory.categoryName,
                properties: res.product.productCategory.properties,
              },
            },
          };
        })
      );
  }

  updatedProduct(updatedProduct: FormData): Observable<UpdateProductResponse> {
    return this.http.put<UpdateProductResponse>(
      'http://localhost:3000/api/products/updateProduct',
      updatedProduct
    );
  }

  deleteProduct(productID: string): Observable<DeleteProductResponse> {
    return this.http.delete<DeleteProductResponse>(
      'http://localhost:3000/api/products/deleteProduct/',
      {
        params: new HttpParams().set('productID', productID),
      }
    );
  }
}
