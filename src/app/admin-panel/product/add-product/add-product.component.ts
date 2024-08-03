import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

import { LoadSpinner } from '../../../shared/load-spinner/load-spinner.component';

import { CategoryService } from '../../category/category.service';
import { ProductService } from '../product.service';
import { ToastService } from '../../../toastr.service';

import { Category } from '../../category/category.model';

import { mimeType } from '../mime-type.validator';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, LoadSpinner],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit, OnDestroy {
  loading = false;
  canExit = true;
  categories: Category[] = [];
  imagePaths: string[] = [];
  imageFiles: File[] = [];
  productForm!: FormGroup;
  categoriesSubscription: undefined | Subscription;
  loadingSubscription: undefined | Subscription;

  constructor(
    private router: Router,
    private productSerive: ProductService,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private toastr: ToastService
  ) {}

  ngOnInit(): void {
    this, this.categoryService.getCategories();

    this.productForm = this.fb.group({
      productName: [null, Validators.required],
      productCategory: [null, Validators.required],
      productImages: [null, Validators.required],
      description: [null, Validators.required],
      priceInPKR: [null, Validators.required],
    });

    this.loadingSubscription = this.productSerive.updateLoading.subscribe(
      (status) => {
        this.loading = status;
      }
    );

    this.categoriesSubscription =
      this.categoryService.updatedCategories.subscribe((categories) => {
        this.categories = categories;
      });
  }

  onChangeProductName(event: Event): void {
    this.canExit = false;
  }

  onChangeProductCategory(event: Event): void {
    this.canExit = false;
  }

  onChangeDescription(event: Event): void {
    this.canExit = false;
  }

  onChangePrice(event: Event): void {
    this.canExit = false;
  }

  onCancelAdd(): void {
    this.productSerive.updateEditAddMode.next(false);
    this.router.navigate(['adminpanel/products']);
  }

  onTouched(): void {
    this.productForm.controls['productImages'].markAsTouched;
  }

  onImagePreview(event: Event): void {
    if ((<HTMLInputElement>event.target).files!.length > 5)
      return this.toastr.showError(
        'You cannot select more than 5 pictures',
        '',
        {
          toastClass: 'error-toast',
          timeOut: 3000,
          extendedTimeOut: 1000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
        }
      );

    this.imageFiles.length + (<HTMLInputElement>event.target).files!.length;

    if (
      this.imageFiles.length + (<HTMLInputElement>event.target).files!.length >
      5
    ) {
      return this.toastr.showError('Image limit exceeds!', '', {
        toastClass: 'error-toast',
        timeOut: 3000,
        extendedTimeOut: 1000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      });
    }

    let files = (<HTMLInputElement>event.target).files!;

    for (let i = 0; i < files.length; i++) {
      this.imageFiles?.push(files[i]);
    }

    this.productForm?.get('productImages')?.updateValueAndValidity();

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.productForm.get('productImages')?.disable();
        this.imagePaths.push(e.target!.result as string);
      };

      reader.onloadend = () => {
        this.productForm.get('productImages')?.enable();
      };

      reader.readAsDataURL(files[i]);
    }
  }

  onDeleteImage(index: number): void {
    this.imagePaths.splice(index, 1);
    this.imageFiles.splice(index, 1);
  }

  onAddProduct(): void {
    if (this.productForm.invalid) return;

    this.canExit = true;

    let formData = new FormData();

    formData.append('productName', this.productForm.value.productName);
    formData.append('productCategory', this.productForm.value.productCategory);
    formData.append('description', this.productForm.value.description);
    formData.append('priceInPKR', this.productForm.value.priceInPKR);
    this.imageFiles?.forEach((file) => {
      formData.append('productImages', file);
    });
    this.productSerive.addProduct(formData);
  }

  ngOnDestroy(): void {
    this.categoriesSubscription?.unsubscribe();
    this.loadingSubscription?.unsubscribe();
  }
}
