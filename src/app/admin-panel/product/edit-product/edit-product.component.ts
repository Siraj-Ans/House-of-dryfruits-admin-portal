import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

import { LoadSpinner } from '../../../shared/load-spinner/load-spinner.component';

import { CategoryService } from '../../category/category.service';
import { ProductService } from '../product.service';
import { ToastService } from '../../../toastr.service';

import { Category } from '../../category/category.model';
import { Product } from '../product.model';

import { mimeType } from '../mime-type.validator';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, LoadSpinner],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css',
})
export class EditProductComponent implements OnInit, OnDestroy {
  loading = false;
  canExit = true;
  newImages: string[] = [];
  selectedProduct: undefined | Product;
  selectedProductIndex: undefined | number;
  categories: Category[] = [];
  imagePaths: string[] = [];
  imageFiles: File[] = [];
  existingImagePaths: string[] = [];
  editProductForm!: FormGroup;
  selectedProductSubscription: undefined | Subscription;
  categoriesSubscription: undefined | Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productSerive: ProductService,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private toastr: ToastService
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories();

    this.editProductForm = this.fb.group({
      productName: [null, Validators.required],
      productCategory: [null, Validators.required],
      productImages: [null, Validators.required],
      description: [null, Validators.required],
      priceInPKR: [null, Validators.required],
    });

    this.productSerive.updateLoading.subscribe((status) => {
      this.loading = status;
    });

    this.categoriesSubscription =
      this.categoryService.updatedCategories.subscribe((categories) => {
        this.categories = categories;
      });

    this.selectedProductSubscription =
      this.productSerive.selectedProduct.subscribe((selected) => {
        this.selectedProduct = selected.product;
        this.selectedProductIndex = selected.index;

        this.editProductForm
          ?.get('productName')
          ?.setValue(this.selectedProduct?.productName);

        this.editProductForm
          ?.get('productCategory')
          ?.setValue(
            this.selectedProduct?.productCategory
              ? this.selectedProduct?.productCategory.id
              : null
          );

        this.imagePaths = this.selectedProduct.productImages;
        this.existingImagePaths = [...this.selectedProduct.productImages];

        this.editProductForm
          ?.get('description')
          ?.setValue(this.selectedProduct?.description);
        this.editProductForm
          ?.get('priceInPKR')
          ?.setValue(this.selectedProduct?.priceInPKR);
      });
  }

  onChangeProductName(event: Event): void {
    if (
      (<HTMLInputElement>event.target).value !==
      this.selectedProduct?.productName
    )
      this.canExit = false;
    else this.canExit = true;
  }

  onChangeProductCategory(event: Event): void {
    // if (
    //   (<HTMLInputElement>event.target).value !==
    //   this.selectedProduct?.productCategory.id
    // )
    //   this.canExit = false;
    // else this.canExit = true;
  }

  onChangeDescription(event: Event): void {
    if (
      (<HTMLInputElement>event.target).value !==
      this.selectedProduct?.description
    )
      this.canExit = false;
    else this.canExit = true;
  }

  onChangePrice(event: Event): void {
    if (
      +(<HTMLInputElement>event.target).value !==
      this.selectedProduct?.priceInPKR
    )
      this.canExit = false;
    else this.canExit = true;
  }

  onCancelEdit(): void {
    this.productSerive.updateEditAddMode.next(false);
    this.router.navigate(['adminpanel/products']);
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

    if (
      this.imageFiles.length +
        (<HTMLInputElement>event.target).files!.length +
        this.existingImagePaths.length >
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

    this.editProductForm?.get('productImages')?.updateValueAndValidity();

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.editProductForm.get('productImages')?.disable();
        this.imagePaths.push(e.target!.result as string);
        this.newImages.push(e.target!.result as string);
      };

      reader.onloadend = () => {
        this.editProductForm.get('productImages')?.enable();
      };

      reader.readAsDataURL(files[i]);
    }
  }

  onDeleteImage(
    index: number,
    imagePath: string,
    editProductForm: Object
  ): void {
    const imagePathIndex = this.imagePaths.indexOf(imagePath);
    this.imagePaths.splice(imagePathIndex, 1);

    if (this.existingImagePaths.includes(imagePath)) {
      const index = this.existingImagePaths.indexOf(imagePath);
      this.existingImagePaths.splice(index, 1);
    }

    if (this.newImages.includes(imagePath)) {
      const index = this.newImages.indexOf(imagePath);
      this.newImages.splice(index, 1);
      this.imageFiles?.splice(index, 1);
    }
  }

  onSubmitProduct(): void {
    if (this.editProductForm.invalid) return;

    this.canExit = true;

    let formData = new FormData();

    formData.set('productID', this.activatedRoute.snapshot.params['id']);
    formData.append('productName', this.editProductForm.value.productName);
    formData.append(
      'productCategory',
      this.editProductForm.value.productCategory
    );
    formData.append('description', this.editProductForm.value.description);
    formData.append('priceInPKR', this.editProductForm.value.priceInPKR);
    this.existingImagePaths?.forEach((imagePaths) => {
      formData.append('existingImages', imagePaths);
    });
    this.imageFiles?.forEach((file) => {
      formData.append('productImages', file);
    });

    this.productSerive.editProduct(formData);
  }

  ngOnDestroy(): void {
    this.selectedProductSubscription?.unsubscribe();
    this.categoriesSubscription?.unsubscribe();
  }
}
