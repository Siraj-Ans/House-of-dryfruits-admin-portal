import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

import { CategoryService } from './category.service';

import { Category } from './category.model';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, RouterModule],
  templateUrl: './category.component.html',
})
export class CategoryComponent implements OnDestroy {
  mode = 'no-edit';
  selectedCategoryId = null;
  categories: Category[] = [];
  categoryForm!: FormGroup;
  categoriesSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories();

    this.categoriesSubscription =
      this.categoryService.updatedCategories.subscribe((categories) => {
        this.categories = categories;
      });

    this.categoryForm = this.fb.group({
      categoryName: [null, Validators.required],
      parent: [null],
      properties: this.fb.array([]),
    });

    this.categoryService.editMode.subscribe((editMode) => {
      this.mode = editMode;
    });
  }

  get propertyControls() {
    return this.categoryForm.get('properties') as FormArray;
  }

  onAddProperty(): void {
    (this.categoryForm.get('properties') as FormArray).push(
      this.fb.group({
        property: [null, Validators.required],
        values: [null, Validators.required],
      })
    );
  }

  onCancel(): void {
    this.categoryForm.reset();
  }

  onEditCategory(category: Category): void {
    this.mode = 'edit';

    this.categoryService.selectedCategory.next(category);

    this.router.navigate(['edit-category', category.id], {
      relativeTo: this.activatedRoute,
    });
  }

  onDeleteCategory(index: number, categoryID: string): void {
    this.categoryService.removeCategory(index, categoryID);
  }

  onSubmitCategory(): void {
    if (this.categoryForm.invalid) return;

    let modifiedProperties;

    modifiedProperties = this.categoryForm
      .get('properties')!
      .value.map((prop: { property: string; values: string }) => {
        return {
          property: prop.property,
          values: prop.values.split(','),
        };
      });

    let category: Category;

    if (this.categoryForm.value.parent) {
      console.log('parent');
      category = new Category(
        null,
        this.categoryForm.value.categoryName,
        modifiedProperties,
        this.categoryForm.value.parent
      );
    } else {
      category = new Category(
        null,
        this.categoryForm.value.categoryName,
        modifiedProperties
      );
    }
    this.categoryService.addCategory(category);

    this.categoryForm.get('categoryName')!.setValue(null);
    (<FormArray>this.categoryForm.get('properties')).clear();
  }

  onDeletePropertyControl(index: number): void {
    (this.categoryForm.get('properties') as FormArray).removeAt(index);
  }

  ngOnDestroy(): void {
    this.categoriesSubscription.unsubscribe();
  }
}
