import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { LoadSpinner } from '../../shared/load-spinner/load-spinner.component';

import { SettingService } from './setting.service';

import { Product } from '../product/product.model';
import { Setting } from './Setting.model';

import { positiveNumberValidator } from '../../shared/positive-number.validator';

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
      shippingFee: [null, [Validators.required, positiveNumberValidator()]],
    });

    this.settingService.getProducts();

    this.updateProductSubscription =
      this.settingService.updateProducts.subscribe((products) => {
        this.products = products;
      });

    this.updateSettingsSubscription =
      this.settingService.updateSettings.subscribe((settings) => {
        this.settings = settings;

        if (settings.length === 2) {
          this.settingForm.setValue({
            featuredProduct: this.settings[0].value,
            shippingFee: this.settings[1].value,
          });
        } else if (settings.length === 1) {
          if (settings[0].name === 'Featured Product') {
            this.settingForm.patchValue({
              featuredProduct: settings[0].value,
            });
          } else {
            this.settingForm.patchValue({
              shippingFee: settings[1].value,
            });
          }
        }
      });

    this.updateLoadingStatusSubscription =
      this.settingService.updateLoadingStatus.subscribe((status) => {
        this.loading = status;
      });
  }

  onSubmitSetting(): void {
    if (this.settingForm?.invalid) return;

    console.log(
      typeof this.settingForm.value.shippingFee,
      typeof this.settingForm.value.featuredProduct
    );
    let featuredProduct;
    let shippingFee;

    if (this.settings.length === 0) {
      featuredProduct = new Setting(
        'Featured Product',
        this.settingForm.value.featuredProduct
      );

      shippingFee = new Setting(
        'Shipping Fee',
        this.settingForm.value.shippingFee
      );
    } else if (this.settings.length === 1) {
      if (this.settings[0].name === 'Featured Product') {
        featuredProduct = new Setting(
          'Featured Product',
          this.settingForm.value.featuredProduct,
          this.settings[0].id
        );

        shippingFee = new Setting(
          'Shipping Fee',
          this.settingForm.value.shippingFee
        );
      } else {
        featuredProduct = new Setting(
          'Featured Product',
          this.settingForm.value.featuredProduct
        );

        shippingFee = new Setting(
          'Shipping Fee',
          this.settingForm.value.shippingFee,
          this.settings[0].id
        );
      }
    } else {
      featuredProduct = new Setting(
        'Featured Product',
        this.settingForm.value.featuredProduct,
        this.settings[0].id
      );

      shippingFee = new Setting(
        'Shipping Fee',
        this.settingForm.value.shippingFee,
        this.settings[1].id
      );
    }

    this.settingService.saveFeaturedProduct(featuredProduct);
    this.settingService.saveShippingFee(shippingFee);
  }

  ngOnDestroy(): void {
    this.updateProductSubscription?.unsubscribe();
    this.updateLoadingStatusSubscription?.unsubscribe();
    this.updateSettingsSubscription?.unsubscribe();
  }
}
