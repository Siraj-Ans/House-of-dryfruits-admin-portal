import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { CategoryDataStorageService } from './category-dataStorage.service';

import { Category } from './category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService implements OnInit, OnDestroy {
  categories: Category[] = [];
  private editMode = 'no-edit';
  updatedCategories = new Subject<Category[]>();
  selectedCategory = new ReplaySubject<{ category: Category; index: number }>(
    1
  );
  updatedEditMode = new Subject<string>();
  updateAddCategoryErrorMessage = new Subject<string>();
  updateDeleteCategoryErrorMessage = new Subject<string>();
  updateEditCategoryErrorMessage = new Subject<string>();
  updatedEditModeSubscription: undefined | Subscription;

  constructor(
    private categoryDataStorageService: CategoryDataStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  setEditMode(mode: string): void {
    this.editMode = mode;
  }

  getEditMode(): string {
    return this.editMode;
  }

  addCategory(category: Category): void {
    this.categoryDataStorageService.createCategory(category).subscribe({
      next: (responseData) => {
        this.categories.push(responseData.category);
        this.updatedCategories.next(this.categories.slice());
      },
      error: (err) => {
        this.updateAddCategoryErrorMessage.next(err.error.message);
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
      error: (err) => {
        console.log('[Categories] Error: ', err);
      },
      complete: () => {},
    });
  }

  removeCategory(index: number, categoryID: string): void {
    this.categoryDataStorageService.deleteCategory(categoryID).subscribe({
      next: (responseData) => {
        this.categories.splice(index, 1);
        this.updatedCategories.next(this.categories.slice());
      },
      error: (err) => {
        this.updateDeleteCategoryErrorMessage.next(err.error.message);
        console.log('[Categories] Error: ', err);
      },
      complete: () => {},
    });
  }

  editCategory(category: Category): void {
    this.categoryDataStorageService.updateCategory(category).subscribe({
      next: (responseData) => {
        this.getCategories();

        this.editMode = 'no-edit';
        this.updatedEditMode.next('no-edit');
        this.router.navigateByUrl('adminpanel/categories');
      },
      error: (err) => {
        this.updateEditCategoryErrorMessage.next(err.error.message);
        console.log('[Categories] Error: ', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.updatedEditModeSubscription?.unsubscribe();
  }
}
