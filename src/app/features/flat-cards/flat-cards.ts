import { Component, Input } from '@angular/core';
import { Homestay, UnitType } from '../../interface/Flats';
import { BookingData, BookingIntent } from '../../Service/booking-intent';
import { AuthService } from '../../Service/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flat-cards',
  standalone: true,
  templateUrl: './flat-cards.html',
  styleUrl: './flat-cards.css',
})
export class FlatCards {

  @Input() homestay!: Homestay | null;
  @Input() loading = false;
  @Input() showBookNow = false;

  @Input() checkIn!: string;
  @Input() checkOut!: string;
  @Input() quantity!: number;

  constructor(
    private bookingIntent: BookingIntent,
    private auth: AuthService,
    private router: Router
  ) {}

  onBookNow(unit: UnitType) {
    const nights = this.calculateNights(this.checkIn, this.checkOut);

    const intent: BookingData = {
      unitTypeId: unit.id,
      title: unit.title,
      checkIn: this.checkIn,
      checkOut: this.checkOut,
      quantity: this.quantity,
      Guests: unit.maxGuestsAllowed,
      PricePerNight: unit.basePricePerNight,
      Nights: nights,
      TotalPrice: unit.basePricePerNight * nights * this.quantity,
    };

    // 🔥 SAVED SAFELY
    this.bookingIntent.saveIntent(intent);

    // 🔐 AUTH DECISION
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/booking']);
    } else {
      this.router.navigate(['/verify-phone']);
    }
  }

  calculateNights(checkIn: Date | string, checkOut: Date | string): number {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diff = end.getTime() - start.getTime();
    return Math.max(1, diff / (1000 * 60 * 60 * 24));
  }
}