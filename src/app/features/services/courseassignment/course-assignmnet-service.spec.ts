import { TestBed } from '@angular/core/testing';

import { CourseAssignmnetService } from './course-assignmnet-service';

describe('CourseAssignmnetService', () => {
  let service: CourseAssignmnetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseAssignmnetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
