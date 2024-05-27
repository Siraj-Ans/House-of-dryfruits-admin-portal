import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

export function AuthInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authToken = inject(AuthService).getAuthToken();

  const authRequest = req.clone({
    headers: req.headers.set('Authorization', 'Bearer ' + authToken),
  });
  return next(authRequest);
}
