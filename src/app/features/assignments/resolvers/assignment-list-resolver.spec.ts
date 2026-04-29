import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { assignmentListResolver } from './assignment-list-resolver';

describe('assignmentListResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => assignmentListResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
