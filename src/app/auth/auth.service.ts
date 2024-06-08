import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ReplaySubject, Subject } from 'rxjs';

import { AuthDataStorageService } from './auth-data-storage.service';

import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  updateError = new Subject<string>();
  updateLoadingStatus = new Subject<boolean>();
  updateUser = new ReplaySubject<User>(1);
  private token: undefined | null | string;
  private isAuthenticated = false;
  private timerExpiration: any;

  constructor(
    private authDataStorageService: AuthDataStorageService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  logIn(userName: string, password: string): void {
    this.updateLoadingStatus.next(true);
    this.authDataStorageService.logIn(userName, password).subscribe({
      next: (res) => {
        if (res.token) {
          this.token = res.token;
          this.isAuthenticated = true;

          const now = new Date();
          const expiresInDuration = res.expiresIn;
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );

          this.saveAuthData(res.token, expirationDate);
          this.setTokenTimer(expiresInDuration * 1000);

          const decodedToken: { exp: number; iat: number; userName: string } =
            jwtDecode(res.token);

          const user = new User(decodedToken.userName);

          this.updateUser.next(user);
          this.router.navigate(['/adminpanel/dashboard']);
        }
      },
      error: (err) => {
        this.updateLoadingStatus.next(false);
        this.updateError.next(err.error.message);

        console.log('AuthService err: ', err);
      },
      complete: () => {
        this.updateLoadingStatus.next(false);
      },
    });
  }

  autoAuth(): void {
    const authInfo = this.getAuthData();

    if (authInfo) {
      const now = new Date();
      const expirationDate = new Date(authInfo.expiresIn);
      const isInFuture = expirationDate.getTime() - now.getTime();

      if (isInFuture) {
        this.token = authInfo.token;
        this.isAuthenticated = true;

        const decodedToken: { exp: number; iat: number; userName: string } =
          jwtDecode(this.token);

        const user = new User(decodedToken.userName);
        this.updateUser.next(user);

        this.setTokenTimer(isInFuture);
      }
    }
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getAuthData(): undefined | { token: string; expiresIn: string } {
    let token = null;
    let expiresIn = null;

    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token');
      expiresIn = localStorage.getItem('expiresIn');
    }

    if (!token || !expiresIn) return;

    return {
      token: token,
      expiresIn: expiresIn,
    };
  }

  private saveAuthData(token: string, expirationDate: Date): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      localStorage.setItem('expiresIn', expirationDate.toISOString());
    }
  }

  private setTokenTimer(expiresInDuration: number): void {
    this.timerExpiration = setTimeout(() => {
      this.logOut();
    }, expiresInDuration);
  }

  private removeAuthData(): void {
    this.token = null;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('expiresIn');
    }
  }

  logOut(): void {
    this.removeAuthData();
    this.isAuthenticated = false;
    clearTimeout(this.timerExpiration);

    this.router.navigate(['/auth']);
  }

  getAuthToken(): undefined | null | string {
    return this.token;
  }
}
