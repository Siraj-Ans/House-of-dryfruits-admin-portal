import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { LoadSpinner } from '../shared/load-spinner/load-spinner.component';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule, LoadSpinner],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit, OnDestroy {
  errorMessage: undefined | string;
  errorMessageSubscription: undefined | Subscription;
  loading = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.errorMessageSubscription = this.authService.updateError.subscribe(
      (errMsg) => {
        this.errorMessage = errMsg;
      }
    );

    this.authService.updateLoadingStatus.subscribe((status) => {
      this.loading = status;
    });
  }

  onLogin(form: NgForm): void {
    this.authService.logIn(form.value.userName, form.value.password);
  }

  ngOnDestroy(): void {
    this.errorMessageSubscription?.unsubscribe();
  }
}
