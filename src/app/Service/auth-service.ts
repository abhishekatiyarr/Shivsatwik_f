import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BookingIntent } from './booking-intent';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  name: string;
  phone: string;
}



@Injectable({
  providedIn: 'root',
})
export class AuthService {

  user = signal<User | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private bookingIntent: BookingIntent,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // ✅ ONLY run in browser
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const phone = localStorage.getItem('phone');
      const name = localStorage.getItem('name');


console.log(  'AuthService initialized. User logged in:', name);

      if (token && phone && name) {
        this.user.set({ name, phone });
      }
    }
  }

  // 🔐 Send OTP
  sendOtp(phone: string) {
    return this.http.post(
      'http://localhost:5085/api/Auth/send-otp',
      { phone }
    );
  }

  // 🔐 Verify OTP
  verifyOtp(phone: string, otp: string, name: string) {
    console.log('Verifying OTP for phone:', phone, 'name:', name);
    return this.http.post<any>(
      'http://localhost:5085/api/Auth/verify-otp',
      { phone, otp, name }
    );
  }

  // ✅ Login success
  handleLoginSuccess(res: any) {

    console.log('handleLoginSuccess response:', res);
    if (!res?.token) return;

    const user: User = {
      name: res.fullName,
      phone: res.phone,
    };

    console.log('Login successful for user:', user);

    this.user.set(user);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('phone', res.phone);
      localStorage.setItem('name', res.fullName);
    }

    this.bookingIntent.verifyOtp();

    if (this.bookingIntent.fromBooking()) {
      this.router.navigate(['/booking']);
    } else {
      this.router.navigate(['/']);
    }
  }

  // 🔓 Logout
  logout() {
    this.user.set(null);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('phone');
      localStorage.removeItem('name');
    }

    this.router.navigate(['/']);
  }

  // 🔍 Login status
  isLoggedIn(): boolean {
    return !!this.user();
  }
}