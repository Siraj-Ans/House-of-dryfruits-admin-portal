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

import { PulseLoadSpinnerComponent } from '../../shared/pulse-load-spinner/pulse-load-spinner.component';

import { CategoryService } from './category.service';

import { Category } from './category.model';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    RouterModule,
    PulseLoadSpinnerComponent,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent implements OnDestroy {
  mode = 'no-edit';
  selectedCategoryId: undefined | string;
  categories: Category[] = [];
  loading = false;
  categoryForm!: FormGroup;
  categoriesSubscription: Subscription | undefined;
  editModeSubscription: Subscription | undefined;
  updateLoadingStatusSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories();

    this.categoryForm = this.fb.group({
      categoryName: [null, Validators.required],
      parent: [null],
      properties: this.fb.array([]),
    });

    this.categoriesSubscription =
      this.categoryService.updatedCategories.subscribe((categories) => {
        this.categories = categories;
      });

    this.editModeSubscription = this.categoryService.updatedEditMode.subscribe(
      (editMode) => {
        this.mode = editMode;
      }
    );

    this.updateLoadingStatusSubscription =
      this.categoryService.updateLoadingStatus.subscribe((status) => {
        this.loading = status;
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

  onEditCategory(category: Category, index: number): void {
    this.categoryService.setEditMode('edit');
    this.categoryService.updatedEditMode.next('edit');

    this.categoryService.selectedCategory.next({
      category: category,
      index: index,
    });
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

    (<FormArray>this.categoryForm.get('properties')).clear();
    this.categoryForm.reset();
  }

  onDeletePropertyControl(index: number): void {
    (this.categoryForm.get('properties') as FormArray).removeAt(index);
  }

  ngOnDestroy(): void {
    this.categoriesSubscription?.unsubscribe();
    this.editModeSubscription?.unsubscribe();
    this.updateLoadingStatusSubscription?.unsubscribe();
  }
}
