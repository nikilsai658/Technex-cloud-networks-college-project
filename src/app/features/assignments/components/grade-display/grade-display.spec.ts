import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeDisplay } from './grade-display';

describe('GradeDisplay', () => {
  let component: GradeDisplay;
  let fixture: ComponentFixture<GradeDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(GradeDisplay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
