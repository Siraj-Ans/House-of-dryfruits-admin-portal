import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { SettingService } from './setting.service';

import { Product } from '../product/product.model';
import { Setting } from './Setting.model';
import { LoadSpinner } from '../../shared/load-spinner/load-spinner.component';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadSpinner],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css',
})
export class SettingComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  settings: Setting[] = [];
  loading = false;
  settingForm!: FormGroup;
  updateProductSubscription: Subscription | undefined;
  updateSettingsSubscription: Subscription | undefined;
  updateLoadingStatusSubscription: Subscription | undefined;

  constructor(
    private settingService: SettingService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.settingService.getSettings();

    this.settingForm = this.fb.group({
      featuredProduct: [null, [Validators.required]],
      shippingFee: [null, Validators.required],
    });

    this.settingService.getProducts();

    this.updateProductSubscription =
      this.settingService.updateProducts.subscribe((products) => {
        this.products = products;
        console.log(this.products);
      });

    this.updateSettingsSubscription =
      this.settingService.updateSettings.subscribe((settings) => {
        this.settings = settings;

        this.settingForm.setValue({
          featuredProduct: this.settings[0].value,
          shippingFee: this.settings[1].value,
        });
      });

    this.updateLoadingStatusSubscription =
      this.settingService.updateLoadingStatus.subscribe((status) => {
        this.loading = status;
      });
  }

  onSubmitSetting(): void {
    if (this.settingForm?.invalid) return;

    const featuredProduct = new Setting(
      'Featured Product',
      this.settingForm.value.featuredProduct,
      this.settings[0].id
    );

    const shippingFee = new Setting(
      'Shipping Fee',
      this.settingForm.value.shippingFee,
      this.settings[1].id
    );

    this.settingService.saveFeaturedProduct(featuredProduct);
    this.settingService.saveShippingFee(shippingFee);
  }

  ngOnDestroy(): void {
    this.updateProductSubscription?.unsubscribe();
    this.updateLoadingStatusSubscription?.unsubscribe();
    this.updateSettingsSubscription?.unsubscribe();
  }
}
