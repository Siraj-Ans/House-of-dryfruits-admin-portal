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

import { environment } from '../../../environments/environment.development';

const BACKEND_URL = environment.apiUrl + '/products/';

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
      } | null;
      productImages: string[];
      description: string;
      priceInPKR: number;
    }[];
  }> {
    return this.http
      .get<FetchProductResponse>(BACKEND_URL + 'fetchProducts')
      .pipe(
        map((res) => {
          return {
            message: res.message,
            products: res.products.map((product) => {
              return {
                id: product._id,
                productName: product.productName,
                productCategory: product.productCategory
                  ? {
                      id: product.productCategory._id,
                      categoryName: product.productCategory.categoryName,
                      properties: product.productCategory.properties,
                    }
                  : null,
                productImages: product.productImages,
                description: product.description,
                priceInPKR: product.priceInPKR,
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
      priceInPKR: number;
    };
  }> {
    return this.http
      .post<CreateProductReponse>(BACKEND_URL + 'createProduct', product)
      .pipe(
        map((res) => {
          return {
            message: res.message,
            product: {
              id: res.product._id,
              productName: res.product.productName,
              description: res.product.description,
              priceInPKR: res.product.priceInPKR,
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
      BACKEND_URL + 'updateProduct',
      updatedProduct
    );
  }

  deleteProduct(productID: string): Observable<DeleteProductResponse> {
    return this.http.delete<DeleteProductResponse>(
      BACKEND_URL + 'deleteProduct/',
      {
        params: new HttpParams().set('productID', productID),
      }
    );
  }
}
