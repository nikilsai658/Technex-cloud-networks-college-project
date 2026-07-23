import { TestBed } from '@angular/core/testing';

import { StudentdomaincoursemapSer } from './studentdomaincoursemap-ser';

describe('StudentdomaincoursemapSer', () => {
  let service: StudentdomaincoursemapSer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentdomaincoursemapSer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
