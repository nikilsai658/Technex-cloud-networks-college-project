import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Studentdomaincourse } from './studentdomaincourse';

describe('Studentdomaincourse', () => {
  let component: Studentdomaincourse;
  let fixture: ComponentFixture<Studentdomaincourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Studentdomaincourse],
    }).compileComponents();

    fixture = TestBed.createComponent(Studentdomaincourse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
