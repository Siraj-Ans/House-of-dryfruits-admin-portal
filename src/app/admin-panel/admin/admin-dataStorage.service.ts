import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
  createAdminResponse,
  deleteAdminResponse,
  fetchAdminsResponse,
  UpdateAdminResponse,
} from './adminReqs.model';

import { environment } from '../../../environments/environment.development';

const BACKEND_URL = environment.apiUrl + '/admins/';

@Injectable({ providedIn: 'root' })
export class AdminDataStorageService {
  constructor(private http: HttpClient) {}

  createAdmin(
    userName: string,
    password: string,
    dateAndTime: string
  ): Observable<{
    message: string;
    admin: { id: string; userName: string; dateAndTime: string };
  }> {
    return this.http
      .post<createAdminResponse>(BACKEND_URL + 'createAdmin', {
        userName: userName,
        password: password,
        dateAndTime: dateAndTime,
      })
      .pipe(
        map((res) => {
          return {
            message: res.message,
            admin: {
              id: res.admin._id,
              userName: res.admin.userName,
              dateAndTime: res.admin.dateAndTime,
            },
          };
        })
      );
  }

  fetchAdmins(): Observable<{
    message: string;
    admins: { id: string; userName: string; dateAndTime: string }[];
  }> {
    return this.http.get<fetchAdminsResponse>(BACKEND_URL + 'fetchAdmins').pipe(
      map((res) => {
        return {
          message: res.message,
          admins: res.admins.map((user) => {
            return {
              id: user._id,
              userName: user.userName,
              dateAndTime: user.dateAndTime,
            };
          }),
        };
      })
    );
  }

  deleteAdmin(id: string): Observable<deleteAdminResponse> {
    return this.http.delete<deleteAdminResponse>(BACKEND_URL + 'deleteAdmin', {
      params: new HttpParams().set('adminID', id),
    });
  }

  updateAdmin(
    adminId: string,
    userName: string,
    password: string,
    dateAndTime: string
  ): Observable<{
    message: string;
  }> {
    return this.http
      .post<UpdateAdminResponse>(BACKEND_URL + 'updateAdmin', {
        adminId: adminId,
        userName: userName,
        password: password,
        dateAndTime: dateAndTime,
      })
      .pipe(
        map((res) => {
          return {
            message: res.message,
          };
        })
      );
  }
}
