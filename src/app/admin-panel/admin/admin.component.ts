import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

import { AdminService } from './admin.service';

import { Admin } from './admin.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnDestroy {
  admins: Admin[] = [];
  adminsSubscription: undefined | Subscription;
  errorMessage: undefined | string;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getAdmins();

    this.adminsSubscription = this.adminService.updatedAdmins.subscribe(
      (admins) => {
        this.admins = admins;
      }
    );

    this.adminService.updatedAdmins.subscribe((admins) => {
      this.admins = admins;
    });

    this.adminService.updatedErrorMessage.subscribe((errMsg) => {
      this.errorMessage = errMsg;
    });
  }

  onCreateAdmin(adminForm: NgForm): void {
    if (adminForm.invalid) return;

    const dateAndTime = new Date();

    this.adminService.createAdmin(
      adminForm.value.userName,
      adminForm.value.password,
      dateAndTime.toLocaleString()
    );
    adminForm.reset();
  }

  onDeleteAdmin(id: string, index: number): void {
    this.adminService.removeAdmin(id, index);
  }

  onEditAdmin(id: string): void {}

  ngOnDestroy(): void {
    this.adminsSubscription?.unsubscribe();
  }
}
