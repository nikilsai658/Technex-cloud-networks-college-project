import { TestBed } from '@angular/core/testing';

import { Courseacademic } from './courseacademic';

describe('Courseacademic', () => {
  let service: Courseacademic;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Courseacademic);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
