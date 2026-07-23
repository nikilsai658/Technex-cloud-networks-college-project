import { TestBed } from '@angular/core/testing';

import { DomaincourseService } from './domaincourse-service';

describe('DomaincourseService', () => {
  let service: DomaincourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DomaincourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
