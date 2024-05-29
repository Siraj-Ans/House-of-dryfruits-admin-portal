import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

import { CategoryDataStorageService } from './category-dataStorage.service';

import { Category } from './category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  categories: Category[] = [];
  updatedCategories = new Subject<Category[]>();
  selectedCategory = new ReplaySubject<Category>(1);
  editMode = new Subject<string>();

  constructor(private categoryDataStorageService: CategoryDataStorageService) {}

  addCategory(category: Category): void {
    this.categoryDataStorageService.createCategory(category).subscribe({
      next: (responseData) => {
        this.categories.push(responseData.category);
        this.updatedCategories.next(this.categories.slice());
      },
      error: (err) => {
        console.log('[Categories] Error: ', err);
      },
      complete: () => {},
    });
  }

  getCategories(): void {
    this.categoryDataStorageService.fetchCategories().subscribe({
      next: (responseData) => {
        this.categories = responseData.categories;
        this.updatedCategories.next(this.categories.slice());
      },
      error: () => {},
      complete: () => {},
    });
  }

  removeCategory(index: number, categoryID: string): void {
    this.categoryDataStorageService.deleteCategory(categoryID).subscribe({
      next: (responseData) => {
        this.categories.splice(index, 1);
        this.updatedCategories.next(this.categories.slice());
      },
      error: () => {},
      complete: () => {},
    });
  }
}
