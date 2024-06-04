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

import { Category } from '../category.model';

@Component({
  selector: 'app-category-edit',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  standalone: true,
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css',
})
export class CategoryEditComponent implements OnDestroy {
  categories: Category[] = [];
  canExit = true;
  editCategoryErrorMessage: undefined | string;
  selectedCategory: undefined | Category;
  selectedCategoryIndex: undefined | number;
  editCategoryForm!: FormGroup;
  selectedCategorySubscription: undefined | Subscription;
  categoriesSubscription: undefined | Subscription;
  editCategoryErrorMessageSubscription: undefined | Subscription;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories();

    this.editCategoryForm = this.fb.group({
      categoryName: [null, Validators.required],
      parent: [null],
      properties: this.fb.array([]),
    });

    this.categoryService.updateEditCategoryErrorMessage.subscribe((errMsg) => {
      this.editCategoryErrorMessage = errMsg;
    });

    this.categoriesSubscription =
      this.categoryService.updatedCategories.subscribe((categories) => {
        this.categories = categories;
      });

    this.selectedCategorySubscription =
      this.categoryService.selectedCategory.subscribe((selected) => {
        this.selectedCategoryIndex = selected.index;
        this.selectedCategory = selected.category;

        if (this.selectedCategory.parent)
          this.editCategoryForm
            .get('parent')!
            .setValue(this.selectedCategory.parent.id);

        this.editCategoryForm
          .get('categoryName')!
          .setValue(this.selectedCategory.categoryName);

        if (this.selectedCategory.properties) {
          for (let i = 0; i < this.selectedCategory.properties.length; i++) {
            (<FormArray>this.editCategoryForm.get('properties')).push(
              new FormGroup({
                property: new FormControl(
                  this.selectedCategory.properties[i].property,
                  Validators.required
                ),
                values: new FormControl(
                  this.selectedCategory.properties[i].values.join(','),
                  Validators.required
                ),
              })
            );
          }
        }
      });
  }

  onChangeCategoryName(event: any): void {
    if (
      (<HTMLInputElement>event.target).value !==
      this.selectedCategory?.categoryName
    )
      this.canExit = false;
  }

  onChangeParent(event: any): void {
    if (this.selectedCategory?.parent) {
      if (
        (<HTMLInputElement>event.target).value !==
        this.selectedCategory.parent.id
      )
        this.canExit = false;
      else this.canExit = true;
    } else {
      this.canExit = false;
    }
  }

  get propertyControls(): FormArray {
    return this.editCategoryForm.get('properties') as FormArray;
  }

  onEditCategory(): void {
    if (this.editCategoryForm.invalid) return;

    const modifiedProperties = this.editCategoryForm
      .get('properties')!
      .value.map((property: { property: string; values: string }) => {
        return {
          property: property.property,
          values: property.values.split(','),
        };
      });

    let category: Category;

    if (this.editCategoryForm.value.parent) {
      category = new Category(
        this.selectedCategory!.id,
        this.editCategoryForm.value.categoryName,
        modifiedProperties,
        this.editCategoryForm.value.parent
      );
    } else {
      category = new Category(
        this.selectedCategory!.id,
        this.editCategoryForm.value.categoryName,
        modifiedProperties
      );
    }

    this.categoryService.editCategory(category, this.selectedCategoryIndex!);
  }

  onDeletePropertyControl(index: number): void {
    (this.editCategoryForm.get('properties') as FormArray).removeAt(index);
  }

  onAddProperty(): void {
    (<FormArray>this.editCategoryForm.get('properties')).push(
      this.fb.group({
        property: [null, Validators.required],
        values: [null, Validators.required],
      })
    );
  }

  onCancelEdit(): void {
    this.canExit = true;

    this.categoryService.setEditMode('no-edit');
    this.categoryService.updatedEditMode.next('no-edit');
    this.router.navigateByUrl('/adminpanel/categories');
  }

  ngOnDestroy(): void {
    this.selectedCategorySubscription?.unsubscribe();
    this.categoriesSubscription?.unsubscribe();
    this.editCategoryErrorMessageSubscription?.unsubscribe();
  }
}
