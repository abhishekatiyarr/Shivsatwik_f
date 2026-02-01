import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  
  // Only run localStorage logic if we are in the browser
  if (isPlatformBrowser(platformId)) {
    // const token = localStorage.getItem('token');
    const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiR1VFU1QiLCJleHAiOjE3Njk4NjU1MjIsImlzcyI6IlNoaXZTYXR2aWtBUEkiLCJhdWQiOiJTaGl2U2F0dmlrVXNlcnMifQ.VjmkHkpIirJpkceH_mQMVvwAjKzs32Q_TIObU51wnCE"
    if (token) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next(authReq);
    }
  }

  return next(req);
};