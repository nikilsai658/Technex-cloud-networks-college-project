import { TestBed } from '@angular/core/testing';

import { AssignmentStore } from './assignment-store';

describe('AssignmentStore', () => {
  let service: AssignmentStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignmentStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
