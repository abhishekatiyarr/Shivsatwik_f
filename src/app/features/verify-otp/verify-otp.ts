import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Service/auth-service';
import { BookingIntent } from '../../Service/booking-intent';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [],
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
    private router: Router
  ) {}

  ngOnInit(): void {
    // 🔐 If user already logged in → redirect smartly
    if (this.auth.isLoggedIn()) {
      if (this.bookingIntent.fromBooking()) {
        this.router.navigate(['/booking']);
      } else {
        this.router.navigate(['/']);
      }
      return;
    }

    // 🔒 Protect invalid booking OTP access
    if (
      this.bookingIntent.fromBooking() &&
      !this.bookingIntent.intent()
    ) {
      this.router.navigate(['/']);
    }
  }

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

  verifyOtp() {
    if (this.otp().length !== 6) {
      this.error.set('Enter valid 6-digit OTP');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.auth
      .verifyOtp(this.phone(), this.otp(), this.name())
      .subscribe({
        next: (res) => {
          if (res?.verified) {
            // ✅ AuthService handles user + redirect
            this.auth.handleLoginSuccess(res);
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