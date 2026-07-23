import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Branch } from './branch';

describe('Branch', () => {
  let component: Branch;
  let fixture: ComponentFixture<Branch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Branch],
    }).compileComponents();

    fixture = TestBed.createComponent(Branch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
