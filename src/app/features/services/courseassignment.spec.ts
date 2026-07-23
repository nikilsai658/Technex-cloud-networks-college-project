import { TestBed } from '@angular/core/testing';

import { Courseassignment } from './courseassignment';

describe('Courseassignment', () => {
  let service: Courseassignment;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Courseassignment);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
