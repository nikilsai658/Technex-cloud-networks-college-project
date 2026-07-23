import { TestBed } from '@angular/core/testing';

import { DomainServices } from './domain-services';

describe('DomainServices', () => {
  let service: DomainServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DomainServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
