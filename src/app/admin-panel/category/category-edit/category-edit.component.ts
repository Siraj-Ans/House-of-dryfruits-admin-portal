import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

import { CategoryService } from '../category.service';
import { CategoryDataStorageService } from '../category-dataStorage.service';

import { Category } from '../category.model';

@Component({
  selector: 'app-category-edit',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  standalone: true,
  templateUrl: './category-edit.component.html',
})
export class CategoryEditComponent implements OnDestroy {
  selectedCategory: undefined | Category;
  categories: Category[] = [];
  editCategoryForm!: FormGroup;
  selectedCategorySubscription: undefined | Subscription;
  categorySubscription: undefined | Subscription;

  constructor(
    private categoryService: CategoryService,
    private categoriesDataStorageService: CategoryDataStorageService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories();

    this.editCategoryForm = this.fb.group({
      categoryName: [null, Validators.required],
      parent: [null, Validators.required],
      properties: this.fb.array([]),
    });

    this.categorySubscription =
      this.categoryService.updatedCategories.subscribe((categories) => {
        this.categories = categories;
      });

    this.categoryService.selectedCategory.subscribe((category) => {
      this.selectedCategory = category;
      console.log('selectedCategory: ', this.selectedCategory);

      this.editCategoryForm
        .get('categoryName')!
        .setValue(this.selectedCategory.categoryName);

      if (this.selectedCategory.properties) {
        for (let i = 0; i < this.selectedCategory.properties.length; i++) {
          (<FormArray>this.editCategoryForm.get('properties')).push(
            new FormGroup({
              property: new FormControl(
                this.selectedCategory.properties[i].property
              ),
              value: new FormControl(
                this.selectedCategory.properties[i].values.join(',')
              ),
            })
          );
        }
      }
    });
  }

  get propertyControls(): FormArray {
    return this.editCategoryForm.get('properties') as FormArray;
  }

  onEditCategory(): void {}

  onDeletePropertyControl(index: number): void {
    (this.editCategoryForm.get('properties') as FormArray).removeAt(index);
  }

  onAddProperty(): void {
    (<FormArray>this.editCategoryForm.get('properties')).push(
      this.fb.group({
        property: [null, Validators.required],
        value: [null, Validators.required],
      })
    );
  }

  onSaveCategory(): void {
    if (this.editCategoryForm.invalid) return;

    const modifiedProperties = this.editCategoryForm
      .get('properties')!
      .value.map((property: { property: string; value: string }) => {
        return {
          property: property.property,
          values: property.value.split(','),
        };
      });

    const category = new Category(
      this.selectedCategory!.id,
      this.editCategoryForm.value.categoryName,
      modifiedProperties,
      this.editCategoryForm.value.parent
    );

    this.categoriesDataStorageService.updateCategory(category);
  }

  onCancelEdit(): void {
    this.categoryService.editMode.next('no-edit');
    this.router.navigateByUrl('/adminpanel/categories');
  }

  ngOnDestroy(): void {
    this.selectedCategorySubscription?.unsubscribe();
    this.categorySubscription?.unsubscribe();

    console.log('selectSub: ', this.selectedCategorySubscription);
    console.log('catSub: ', this.categorySubscription);
  }
}
