import { Injectable } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';

import { Product } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  products: Product[] = [];
  productsChanged = new Subject<Product[]>();
  selectedProduct = new ReplaySubject<Product>();
  updateEditMode = new Subject<string>();

  getProducts(): Product[] {
    return this.products.slice();
  }

  getProductById(id: string): Product {
    const product = this.products.filter((product) => product.id === id);
    return product[0];
  }

  addProduct(product: Product): void {
    this.products.push(product);
    this.productsChanged.next(this.products.slice());
  }

  setProducts(products: Product[]): void {
    this.products = products;
    this.productsChanged.next(this.products.slice());
  }

  deleteProduct(index: number): void {
    this.products.splice(index, 1);
    this.productsChanged.next(this.products.slice());
  }

  updateProducts(updatedProduct: Product): void {
    const index = this.products.findIndex(
      (product) => product.id === updatedProduct.id
    );

    this.products[index] = updatedProduct;
    this.productsChanged.next(this.products.slice());
  }
}
