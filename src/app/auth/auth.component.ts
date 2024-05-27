import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  errorMessage: undefined | string;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.updatedError.subscribe((errMsg) => {
      this.errorMessage = errMsg;
    });
  }

  onLogin(form: NgForm): void {
    this.authService.logIn(form.value.userName, form.value.password);
  }
}
