import { Component, signal } from '@angular/core';
import { Banner } from '../banner/banner';
import { Data } from '../../Service/data';
import { AvailabilitySearch } from '../availability-search/availability-search';
import { Homestay } from '../../interface/Flats';
import { FlatCards } from '../flat-cards/flat-cards';

type HomeViewState =
  | 'INITIAL'
  | 'FILTERED_AVAILABLE'
  | 'FILTERED_NOT_AVAILABLE';

interface AvailabilityEvent {
  available: boolean;
  unitTypeId: number;
  checkIn: string;
  checkOut: string;
  quantity: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ Banner, AvailabilitySearch,FlatCards],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  /** 🔒 Original backend data (never mutated) */
  private fullHomestay = signal<Homestay| null>(null);

  /** 🎯 Data shown on UI */
  homestay = signal<Homestay | null>(null);

  /** ⏳ Loading state */
  loading = signal(true);

  /** 🧠 UI state */
  viewState = signal<HomeViewState>('INITIAL');

  /** 🔍 Last search (used later for booking intent) */
  lastSearch = signal({
    checkIn: '',
    checkOut: '',
    quantity: 1,
  });

  constructor(private homestayService: Data) {}

  ngOnInit(): void {
    this.homestayService.getHomestay().subscribe({
      next: (data) => {
        this.fullHomestay.set(data);
        this.homestay.set(data);
        this.viewState.set('INITIAL');
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onAvailabilityChecked(event: AvailabilityEvent) {
    const original = this.fullHomestay();
    if (!original) return;

    // store search context
    this.lastSearch.set({
      checkIn: event.checkIn,
      checkOut: event.checkOut,
      quantity: event.quantity,
    });

    if (!event.available) {
      this.homestay.set({
        ...original,
        unitTypes: [],
      });
      this.viewState.set('FILTERED_NOT_AVAILABLE');
      return;
    }

    const filteredUnits = original.unitTypes.filter(
      (u) => u.id === event.unitTypeId
    );

    this.homestay.set({
      ...original,
      unitTypes: filteredUnits,
    });

    this.viewState.set('FILTERED_AVAILABLE');
  }

  resetHome() {
    const original = this.fullHomestay();
    if (!original) return;

    this.homestay.set(original);
    this.viewState.set('INITIAL');

    this.lastSearch.set({
      checkIn: '',
      checkOut: '',
      quantity: 1,
    });
  }
}