import { Component, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../Service/bookingservice';
import { BookingIntent } from '../../Service/booking-intent';
import { AuthService } from '../../Service/auth-service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking implements OnInit {

  /* 👥 current guests (UI source of truth) */
  guests = signal<number>(1);

  /* 📦 booking intent (from search page) */
  intent = computed(() => this.bookingIntent.intent());

  /* 🔥 backend price preview (STRICT SHAPE) */
  backendPrice = signal<{
    baseAmount: number;
    extraGuests: number;
    extraGuestCharges: number;
    totalAmount: number;
    warningMessage?: string | null;
  } | null>(null);

  /* 🚫 block booking when warning present */
  isBookingBlocked = computed(() => {
    return !!this.backendPrice()?.warningMessage;
  });

  constructor(
    private bookingIntent: BookingIntent,
    private bookingService: BookingService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const intent = this.intent();
    if (!intent) {
      this.router.navigate(['/']);
      return;
    }

    // 🔥 initial backend call
    this.callPricePreview(this.guests());
  }

  /* 👥 guest input handler */
  onGuestsChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = Number(input.value);
    const prevValue = this.guests();

    // ❌ block increase if backend warning present
    if (newValue > prevValue && this.backendPrice()?.warningMessage) {
      input.value = String(prevValue);
      return;
    }

    this.guests.set(newValue);
    this.callPricePreview(newValue);
  }

  /* 🔥 backend price preview */
  private callPricePreview(totalGuests: number) {
    const intent = this.intent();
    if (!intent) return;

    const payload = {
      unitTypeId: intent.unitTypeId,
      quantity: intent.quantity,
      checkIn: intent.checkIn,
      checkOut: intent.checkOut,
      totalGuests,
    };

    console.log('🔥 Price preview payload:', payload);

    this.bookingService.previewPrice(payload).subscribe({
      next: (res: any) => {
        console.log('✅ Price preview response:', res);

        // ✅ IMPORTANT: explicit mapping (NO [object Object])
        this.backendPrice.set({
          baseAmount: Number(res.baseAmount),
          extraGuests: Number(res.extraGuests),
          extraGuestCharges: Number(res.extraGuestCharges),
          totalAmount: Number(res.totalAmount),
          warningMessage: res.warningMessage ?? null,
        });
      },
      error: () => {
        console.log('❌ Price calculation failed');
        this.backendPrice.set(null);
      },
    });
  }

  /* 💰 final payable */
  finalPayable = computed(() => {
    return this.backendPrice()?.totalAmount ?? 0;
  });

  /* ✅ confirm booking */
  confirmBooking() {
    const intent = this.intent();
    const price = this.backendPrice();

    if (!intent || !price) return;

    if (price.warningMessage) {
      console.warn('🚫 Booking blocked:', price.warningMessage);
      return;
    }

    this.bookingService.createBooking({
      unitTypeId: intent.unitTypeId,
      quantity: intent.quantity,
      checkIn: intent.checkIn,
      checkOut: intent.checkOut,
      totalGuests: this.guests(),
      expectedAmount: price.totalAmount,
    }).subscribe({
      next: () => {
        console.log('✅ Booking successful');
        this.bookingIntent.clear();
        this.router.navigate(['/payment']);
      },
      error: () => console.log('❌ Something went wrong'),
    });
  }
}