import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatCards } from './flat-cards';

describe('FlatCards', () => {
  let component: FlatCards;
  let fixture: ComponentFixture<FlatCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlatCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
