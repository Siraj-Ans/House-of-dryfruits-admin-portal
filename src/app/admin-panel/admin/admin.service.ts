import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

import { AdminDataStorageService } from './admin-dataStorage.service';
import { ToastService } from '../../toastr.service';

import { Admin } from './admin.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  admins: Admin[] = [];
  updateStatus = new Subject<boolean>();
  updateAdmins = new Subject<Admin[]>();
  updateLoadingAdminsStatus = new ReplaySubject<boolean>(0);
  updateCreateAdminLoadingStatus = new Subject<boolean>();

  constructor(
    private adminDataStorageService: AdminDataStorageService,
    private toastr: ToastService
  ) {}

  createAdmin(userName: string, password: string, dateAndTime: string): void {
    this.updateCreateAdminLoadingStatus.next(true);
    this.adminDataStorageService
      .createAdmin(userName, password, dateAndTime)
      .subscribe({
        next: (responseData) => {
          this.admins.push(responseData.admin);
          this.updateAdmins.next(this.admins.slice());
          this.toastr.showSuccess('Admin created!', '', {
            toastClass: 'success-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
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
          this.updateCreateAdminLoadingStatus.next(false);
        },
        complete: () => {
          this.updateCreateAdminLoadingStatus.next(false);
        },
      });
  }

  updateAdmin(
    adminId: string,
    userName: string,
    password: string,
    dateAndTime: string,
    index: number
  ): void {
    this.updateCreateAdminLoadingStatus.next(true);

    this.adminDataStorageService
      .updateAdmin(adminId, userName, password, dateAndTime)
      .subscribe({
        next: (res) => {
          this.updateStatus.next(false);
          this.getAdmins();
          this.updateAdmins.next(this.admins.slice());
          this.toastr.showSuccess('Admin updated!', '', {
            toastClass: 'success-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
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
          this.updateStatus.next(false);
          this.updateCreateAdminLoadingStatus.next(false);
        },
        complete: () => {
          this.updateCreateAdminLoadingStatus.next(false);
        },
      });
  }

  getAdmins(): void {
    this.updateLoadingAdminsStatus.next(true);
    this.adminDataStorageService.fetchAdmins().subscribe({
      next: (responseData) => {
        this.admins = responseData.admins;
        this.updateAdmins.next(this.admins.slice());
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
        this.updateLoadingAdminsStatus.next(false);
      },
      complete: () => {
        this.updateLoadingAdminsStatus.next(false);
      },
    });
  }

  removeAdmin(id: string, index: number): void {
    this.adminDataStorageService.deleteAdmin(id).subscribe({
      next: (responseData) => {
        this.admins.splice(index, 1);
        this.updateAdmins.next(this.admins.slice());
        this.toastr.showSuccess('Admin removed!', '', {
          toastClass: 'success-toast',
          timeOut: 3000,
          extendedTimeOut: 1000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
        });
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
      },
      complete: () => {},
    });
  }
}
