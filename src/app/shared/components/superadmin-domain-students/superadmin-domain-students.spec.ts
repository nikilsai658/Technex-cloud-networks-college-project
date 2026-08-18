import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminDomainStudents } from './superadmin-domain-students';

describe('SuperadminDomainStudents', () => {
  let component: SuperadminDomainStudents;
  let fixture: ComponentFixture<SuperadminDomainStudents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperadminDomainStudents],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperadminDomainStudents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
