import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { assignmentGuard } from './assignment-guard';

describe('assignmentGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => assignmentGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
