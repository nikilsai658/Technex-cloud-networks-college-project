import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDomain } from './student-domain';

describe('StudentDomain', () => {
  let component: StudentDomain;
  let fixture: ComponentFixture<StudentDomain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDomain],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDomain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
