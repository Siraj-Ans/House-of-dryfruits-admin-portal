import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

import { PulseLoadSpinnerComponent } from '../../shared/pulse-load-spinner/pulse-load-spinner.component';

import { ProductService } from './product.service';

import { Product } from './product.model';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    RouterModule,
    PulseLoadSpinnerComponent,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  products: Product[] = [];
  loading = false;
  editAddMode = false;
  productsSubscription: undefined | Subscription;
  editAddModeSubscription: undefined | Subscription;
  updateLoadingStatusSubscription: undefined | Subscription;

  constructor(
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productService.getProducts();

    this.productsSubscription = this.productService.updateProducts.subscribe(
      (products) => {
        this.products = products;
      }
    );

    this.editAddModeSubscription =
      this.productService.updateEditAddMode.subscribe((mode) => {
        this.editAddMode = mode;
      });

    this.updateLoadingStatusSubscription =
      this.productService.updateLoading.subscribe((status) => {
        this.loading = status;
      });
  }

  onAddProduct(): void {
    this.productService.updateEditAddMode.next(true);
    this.productService.editAddMode = true;
    this.router.navigate(['create-product/'], {
      relativeTo: this.activatedRoute,
    });
  }

  onEditProduct(product: Product, index: number): void {
    this.productService.updateEditAddMode.next(true);
    this.productService.editAddMode = true;

    this.productService.selectedProduct.next({
      product: product,
      index: index,
    });
    this.router.navigate(['edit-product/', product.id], {
      relativeTo: this.activatedRoute,
    });
  }

  onDeleteProduct(productID: string, index: number): void {
    this.productService.removeProduct(productID, index);
  }

  ngOnDestroy(): void {
    this.productsSubscription?.unsubscribe();
    this.editAddModeSubscription?.unsubscribe();
    this.updateLoadingStatusSubscription?.unsubscribe();
  }
}
