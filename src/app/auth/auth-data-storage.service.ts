import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LoginResponseData } from './auth-reqs.model';

import { environment } from '../../environments/environment.development';

const BACKEND_URL = environment.apiUrl + '/auth/';

@Injectable({
  providedIn: 'root',
})
export class AuthDataStorageService {
  constructor(private http: HttpClient) {}

  logIn(userName: string, password: string): Observable<LoginResponseData> {
    return this.http.post<LoginResponseData>(BACKEND_URL + 'login', {
      userName: userName,
      password: password,
    });
  }
}
