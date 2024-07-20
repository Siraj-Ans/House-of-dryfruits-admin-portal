import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private toastrService: ToastrService) {}

  showError(message: string, title: string, options: Object): void {
    this.toastrService.error(message, title, options);
  }

  showWarning(message: string, title: string, options: Object): void {
    this.toastrService.warning(message, title, options);
  }

  showSuccess(message: string, title: string, options: Object): void {
    this.toastrService.success(message, title, options);
  }
}
