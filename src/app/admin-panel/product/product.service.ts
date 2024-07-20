import { Injectable } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';

import { ProductDataStorageService } from './product-dataStorage.service';

import { Product } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  products: Product[] = [];
  editAddMode = false;
  updateEditProductErrorMessage = new Subject<string>();
  updateAddProductErrorMessage = new Subject<string>();
  updateLoading = new Subject<boolean>();
  updateProducts = new Subject<Product[]>();
  selectedProduct = new ReplaySubject<{ product: Product; index: number }>(1);
  updateEditAddMode = new Subject<boolean>();

  constructor(
    private productDataStorageService: ProductDataStorageService,
    private router: Router
  ) {}

  getEditAddMode(): boolean {
    return this.editAddMode;
  }

  setEditAddMode(mode: boolean): void {
    this.editAddMode = mode;
  }

  getProducts(): void {
    this.productDataStorageService.fetchProducts().subscribe({
      next: (responseData) => {
        this.products = responseData.products;

        this.updateProducts.next(this.products.slice());
      },
      error: (err) => {
        console.log('[product] err: ', err);
      },
      complete: () => {},
    });
  }

  addProduct(product: FormData): void {
    this.updateLoading.next(true);

    this.productDataStorageService.createProduct(product).subscribe({
      next: (responseData) => {
        const product = new Product(
          responseData.product.id,
          responseData.product.productName,
          responseData.product.productCategory,
          responseData.product.productImages,
          responseData.product.description,
          responseData.product.priceInPKR
        );

        this.products.push(product);
        this.updateProducts.next(this.products.slice());
        this.updateEditAddMode.next(false);
        this.updateLoading.next(false);
        this.router.navigate(['adminpanel/products']);
      },
      error: (err) => {
        this.updateLoading.next(false);
        this.updateAddProductErrorMessage.next(err.error.message);
      },
      complete: () => {},
    });
  }

  removeProduct(productID: string, index: number): void {
    this.productDataStorageService.deleteProduct(productID).subscribe({
      next: (responseData) => {
        this.products.splice(index, 1);
        this.updateProducts.next(this.products.slice());
      },
      error: (err) => {
        console.log('[products] Error: ', err);
      },
      complete: () => {},
    });
  }

  editProduct(updatedProduct: FormData): void {
    this.updateLoading.next(true);
    this.productDataStorageService.updatedProduct(updatedProduct).subscribe({
      next: () => {
        this.getProducts();
        this.updateProducts.next(this.products.slice());
        this.updateEditAddMode.next(false);
        this.updateLoading.next(false);
        this.router.navigate(['adminpanel/products']);
      },
      error: (err) => {
        this.updateLoading.next(false);
        this.updateEditProductErrorMessage.next(err.error.message);
      },
      complete: () => {},
    });
  }
}
