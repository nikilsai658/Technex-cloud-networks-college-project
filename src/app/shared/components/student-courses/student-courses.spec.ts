import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCourses } from './student-courses';

describe('StudentCourses', () => {
  let component: StudentCourses;
  let fixture: ComponentFixture<StudentCourses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCourses],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentCourses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
