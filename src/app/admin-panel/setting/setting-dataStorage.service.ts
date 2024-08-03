import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  FetchProductsResponse,
  FetchSettings,
  SaveFeaturedProduct,
  SaveShippingFee,
} from './SettingRes.model';
import { Setting } from './Setting.model';

import { environment } from '../../../environments/environment.development';

const BACKEND_URL = environment.apiUrl;

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
      } | null;
      productImages: string[];
      description: string;
      priceInPKR: number;
    }[];
  }> {
    return this.http
      .get<FetchProductsResponse>(BACKEND_URL + '/products/fetchProducts')
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

  fetchSettings(): Observable<{
    message: string;
    settings: {
      id: string;
      name: string;
      value: string | number;
    }[];
  }> {
    return this.http
      .get<FetchSettings>(BACKEND_URL + '/settings/fetchSettings')
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
        BACKEND_URL + '/settings/saveFeaturedProduct',
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
        BACKEND_URL + '/settings/saveShippingFee',
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
