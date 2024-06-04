import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

// import { ProductDataStorageService } from './product-dataStorage.service';
// import { ProductService } from './product.service';

import { Product } from './product.model';
import { ProductDataStorageService } from './product-dataStorage.service';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterModule],
  templateUrl: './product.component.html',
})
export class ProductComponent {
  products: Product[] = [];
  productsChangedSubscription: undefined | Subscription;
  mode = 'no-edit';
  constructor(
    private productDataStorageService: ProductDataStorageService,
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}
  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }
  ngOnInit(): void {
    // this.productDataStorageService.fetchProducts().subscribe((products) => {
    //   this.products = products;
    // });
    this.productService.updateEditMode.subscribe((editMode) => {
      this.mode = editMode;
    });
  }
  onAddProduct(): void {
    this.mode = 'add-mode';
    this.router.navigate(['create-product/'], {
      relativeTo: this.activatedRoute,
    });
  }
  onEditProduct(product: Product): void {
    this.mode = 'edit-mode';
    // this.productService.selectedProduct.next(product);
    this.router.navigate(['edit-product/', product.id], {
      relativeTo: this.activatedRoute,
    });
  }
  onDeleteProduct(productID: string, index: number): void {
    const selectedProduct = this.products[index];
    // this.productDataStorageService.deleteProduct(
    //   productID,
    //   index,
    //   selectedProduct
    // );
  }
  ngOnDestroy(): void {}
}
