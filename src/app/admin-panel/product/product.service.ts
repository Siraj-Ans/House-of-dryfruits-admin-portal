import { Injectable } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';

import { ProductDataStorageService } from './product-dataStorage.service';
import { ToastService } from '../../toastr.service';

import { Product } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  products: Product[] = [];
  editAddMode = false;
  updateLoading = new ReplaySubject<boolean>(0);
  updateProducts = new Subject<Product[]>();
  selectedProduct = new ReplaySubject<{ product: Product; index: number }>(1);
  updateEditAddMode = new Subject<boolean>();

  constructor(
    private productDataStorageService: ProductDataStorageService,
    private router: Router,
    private toastr: ToastService
  ) {}

  getEditAddMode(): boolean {
    return this.editAddMode;
  }

  setEditAddMode(mode: boolean): void {
    this.editAddMode = mode;
  }

  getProducts(): void {
    this.updateLoading.next(true);
    this.productDataStorageService.fetchProducts().subscribe({
      next: (responseData) => {
        this.products = responseData.products;

        this.updateProducts.next(this.products.slice());
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
        this.updateLoading.next(false);
      },
      complete: () => {
        this.updateLoading.next(false);
      },
    });
  }

  addProduct(product: FormData): void {
    this.updateLoading.next(true);

    this.productDataStorageService.createProduct(product).subscribe({
      next: (responseData) => {
        this.toastr.showSuccess('Product saved!', '', {
          toastClass: 'success-toast',
          timeOut: 3000,
          extendedTimeOut: 1000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
        });
        const product = new Product(
          responseData.product.id,
          responseData.product.productName,
          responseData.product.productCategory,
          responseData.product.productImages,
          responseData.product.description,
          responseData.product.priceInPKR
        );

        this.getProducts();
        // this.products.push(product);
        // this.updateProducts.next(this.products.slice());
        this.updateEditAddMode.next(false);
        this.updateLoading.next(false);
        this.router.navigate(['adminpanel/products']);
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
        this.updateLoading.next(false);
      },
      complete: () => {
        this.updateLoading.next(false);
      },
    });
  }

  removeProduct(productID: string, index: number): void {
    this.productDataStorageService.deleteProduct(productID).subscribe({
      next: (responseData) => {
        // this.products.splice(index, 1);
        // this.updateProducts.next(this.products.slice());
        this.getProducts();
        this.toastr.showSuccess('Product removed!', '', {
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

  editProduct(updatedProduct: FormData): void {
    this.updateLoading.next(true);
    this.productDataStorageService.updatedProduct(updatedProduct).subscribe({
      next: () => {
        this.getProducts();
        // this.updateProducts.next(this.products.slice());
        this.updateEditAddMode.next(false);
        this.updateLoading.next(false);
        this.toastr.showSuccess('Product edited!', '', {
          toastClass: 'success-toast',
          timeOut: 3000,
          extendedTimeOut: 1000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
        });
        this.router.navigate(['adminpanel/products']);
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
        this.updateLoading.next(false);
      },
      complete: () => {
        this.updateLoading.next(false);
      },
    });
  }
}
