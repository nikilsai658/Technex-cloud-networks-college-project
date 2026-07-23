import { TestBed } from '@angular/core/testing';

import { DeptbranchService } from './deptbranch-service';

describe('DeptbranchService', () => {
  let service: DeptbranchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeptbranchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
