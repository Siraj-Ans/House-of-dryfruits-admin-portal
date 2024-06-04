import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { Category } from './category.model';
import {
  CreateCategoryResponse,
  DeleteCategoryResponse,
  FetchCategoriesResponse,
  UpdateCategoryResponse,
} from './CategoryRes.model';

@Injectable({ providedIn: 'root' })
export class CategoryDataStorageService {
  constructor(private http: HttpClient) {}

  createCategory(category: Category): Observable<{
    message: string;
    category: {
      id: string;
      categoryName: string;
      parent?: {
        id: string;
        categoryName: string;
        properties: { property: string; values: string[] }[];
      };
      properties: { property: string; values: string[] }[];
    };
  }> {
    return this.http
      .post<CreateCategoryResponse>(
        'http://localhost:3000/api/categories/createCategory',
        category
      )
      .pipe(
        map((res) => {
          if (res.category.parent) {
            return {
              message: res.message,
              category: {
                id: res.category._id,
                categoryName: res.category.categoryName,
                parent: {
                  id: res.category.parent._id,
                  categoryName: res.category.parent.categoryName,
                  properties: res.category.parent.properties,
                },
                properties: res.category.properties,
              },
            };
          }

          return {
            message: res.message,
            category: {
              id: res.category._id,
              categoryName: res.category.categoryName,
              properties: res.category.properties,
            },
          };
        })
      );
  }

  fetchCategories(): Observable<{
    message: string;
    categories: {
      id: string;
      categoryName: string;
      parent?: {
        id: string;
        categoryName: string;
        properties: { property: string; values: string[] }[];
      };
      properties: { property: string; values: string[] }[];
    }[];
  }> {
    return this.http
      .get<FetchCategoriesResponse>(
        'http://localhost:3000/api/categories/fetchCategories'
      )
      .pipe(
        map((responseData) => {
          return {
            message: responseData.message,
            categories: responseData.categories.map((category) => {
              if (category.parent) {
                return {
                  id: category._id,
                  categoryName: category.categoryName,
                  parent: {
                    id: category.parent._id,
                    categoryName: category.parent.categoryName,
                    properties: category.parent.properties,
                  },
                  properties: category.properties.map((property) => {
                    return {
                      property: property.property,
                      values: property.values,
                    };
                  }),
                };
              }
              return {
                id: category._id,
                categoryName: category.categoryName,
                properties: category.properties.map((property) => {
                  return {
                    property: property.property,
                    values: property.values,
                  };
                }),
              };
            }),
          };
        })
      );
  }

  deleteCategory(categoryID: string): Observable<{ message: string }> {
    return this.http.delete<DeleteCategoryResponse>(
      'http://localhost:3000/api/categories/deleteCategory',
      {
        params: new HttpParams().set('categoryID', categoryID),
      }
    );
  }

  updateCategory(category: Category): Observable<UpdateCategoryResponse> {
    return this.http.put<UpdateCategoryResponse>(
      'http://localhost:3000/api/categories/updateCategory/',
      category
    );
  }
}
