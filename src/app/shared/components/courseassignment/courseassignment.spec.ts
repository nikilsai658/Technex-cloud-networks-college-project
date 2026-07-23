import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Courseassignment } from './courseassignment';

describe('Courseassignment', () => {
  let component: Courseassignment;
  let fixture: ComponentFixture<Courseassignment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Courseassignment],
    }).compileComponents();

    fixture = TestBed.createComponent(Courseassignment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
