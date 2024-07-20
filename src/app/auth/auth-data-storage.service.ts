import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LoginResponseData } from './auth-reqs.model';

@Injectable({
  providedIn: 'root',
})
export class AuthDataStorageService {
  constructor(private http: HttpClient) {}

  logIn(userName: string, password: string): Observable<LoginResponseData> {
    return this.http.post<LoginResponseData>(
      'http://localhost:3000/api/auth/login',
      { userName: userName, password: password }
    );
  }
}
