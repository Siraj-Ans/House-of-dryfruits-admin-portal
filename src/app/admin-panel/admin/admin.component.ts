import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

import { PulseLoadSpinnerComponent } from '../../shared/pulse-load-spinner/pulse-load-spinner.component';
import { LoadSpinner } from '../../shared/load-spinner/load-spinner.component';

import { AdminService } from './admin.service';

import { Admin } from './admin.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    PulseLoadSpinnerComponent,
    LoadSpinner,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnDestroy {
  admins: Admin[] = [];
  update = false;
  loadingAdmins = false;
  creatingAdmin = false;
  updatedAdminIndex: undefined | number;
  adminForm!: FormGroup;
  adminsSubscription: undefined | Subscription;
  updateLoadingAdminsStatusSubscription: Subscription | undefined;
  updateCreateAdminLoadingStatusSubscription: Subscription | undefined;

  constructor(private adminService: AdminService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.adminService.getAdmins();

    this.adminForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, Validators.required],
    });

    this.adminService.updateStatus.subscribe((status) => {
      this.update = status;
    });

    this.adminsSubscription = this.adminService.updateAdmins.subscribe(
      (admins) => {
        this.admins = admins;
      }
    );

    this.updateLoadingAdminsStatusSubscription =
      this.adminService.updateLoadingAdminsStatus.subscribe((status) => {
        this.loadingAdmins = status;
      });

    this.updateCreateAdminLoadingStatusSubscription =
      this.adminService.updateCreateAdminLoadingStatus.subscribe((status) => {
        this.creatingAdmin = status;
      });
  }

  onCreateAdmin(): void {
    if (this.adminForm.invalid) return;

    const dateAndTime = new Date();

    if (this.update) {
      this.adminService.updateAdmin(
        this.admins[this.updatedAdminIndex!].id,
        this.adminForm.value.userName,
        this.adminForm.value.password,
        dateAndTime.toLocaleString(),
        this.updatedAdminIndex!
      );
    } else {
      this.adminService.createAdmin(
        this.adminForm.value.userName,
        this.adminForm.value.password,
        dateAndTime.toLocaleString()
      );
    }

    this.adminForm.reset();
  }

  onDeleteAdmin(id: string, index: number): void {
    const ans = confirm('Are you sure you want to delete the admin?');

    if (ans) this.adminService.removeAdmin(id, index);
  }

  onEditAdmin(admin: Admin, index: number): void {
    this.updatedAdminIndex = index;
    this.update = true;
    this.adminForm.patchValue({
      userName: admin.userName,
    });
  }

  onCancel(): void {
    this.update = false;
    this.adminForm.reset();
  }

  ngOnDestroy(): void {
    this.adminsSubscription?.unsubscribe();
    this.updateLoadingAdminsStatusSubscription?.unsubscribe();
    this.updateCreateAdminLoadingStatusSubscription?.unsubscribe();
  }
}
