import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilitySearch } from './availability-search';

describe('AvailabilitySearch', () => {
  let component: AvailabilitySearch;
  let fixture: ComponentFixture<AvailabilitySearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilitySearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailabilitySearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
