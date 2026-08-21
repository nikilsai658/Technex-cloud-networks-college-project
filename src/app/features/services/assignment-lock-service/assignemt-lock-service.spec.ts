import { TestBed } from '@angular/core/testing';

import { AssignmentLockService } from './assignemt-lock-service';

describe('AssignemtLockService', () => {
  let service: AssignmentLockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignmentLockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
