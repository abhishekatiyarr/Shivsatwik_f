import { Injectable } from '@angular/core';

/**
 * BookingData
 * Guests        -> base allowed guests (per room, read-only)
 * totalGuests   -> user selected guests (runtime, MUST be set on booking page)
 */
export interface BookingData {
  unitTypeId: number;
  title: string;
  checkIn: string;
  checkOut: string;
  quantity: number;

  Guests: number;          // base allowed guests
  PricePerNight: number;
  Nights: number;
  TotalPrice: number;

  totalGuests?: number;    // 👈 runtime guests selected by user
}

@Injectable({
  providedIn: 'root',
})
export class BookingIntent {

  private _intent: BookingData | null = null;
  private _fromBooking = false;

  /* =========================
     SAVE INTENT (from search)
  ========================== */
  saveIntent(data: BookingData) {
    this._intent = { ...data };
    this._fromBooking = true;
  }

  /* =========================
     UPDATE GUESTS (from booking page)
  ========================== */
 updateGuests(totalGuests: number) {
  const Guests=totalGuests;
  if (!this._intent) return;

  this._intent = {
    ...this._intent,
    totalGuests,
    Guests
     // ✅ FINAL SOURCE OF TRUTH
  };

  console.log('from booking intent totalGuest',totalGuests)
  console.log("from booking intent full intent  ", this._intent)
}

  /* =========================
     READ INTENT
  ========================== */
  intent(): BookingData | null {
    return this._intent;
  }

  /* =========================
     LOGIN FLOW HELPERS
  ========================== */
  fromBooking(): boolean {
    return this._fromBooking;
  }

  verifyOtp() {
    this._fromBooking = false;
  }

  /* =========================
     CLEAR AFTER BOOKING
  ========================== */
  clear() {
    this._intent = null;
    this._fromBooking = false;
  }
}