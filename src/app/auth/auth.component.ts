import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit, OnDestroy {
  errorMessage: undefined | string;
  errorMessageSubscription!: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.errorMessageSubscription = this.authService.updatedError.subscribe(
      (errMsg) => {
        this.errorMessage = errMsg;
      }
    );
  }

  onLogin(form: NgForm): void {
    this.authService.logIn(form.value.userName, form.value.password);
  }

  ngOnDestroy(): void {
    this.errorMessageSubscription.unsubscribe();
  }
}
