import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookingService {

  private readonly baseUrl = 'http://localhost:5085/api/bookings';

  constructor(private http: HttpClient) {}

  // 🔐 PRICE PREVIEW (PROTECTED)
  previewPrice(body: {
    UnitTypeId: number;
    Quantity: number;
    CheckIn: string;
    CheckOut: string;
    TotalGuests: number;
  }) {
    return this.http.post(
      `${this.baseUrl}/price-preview`,
      body,
      { withCredentials: true } // 🔐 cookie
    );
  }

  // 🔐 CREATE BOOKING (PROTECTED)
  createBooking(body: {
    UnitTypeId: number;
    Quantity: number;
    CheckIn: string;
    CheckOut: string;
    TotalGuests: number;
    Children: number;
    ExpectedAmount: number;
  }) {
    return this.http.post(
      this.baseUrl,
      body,
      { withCredentials: true } // 🔐 cookie
    );
  }
}