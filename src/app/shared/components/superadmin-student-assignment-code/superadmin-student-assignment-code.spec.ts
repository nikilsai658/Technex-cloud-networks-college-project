import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminStudentAssignmentCode } from './superadmin-student-assignment-code';

describe('SuperadminStudentAssignmentCode', () => {
  let component: SuperadminStudentAssignmentCode;
  let fixture: ComponentFixture<SuperadminStudentAssignmentCode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperadminStudentAssignmentCode],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperadminStudentAssignmentCode);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
