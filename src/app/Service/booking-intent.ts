import { Injectable } from '@angular/core';

/* =========================
   BOOKING DATA
========================== */
export interface BookingData {
  unitTypeId: number;
  title: string;
  checkIn: string;
  checkOut: string;
  quantity: number;

  Guests: number;           // base allowed guests (per unit)
  PricePerNight: number;
  Nights: number;
  TotalPrice: number;

  totalGuests?: number;     // user-selected guests (FINAL)
}

/* =========================
   BOOKING CONFIRMATION
========================== */
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

  private _intent: BookingData | null = null;
  private _confirmation: BookingConfirmation | null = null;

  /* =========================
     SAVE INTENT (FROM SEARCH)
  ========================== */
  saveIntent(data: BookingData) {
    this._intent = {
      ...data,
      totalGuests: data.totalGuests ?? data.Guests,
    };
  }

  /* =========================
     UPDATE GUESTS (BOOKING PAGE)
  ========================== */
  updateGuests(totalGuests: number) {
    if (!this._intent) return;

    this._intent = {
      ...this._intent,
      totalGuests,
    };
  }

  /* =========================
     CONFIRMATION (BACKEND)
  ========================== */
  saveConfirmation(data: BookingConfirmation) {
    this._confirmation = { ...data };
  }

  /* =========================
     READERS
  ========================== */
  intent(): BookingData | null {
    return this._intent;
  }
  

  confirmation(): BookingConfirmation | null {
    return this._confirmation;
  }

  /* =========================
     HELPERS
  ========================== */
  hasIntent(): boolean {
    return !!this._intent;
  }

  /* =========================
     CLEAR (AFTER PAYMENT / CANCEL)
  ========================== */
  clear() {
    this._intent = null;
    this._confirmation = null;
  }
}