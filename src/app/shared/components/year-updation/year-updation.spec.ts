import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearUpdation } from './year-updation';

describe('YearUpdation', () => {
  let component: YearUpdation;
  let fixture: ComponentFixture<YearUpdation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearUpdation],
    }).compileComponents();

    fixture = TestBed.createComponent(YearUpdation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
