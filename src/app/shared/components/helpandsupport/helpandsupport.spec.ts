import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Helpandsupport } from './helpandsupport';

describe('Helpandsupport', () => {
  let component: Helpandsupport;
  let fixture: ComponentFixture<Helpandsupport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Helpandsupport],
    }).compileComponents();

    fixture = TestBed.createComponent(Helpandsupport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
