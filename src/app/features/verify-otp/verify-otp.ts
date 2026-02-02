import { Component, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../Service/auth-service';
import { BookingIntent } from '../../Service/booking-intent';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css',
})
export class VerifyOtp implements OnInit {

  phone = signal('');
  otp = signal('');
  name = signal('');

  otpSent = signal(false);
  loading = signal(false);
  error = signal('');

  constructor(
    private auth: AuthService,
    private bookingIntent: BookingIntent,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    // 🔥 SESSION EXPIRED MESSAGE
    this.route.queryParams.subscribe(params => {
      if (params['sessionExpired']) {
        this.error.set('Session expired. Please login again.');
      }
    });

    // 🔐 Already logged in → go smartly
    if (this.auth.isLoggedIn()) {
      this.router.navigate(
        this.bookingIntent.intent() ? ['/booking'] : ['/']
      );
      return;
    }

    // ❌ Invalid direct OTP access
    if (!this.bookingIntent.intent() && !this.auth.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  // ================= SEND OTP =================
  sendOtp() {
    if (!this.phone()) {
      this.error.set('Phone number is required');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.auth.sendOtp(this.phone()).subscribe({
      next: () => {
        this.otpSent.set(true);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to send OTP');
        this.loading.set(false);
      },
    });
  }

  // ================= VERIFY OTP =================
  verifyOtp() {
    if (this.otp().length !== 6) {
      this.error.set('Enter valid 6-digit OTP');
      return;
    }

    if (!this.name()) {
      this.error.set('Name is required');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.auth.verifyOtp(this.phone(), this.otp(), this.name()).subscribe({
      next: (res) => {
        if (res?.verified) {
          this.auth.handleLoginSuccess(res);

          // 🔥 FINAL FIX — SMART REDIRECT
          if (this.bookingIntent.intent()) {
            this.router.navigate(['/booking']);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.error.set('Invalid OTP');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('OTP verification failed');
        this.loading.set(false);
      },
    });
  }
}