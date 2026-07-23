import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Studentassignment } from './studentassignment';

describe('Studentassignment', () => {
  let component: Studentassignment;
  let fixture: ComponentFixture<Studentassignment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Studentassignment],
    }).compileComponents();

    fixture = TestBed.createComponent(Studentassignment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
