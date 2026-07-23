import { TestBed } from '@angular/core/testing';

import { Studentassignment } from './studentassignment';

describe('Studentassignment', () => {
  let service: Studentassignment;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Studentassignment);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
