import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { CategoryDataStorageService } from './category-dataStorage.service';
import { ToastService } from '../../toastr.service';

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
  updatedEditModeSubscription: undefined | Subscription;
  updateLoadingStatus = new ReplaySubject<boolean>(0);
  updateCanExit = new Subject<boolean>();

  constructor(
    private categoryDataStorageService: CategoryDataStorageService,
    private router: Router,
    private toastr: ToastService
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
        this.toastr.showSuccess('Category Added!', '', {
          toastClass: 'success-toast',
          timeOut: 3000,
          extendedTimeOut: 1000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
        });
      },
      error: (err) => {
        if (!err.status)
          this.toastr.showError('Server failed!', '', {
            toastClass: 'error-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
        else
          this.toastr.showError(err.error.message, '', {
            toastClass: 'error-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
      },
      complete: () => {},
    });
  }

  getCategories(): void {
    this.updateLoadingStatus.next(true);
    this.categoryDataStorageService.fetchCategories().subscribe({
      next: (responseData) => {
        this.categories = responseData.categories;
        this.updatedCategories.next(this.categories.slice());
      },
      error: (err) => {
        if (!err.status)
          this.toastr.showError('Server failed!', '', {
            toastClass: 'error-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
        else
          this.toastr.showError(err.error.message, '', {
            toastClass: 'error-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
        this.updateLoadingStatus.next(false);
      },
      complete: () => {
        this.updateLoadingStatus.next(false);
      },
    });
  }

  removeCategory(index: number, categoryID: string): void {
    this.categoryDataStorageService.deleteCategory(categoryID).subscribe({
      next: (responseData) => {
        this.categories.splice(index, 1);
        this.updatedCategories.next(this.categories.slice());
        this.toastr.showSuccess('Category removed!', '', {
          toastClass: 'success-toast',
          timeOut: 3000,
          extendedTimeOut: 1000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
        });
      },
      error: (err) => {
        if (!err.status)
          this.toastr.showError('Server failed!', '', {
            toastClass: 'error-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
        else
          this.toastr.showError(err.error.message, '', {
            toastClass: 'error-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
      },
      complete: () => {},
    });
  }

  editCategory(category: Category): void {
    this.categoryDataStorageService.updateCategory(category).subscribe({
      next: (responseData) => {
        this.toastr.showSuccess('Category edited!', '', {
          toastClass: 'success-toast',
          timeOut: 3000,
          extendedTimeOut: 1000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
        });
        this.getCategories();

        this.updateCanExit.next(true);
        this.editMode = 'no-edit';
        this.updatedEditMode.next('no-edit');
        this.router.navigateByUrl('adminpanel/categories');
      },
      error: (err) => {
        if (!err.status)
          this.toastr.showError('Server failed!', '', {
            toastClass: 'error-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
        else
          this.toastr.showError(err.error.message, '', {
            toastClass: 'error-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
      },
    });
  }

  ngOnDestroy(): void {
    this.updatedEditModeSubscription?.unsubscribe();
  }
}
