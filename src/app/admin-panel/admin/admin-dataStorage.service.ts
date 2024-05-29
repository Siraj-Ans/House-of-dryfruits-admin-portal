import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
  createAdminResponse,
  deleteAdminResponse,
  fetchAdminsResponse,
} from './adminReqs.model';

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
      .post<createAdminResponse>(
        'http://localhost:3000/api/admins/createAdmin',
        {
          userName: userName,
          password: password,
          dateAndTime: dateAndTime,
        }
      )
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
    return this.http
      .get<fetchAdminsResponse>('http://localhost:3000/api/admins/fetchAdmins')
      .pipe(
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
    return this.http.delete<deleteAdminResponse>(
      'http://localhost:3000/api/admins/deleteAdmin',
      {
        params: new HttpParams().set('adminID', id),
      }
    );
  }
}
