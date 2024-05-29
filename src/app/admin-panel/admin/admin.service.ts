import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { AdminDataStorageService } from './admin-dataStorage.service';

import { Admin } from './admin.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  admins: Admin[] = [];
  updatedAdmins = new Subject<Admin[]>();
  updatedErrorMessage = new Subject<string>();

  constructor(private adminDataStorageService: AdminDataStorageService) {}

  createAdmin(userName: string, password: string, dateAndTime: string): void {
    this.adminDataStorageService
      .createAdmin(userName, password, dateAndTime)
      .subscribe({
        next: (responseData) => {
          this.admins.push(responseData.admin);
          this.updatedAdmins.next(this.admins.slice());
        },
        error: (error) => {
          this.updatedErrorMessage.next(error.error.message);
        },
        complete: () => {},
      });
  }

  getAdmins(): void {
    this.adminDataStorageService.fetchAdmins().subscribe({
      next: (responseData) => {
        this.admins = responseData.admins;
        this.updatedAdmins.next(this.admins.slice());
      },
    });
  }

  removeAdmin(id: string, index: number): void {
    this.adminDataStorageService.deleteAdmin(id).subscribe({
      next: (responseData) => {
        this.admins.splice(index, 1);
        this.updatedAdmins.next(this.admins.slice());
      },
      error: () => {},
    });
  }
}
