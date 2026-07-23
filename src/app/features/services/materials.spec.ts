import { TestBed } from '@angular/core/testing';

import { Materials } from './materials';

describe('Materials', () => {
  let service: Materials;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Materials);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
