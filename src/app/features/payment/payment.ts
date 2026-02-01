import { Component, computed, OnInit } from '@angular/core';
import { BookingIntent } from '../../Service/booking-intent';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  imports: [],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment implements OnInit {
  intent = computed(() => this.bookingIntent.intent());
  confirmation = computed(() => this.bookingIntent.confirmation());

  loading = false;
  message = '';

  constructor(
    private bookingIntent: BookingIntent,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.intent() || !this.confirmation()) {
      this.router.navigate(['/']);
    }
  }

  /** 🔥 SIMULATE PAYMENT SUCCESS */
  paySuccess() {
    if (!this.confirmation()) return;

    this.loading = true;
    this.message = 'Processing payment...';

    this.http.post(
      `http://localhost:5085/api/payment/success`,
      null,
      {
        params: {
          bookingId: this.confirmation()!.bookingId,
          transactionId: 'TXN-' + Date.now(),
        },
      }
    ).subscribe({
      next: () => {
        this.message = 'Payment successful 🎉';
        setTimeout(() => {
          this.bookingIntent.clear();
          this.router.navigate(['/success']);
        }, 1500);
      },
      error: () => {
        this.message = 'Payment update failed ❌';
        this.loading = false;
      },
    });
  }

  /** ❌ SIMULATE PAYMENT FAILURE */
  payFailed() {
    if (!this.confirmation()) return;

    this.loading = true;
    this.message = 'Cancelling booking...';

    this.http.post(
      `http://localhost:5085/api/payment/failed`,
      null,
      {
        params: {
          bookingId: this.confirmation()!.bookingId,
        },
      }
    ).subscribe({
      next: () => {
        this.message = 'Payment failed. Booking cancelled ❌';
        setTimeout(() => {
          this.bookingIntent.clear();
          this.router.navigate(['/']);
        }, 1500);
      },
      error: () => {
        this.message = 'Payment update failed ❌';
        this.loading = false;
      },
    });
  }
}