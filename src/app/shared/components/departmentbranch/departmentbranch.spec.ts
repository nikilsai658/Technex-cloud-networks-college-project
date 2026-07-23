import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Departmentbranch } from './departmentbranch';

describe('Departmentbranch', () => {
  let component: Departmentbranch;
  let fixture: ComponentFixture<Departmentbranch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Departmentbranch],
    }).compileComponents();

    fixture = TestBed.createComponent(Departmentbranch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
