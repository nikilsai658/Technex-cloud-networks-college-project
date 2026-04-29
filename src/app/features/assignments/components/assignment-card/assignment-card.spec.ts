import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentCard } from './assignment-card';

describe('AssignmentCard', () => {
  let component: AssignmentCard;
  let fixture: ComponentFixture<AssignmentCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentCard],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignmentCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
