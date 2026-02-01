import { Component, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../Service/bookingservice';
import { BookingIntent } from '../../Service/booking-intent';
import { AuthService } from '../../Service/auth-service';
import { log } from 'node:console';

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
  children = signal<number>(0); 

  /* 📦 booking intent */
  intent = computed(() => this.bookingIntent.intent());

  /* 🔥 backend price preview */
  backendPrice = signal<{
    baseAmount: number;
    extraGuests: number;
    extraGuestCharges: number;
    totalAmount: number;
    maxGuestsAllowed: number;
    totalGuests: number;
    warningMessage?: string | null;
  } | null>(null);

  /* 🚫 booking block rule */
  isBookingBlocked = computed(() => {
    const bp = this.backendPrice();
    if (!bp) return true;
    return bp.totalGuests > bp.maxGuestsAllowed;
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

    // 🔁 restore guests if coming back (OTP / login case)
    if (intent.totalGuests) {
      this.guests.set(intent.totalGuests);
    }

    this.callPricePreview(this.guests());
  }

  /* 👥 guest input handler */
  onGuestsChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = Number(input.value);
    const prevValue = this.guests();

    const bp = this.backendPrice();

    // 🚫 hard stop at max guests
    if (bp && newValue > bp.maxGuestsAllowed) {
      input.value = String(prevValue);
      return;
    }

    if (newValue < 1) {
      input.value = String(prevValue);
      return;
    }

    this.guests.set(newValue);
    this.callPricePreview(newValue);
  }


  onChildrenChange(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = Number(input.value);

  if (value < 0) value = 0;
  if (value > this.guests()) value = this.guests(); // safety

  this.children.set(value);
}

  /* 🔥 backend price preview */
  private callPricePreview(totalGuests: number) {
    const intent = this.intent();
    if (!intent) return;

    const payload = {            // price preview ko bhejte h request k sath
      unitTypeId: intent.unitTypeId,
      quantity: intent.quantity,
      checkIn: intent.checkIn,
      checkOut: intent.checkOut,
      totalGuests,
    };

    this.bookingService.previewPrice(payload).subscribe({               //response k liye h price-preview k 
      next: (res: any) => {
        this.backendPrice.set({
          baseAmount: Number(res.baseAmount),
          extraGuests: Number(res.extraGuests),
          extraGuestCharges: Number(res.extraGuestCharges),
          totalAmount: Number(res.totalAmount),
          maxGuestsAllowed: Number(res.maxGuestsAllowed),
          totalGuests: Number(res.totalGuests),
          warningMessage: res.warningMessage ?? null,
        });
      },
      error: () => this.backendPrice.set(null),
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
  if (price.totalGuests > price.maxGuestsAllowed) return;

  // ✅ sync guests into intent
  this.bookingIntent.updateGuests(this.guests());

  this.bookingService.createBooking({
    unitTypeId: intent.unitTypeId,
    quantity: intent.quantity,
    checkIn: intent.checkIn,
    checkOut: intent.checkOut,

    TotalGuests: this.guests(),     // ✅ MATCHES BACKEND
    Children: this.children(),      // ✅ MATCHES BACKEND

    expectedAmount: price.totalAmount,
  }).subscribe({
    next: (res:any) =>{ 
       
      console.log('✅ Booking API response:', res);

      // 🔥 THIS IS MANDATORY
      this.bookingIntent.saveConfirmation(res);


      this.router.navigate(['/payment'])},
    error: () => console.log('❌ Booking failed'),
  });
}
}