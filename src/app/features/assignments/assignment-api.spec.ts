import { TestBed } from '@angular/core/testing';

import { AssignmentApi } from './assignment-api';

describe('AssignmentApi', () => {
  let service: AssignmentApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignmentApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
