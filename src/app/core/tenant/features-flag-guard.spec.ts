import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { featuresFlagGuard } from './features-flag-guard';

describe('featuresFlagGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => featuresFlagGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
