import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { assignmentDetailResolver } from './assignment-detail-resolver';

describe('assignmentDetailResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => assignmentDetailResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
