import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';

import { Product } from './product.model';

// import { environment } from 'src/environments/environment';

import { ProductService } from './product.service';

// const BACKEND_URL = environment.apiUTL + 'products/';

@Injectable({ providedIn: 'root' })
export class ProductDataStorageService {
  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private router: Router
  ) {}

  fetchProducts(): Observable<Product[]> {
    return this.http
      .get<{
        products: {
          productName: string;
          productCategory: {
            _id: string;
            __v: number;
            categoryName: string;
            properties: { property: string; values: string[] }[];
          };
          storage: string;
          color: string;
          productImages: Object[];
          description: string;
          priceInUSD: number;
          _id: string;
          __v: number;
        }[];
      }>('fetch-products')
      .pipe(
        map((responseData) => {
          return responseData.products.map((product) => {
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
          });
        }),
        tap((products: Product[]) => {
          this.productService.setProducts(products);
        })
      );
  }

  createProduct(product: FormData): void {
    this.http
      .post<{
        product: {
          productName: string;
          productCategory: {
            id: string;
            categoryName: string;
            properties: { property: string; values: string[] }[];
          };
          color: string;
          storage: string;
          productImages: Object[];
          description: string;
          priceInUSD: number;
          _id: string;
          __v: number;
        };
        message: string;
      }>('create-product', product)
      .subscribe({
        next: (responseData) => {
          const product = new Product(
            responseData.product._id,
            responseData.product.productName,
            responseData.product.productCategory,
            responseData.product.productImages,
            responseData.product.description,
            +responseData.product.priceInUSD
          );

          this.productService.addProduct(product);
          this.productService.updateEditMode.next('no-edit');
          this.router.navigate(['adminpanel/products']);
        },
        error: (error) => {
          console.log('err: ', error);
        },
      });
  }

  updatedProduct(formData: any): void {
    this.http.put('update-product', formData).subscribe({
      next: () => {
        const updatedProduct = new Product(
          formData.get('id'),
          formData.get('productName'),
          formData.get('productCategory'),
          formData.get('productImages'),
          formData.get('description'),
          formData.get('priceInUSD')
        );

        this.productService.updateProducts(updatedProduct);

        this.productService.updateEditMode.next('no-edit');
        this.router.navigate(['adminpanel/products']);
      },
      error: (err) => {
        console.log('[products] Error: ', err);
      },
    });
  }

  deleteProduct(productID: string, index: number, product: Product): void {
    this.http
      .delete<{ message: string }>('/delete-product/' + productID, {
        params: new HttpParams().set('product', JSON.stringify(product)),
      })
      .subscribe({
        next: () => {
          this.productService.deleteProduct(index);
        },
      });
  }

  fetchProduct(id: string): Observable<Object> {
    return this.http.get('fetch-product', {
      params: new HttpParams().set('id', id),
    });
    // .pipe(
    //   map(
    //     (responseData: {
    //       message: string;
    //       product: {
    //         _id: string;
    //         productName: string;
    //         productCategory: {
    //           _id: string;
    //           __v: number;
    //           categoryName: string;
    //           properties: { property: string; values: string[] }[];
    //         };
    //         storage: string;
    //         color: string;
    //         productImages: Object[];
    //         description: string;
    //         priceInUSD: number;
    //       };
    //     }) => {
    //       return {
    //         message: responseData.message,
    //         product: {
    //           id: responseData.product._id,
    //           productName: responseData.product.productName,
    //           productCategory: {
    //             _id: responseData.product.productCategory._id,
    //             categoryName:
    //               responseData.product.productCategory.categoryName,
    //             properties: responseData.product.productCategory.properties,
    //           },
    //           storage: responseData.product.storage,
    //           color: responseData.product.color,
    //           productImages: responseData.product.productImages,
    //           description: responseData.product.description,
    //           priceInUSD: responseData.product.priceInUSD,
    //         },
    //       };
    //     }
    //   )
    // );
  }
}
