import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { SettingDataStorageServiceService } from './setting-dataStorage.service';
import { ToastService } from '../../toastr.service';

import { Product } from '../product/product.model';
import { Setting } from './Setting.model';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  updateProducts = new Subject<Product[]>();
  updateSettings = new Subject<Setting[]>();
  updateLoadingStatus = new Subject<boolean>();

  constructor(
    private settingDataStorageService: SettingDataStorageServiceService,
    private toastr: ToastService
  ) {}

  getProducts(): void {
    this.updateLoadingStatus.next(true);
    this.settingDataStorageService.fetchProducts().subscribe({
      next: (res) => {
        this.updateProducts.next(res.products);
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
        this.updateLoadingStatus.next(false);
      },
      complete: () => {
        this.updateLoadingStatus.next(false);
      },
    });
  }

  getSettings(): void {
    // this.updateLoadingStatus.next(true);
    this.settingDataStorageService.fetchSettings().subscribe({
      next: (res) => {
        this.updateSettings.next(res.settings);
        console.log(res);
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
        // this.updateLoadingStatus.next(false);
      },
      complete: () => {
        // this.updateLoadingStatus.next(false);
      },
    });
  }

  saveFeaturedProduct(setting: Setting): void {
    this.updateLoadingStatus.next(true);
    this.settingDataStorageService.saveFeaturedProduct(setting).subscribe({
      next: (res) => {
        this.toastr.showSuccess('Featured product set!', '', {
          toastClass: 'success-toast',
          timeOut: 3000,
          extendedTimeOut: 1000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
        });
        console.log(res);
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
        this.updateLoadingStatus.next(false);
      },
      complete: () => {
        this.updateLoadingStatus.next(false);
      },
    });
  }

  saveShippingFee(setting: Setting): void {
    this.updateLoadingStatus.next(true);
    this.settingDataStorageService.saveShippingFee(setting).subscribe({
      next: (res) => {
        this.toastr.showSuccess('Shipping fee set!', '', {
          toastClass: 'success-toast',
          timeOut: 3000,
          extendedTimeOut: 1000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
        });
        console.log(res);
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
        this.updateLoadingStatus.next(false);
      },
      complete: () => {
        this.updateLoadingStatus.next(false);
      },
    });
  }
}
