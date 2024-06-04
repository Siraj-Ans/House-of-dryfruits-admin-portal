import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take } from 'rxjs';

import { Category } from '../../category/category.model';
import { Product } from '../product.model';

import { ProductDataStorageService } from '../product-dataStorage.service';
import { CategoryService } from '../../category/category.service';
import { ProductService } from '../product.service';

import { mimeType } from '../mime-type.validator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-edit.component.html',
})
export class EditProductComponent implements OnInit, OnDestroy {
  selectedProduct: undefined | Product;
  categories: Category[] = [];
  imagePaths: string[] = [];
  imageFiles = [];
  selectedProductSubscription: undefined | Subscription;
  categoriesSubscription: undefined | Subscription;
  productForm!: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productsDataStorageService: ProductDataStorageService,
    private productSerive: ProductService,
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this, this.categoryService.getCategories();
    this.productSerive.updateEditMode.next('edit-mode');

    this.productForm = this.fb.group({
      productName: [null, Validators.required],
      productCategory: [null, Validators.required],
      productImages: [null, Validators.required],
      description: [null, Validators.required],
      priceInUSD: [null, Validators.required],
    });

    this.categoriesSubscription =
      this.categoryService.updatedCategories.subscribe((categories) => {
        this.categories = categories;
      });

    this.selectedProductSubscription = this.productSerive.selectedProduct
      .pipe(take(1))
      .subscribe((product) => {
        this.selectedProduct = product;
      });

    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.selectedProduct = this.productSerive.getProductById(params['id']);

        this.productForm
          ?.get('productName')
          ?.setValue(this.selectedProduct?.productName);

        this.productForm
          ?.get('productCategory')
          ?.setValue(this.selectedProduct?.productCategory);
        this.categories = [
          this.selectedProduct?.productCategory,
          ...this.categories,
        ];

        // this.imageFiles = this.product.productImages;
        console.log(this.imageFiles);
        // console.log(this.productForm.get('productImages'));
        // this.productForm
        //   .get('productImages')
        //   .setValue(this.product.productImages);
        this.productForm
          ?.get('description')
          ?.setValue(this.selectedProduct?.description);
        this.productForm
          ?.get('priceInUSD')
          ?.setValue(this.selectedProduct?.priceInUSD);
      }
    });
  }

  onCancelEdit(): void {
    this.productSerive.updateEditMode.next('no-edit');
    this.router.navigate(['adminpanel/products']);
  }

  onImagePreview(event: Event): void {
    // const file = (event.target as HTMLInputElement).files[
    //   (event.target as HTMLInputElement).files.length - 1
    // ];

    // this.imageFiles.push(file);
    this.productForm?.get('productImages')?.updateValueAndValidity();

    const reader = new FileReader();

    // reader.onload = (e) => {
    //   this.imagePaths.push(e.target.result as string);
    // };

    // reader.readAsDataURL(file);
  }

  onSubmitProduct(): void {
    if (this.productForm.invalid) return;

    let formData = new FormData();

    // formData.append('id', null);

    if (this.activatedRoute.snapshot.params['id'])
      formData.set('id', this.activatedRoute.snapshot.params['id']);

    formData.append('productName', this.productForm.value.productName);
    formData.append(
      'productCategory',
      this.productForm.value.productCategory.id
    );
    formData.append('description', this.productForm.value.description);
    formData.append('priceInUSD', this.productForm.value.priceInUSD);
    this.imageFiles.forEach((file) => {
      formData.append('productImages', file);
    });

    if (!this.activatedRoute.snapshot.params['id'])
      this.productsDataStorageService.createProduct(formData);
    else this.productsDataStorageService.updatedProduct(formData);
  }

  ngOnDestroy(): void {
    this.selectedProductSubscription?.unsubscribe();
    this.categoriesSubscription?.unsubscribe();
  }
}
