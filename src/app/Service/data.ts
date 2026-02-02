import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Homestay } from '../interface/Flats';
import { AvailabilityResponse } from '../interface/Availability';

@Injectable({
  providedIn: 'root',
})
export class Data {

  private homestayApiUrl = 'http://localhost:5085/api/Homestay';
  private availabilityApiUrl = 'http://localhost:5085/api/Availability/check';

  constructor(private http: HttpClient) {}

  // 🔓 PUBLIC
  getHomestay(): Observable<Homestay> {
    return this.http.get<Homestay>(this.homestayApiUrl);
  }

  // 🔓 PUBLIC AVAILABILITY CHECK
  checkAvailability(
    unitTypeId: number,
    checkIn: string,
    checkOut: string,
    quantity: number
  ): Observable<AvailabilityResponse> {

    const params = new HttpParams()
      .set('unitTypeId', unitTypeId)
      .set('checkIn', checkIn)
      .set('checkOut', checkOut)
      .set('quantity', quantity);

    return this.http.get<AvailabilityResponse>(
      this.availabilityApiUrl,
      { params } // ❌ no withCredentials needed
    );
  }
}