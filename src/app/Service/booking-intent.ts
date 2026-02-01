import { Injectable } from '@angular/core';

/* =========================
   BOOKING INTENT (SEARCH → BOOKING → PAYMENT)
========================== */

/**
 * BookingData
 * Guests        -> base allowed guests (read-only, from unit type)
 * totalGuests   -> user selected guests (runtime, FINAL)
 */
export interface BookingData {
  unitTypeId: number;
  title: string;
  checkIn: string;
  checkOut: string;
  quantity: number;

  Guests: number;          // base allowed guests (per unit)
  PricePerNight: number;
  Nights: number;
  TotalPrice: number;

  totalGuests?: number;    // ✅ user-selected guests (FINAL)
}

/**
 * BookingConfirmation
 * Backend response after createBooking
 */
export interface BookingConfirmation {
  bookingId: number;
  bookingCode: string;
  amount: number;
  holdExpiresAt: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingIntent {

  /* =========================
     INTERNAL STATE
  ========================== */
  private _intent: BookingData | null = null;
  private _confirmation: BookingConfirmation | null = null;
  private _fromBooking = false;

  /* =========================
     SAVE INTENT (FROM SEARCH PAGE)
  ========================== */
  saveIntent(data: BookingData) {
    this._intent = {
      ...data,
      // safety: initial totalGuests = base guests
      totalGuests: data.totalGuests ?? data.Guests,
    };
    this._fromBooking = true;
  }

  /* =========================
     UPDATE GUESTS (FROM BOOKING PAGE)
  ========================== */
  updateGuests(totalGuests: number) {
    if (!this._intent) return;

    this._intent = {
      ...this._intent,
      totalGuests,          // ✅ FINAL SOURCE OF TRUTH
      Guests: this._intent.Guests, // base guests unchanged
    };

    console.log('from booking intent totalGuests:', totalGuests);
    console.log('from booking intent full intent:', this._intent);
  }

  /* =========================
     SAVE BOOKING CONFIRMATION
     (AFTER CREATE BOOKING API)
  ========================== */
  saveConfirmation(data: BookingConfirmation) {
    this._confirmation = { ...data };
  }

  /* =========================
     READ INTENT
  ========================== */
  intent(): BookingData | null {
    return this._intent;
  }

  /* =========================
     READ CONFIRMATION
  ========================== */
  confirmation(): BookingConfirmation | null {
    return this._confirmation;
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
     CLEAR AFTER PAYMENT / CANCEL
  ========================== */
  clear() {
    this._intent = null;
    this._confirmation = null;
    this._fromBooking = false;
  }
}