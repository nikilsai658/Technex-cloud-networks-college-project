import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminStudentAssignments } from './superadmin-student-assignments';

describe('SuperadminStudentAssignments', () => {
  let component: SuperadminStudentAssignments;
  let fixture: ComponentFixture<SuperadminStudentAssignments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperadminStudentAssignments],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperadminStudentAssignments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
