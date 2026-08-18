import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminDomains } from './superadmin-domains';

describe('SuperadminDomains', () => {
  let component: SuperadminDomains;
  let fixture: ComponentFixture<SuperadminDomains>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperadminDomains],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperadminDomains);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
