import {
  Component,
  signal,
  computed,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Data } from '../../Service/data';

@Component({
  selector: 'app-availability-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './availability-search.html',
  styleUrl: './availability-search.css',
})
export class AvailabilitySearch {
  unitTypeId = signal<number | null>(null);
  checkIn = signal('');
  checkOut = signal('');
  quantity = signal(1);
  

  // UI state
  checking = signal(false);

  // Today (YYYY-MM-DD)
  today = computed(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });

  // Checkout must be >= check-in
  minCheckOut = computed(() => {
    return this.checkIn() || this.today();
  });

  isSearchDisabled = computed(() => {
    return (
      this.checking() ||
      !this.unitTypeId() ||
      !this.checkIn() ||
      !this.checkOut() ||
      this.checkOut() < this.checkIn() ||
      this.quantity() < 1
    );
  });

  @Output() availabilityChecked = new EventEmitter<{
    available: boolean;
    unitTypeId: number;
    checkIn: string;
    checkOut: string;
    quantity: number;     //no of flats
   
  }>();

  constructor(private availabilityService: Data) {}

  search() {
    if (this.isSearchDisabled()) return;

    this.checking.set(true);

    this.availabilityService
      .checkAvailability(
        this.unitTypeId()!,
        this.checkIn(),
        this.checkOut(),
        this.quantity()
      )
      .subscribe({
        next: (res) => {
          this.availabilityChecked.emit({
            available: res.available,
            unitTypeId: this.unitTypeId()!,
            checkIn: this.checkIn(),
            checkOut: this.checkOut(),
            quantity: this.quantity(),
          });
          this.checking.set(false);
        },
        error: () => this.checking.set(false),
      });
  }
}