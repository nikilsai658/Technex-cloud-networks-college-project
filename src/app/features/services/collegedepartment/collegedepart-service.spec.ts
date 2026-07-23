import { TestBed } from '@angular/core/testing';

import { CollegedepartService } from './collegedepart-service';

describe('CollegedepartService', () => {
  let service: CollegedepartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollegedepartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
