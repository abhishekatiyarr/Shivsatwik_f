import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  name: string;
  phone: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private userSignal = signal<User | null>(null);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // ✅ Restore user info only (NO token)
    if (isPlatformBrowser(this.platformId)) {
      const phone = localStorage.getItem('phone');
      const name = localStorage.getItem('name');

      if (phone && name) {
        this.userSignal.set({ name, phone });
      }
    }
  }

  /* =========================
     AUTH STATE
  ========================== */
  isLoggedIn(): boolean {
    return !!this.userSignal();
  }

  user() {
    return this.userSignal();
  }

  /* =========================
     OTP FLOW
  ========================== */
  sendOtp(phone: string) {
    return this.http.post(
      'http://localhost:5085/api/Auth/send-otp',
      { phone }
    );
  }

  verifyOtp(phone: string, otp: string, name: string) {
    return this.http.post<any>(
      'http://localhost:5085/api/Auth/verify-otp',
      { phone, otp, name },
      { withCredentials: true } // 🔐 cookie set here
    );
  }

  /* =========================
     LOGIN SUCCESS
     (NO NAVIGATION HERE)
  ========================== */
  handleLoginSuccess(res: any) {
    const user: User = {
      name: res.fullName,
      phone: res.phone,
    };

    this.userSignal.set(user);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('phone', user.phone);
      localStorage.setItem('name', user.name);
    }
  }

  /* =========================
     LOGOUT
  ========================== */
  logout() {
    this.forceLogout();

    fetch('http://localhost:5085/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  }

  forceLogout() {
    this.userSignal.set(null);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('phone');
      localStorage.removeItem('name');
    }
  }
}