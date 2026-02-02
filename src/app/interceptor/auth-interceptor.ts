import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../Service/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  const authReq = req.clone({
    withCredentials: true // 🔐 cookie always sent
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        console.warn('🔒 Session expired → auto logout');

        // 🔥 clear frontend state
        authService.forceLogout();

        // 🔥 optional: tell backend to delete cookie
        fetch('http://localhost:5085/api/auth/logout', {
          method: 'POST',
          credentials: 'include'
        });

        router.navigate(['/login'], {
          queryParams: { sessionExpired: true }
        });
      }

      return throwError(() => error);
    })
  );
};