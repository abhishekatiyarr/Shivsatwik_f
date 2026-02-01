import { TestBed } from '@angular/core/testing';

import { BookingIntent } from './booking-intent';

describe('BookingIntent', () => {
  let service: BookingIntent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingIntent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
