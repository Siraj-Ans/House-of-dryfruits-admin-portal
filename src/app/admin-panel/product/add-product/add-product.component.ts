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
  errorMessage: undefined | string;
  categories: Category[] = [];
  imagePaths: string[] = [];
  imageFiles: undefined | File[] = [];
  productForm!: FormGroup;
  categoriesSubscription: undefined | Subscription;
  loadingSubscription: undefined | Subscription;
  errorMessageSubscription: undefined | Subscription;

  constructor(
    private router: Router,
    private productSerive: ProductService,
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this, this.categoryService.getCategories();

    this.productForm = this.fb.group({
      productName: [null, Validators.required],
      productCategory: [null, Validators.required],
      productImages: [null, Validators.required],
      description: [null, Validators.required],
      priceInUSD: [null, Validators.required],
    });

    this.errorMessageSubscription =
      this.productSerive.updateAddProductErrorMessage.subscribe((errMsg) => {
        console.log('err: ', errMsg);
        this.errorMessage = errMsg;
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

  onImagePreview(event: Event): void {
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

  onEditProduct(): void {
    if (this.productForm.invalid) return;

    this.canExit = true;

    let formData = new FormData();

    formData.append('productName', this.productForm.value.productName);
    formData.append('productCategory', this.productForm.value.productCategory);
    formData.append('description', this.productForm.value.description);
    formData.append('priceInUSD', this.productForm.value.priceInUSD);
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
