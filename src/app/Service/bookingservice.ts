import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly baseUrl = 'http://localhost:5085/api/bookings';

  constructor(private http: HttpClient) {}

  // 🔹 PRICE PREVIEW (Check Price)
  previewPrice(body: {
    unitTypeId: number;
    quantity: number;
    checkIn: string;
    checkOut: string;
    totalGuests: number;
  }) {
    return this.http.post(
      `${this.baseUrl}/price-preview`,
      body
    );
  }

  // 🔹 CREATE BOOKING
  createBooking(body: {
    unitTypeId: number;
    quantity: number;
    checkIn: string;
    checkOut: string;
    totalGuests: number;
    expectedAmount: number;
  }) {
    return this.http.post(
      this.baseUrl,
      body
    );
  }
}