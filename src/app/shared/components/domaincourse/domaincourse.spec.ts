import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Domaincourse } from './domaincourse';

describe('Domaincourse', () => {
  let component: Domaincourse;
  let fixture: ComponentFixture<Domaincourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Domaincourse],
    }).compileComponents();

    fixture = TestBed.createComponent(Domaincourse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
