import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  FetchProductsResponse,
  FetchSettings,
  SaveFeaturedProduct,
  SaveShippingFee,
} from './SettingRes.model';
import { map, Observable } from 'rxjs';
import { Setting } from './Setting.model';

@Injectable({
  providedIn: 'root',
})
export class SettingDataStorageServiceService {
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
      priceInPKR: number;
    }[];
  }> {
    return this.http
      .get<FetchProductsResponse>(
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
                priceInPKR: product.priceInPKR,
              };
            }),
          };
        })
      );
  }

  fetchSettings(): Observable<{
    message: string;
    settings: {
      id: string;
      name: string;
      value: string | number;
    }[];
  }> {
    return this.http
      .get<FetchSettings>('http://localhost:3000/api/settings/fetchSettings')
      .pipe(
        map((res) => {
          return {
            message: res.message,
            settings: res.settings.map((setting) => {
              return {
                id: setting._id,
                name: setting.name,
                value:
                  setting.name === 'Shipping Fee'
                    ? +setting.value
                    : setting.value,
              };
            }),
          };
        })
      );
  }

  saveFeaturedProduct(settings: Setting): Observable<{
    message: string;
  }> {
    return this.http
      .post<SaveFeaturedProduct>(
        'http://localhost:3000/api/settings/saveFeaturedProduct',
        settings
      )
      .pipe(
        map((res) => {
          return {
            message: res.message,
          };
        })
      );
  }

  saveShippingFee(settings: Setting): Observable<{
    message: string;
  }> {
    return this.http
      .post<SaveShippingFee>(
        'http://localhost:3000/api/settings/saveShippingFee',
        settings
      )
      .pipe(
        map((res) => {
          return {
            message: res.message,
          };
        })
      );
  }
}
