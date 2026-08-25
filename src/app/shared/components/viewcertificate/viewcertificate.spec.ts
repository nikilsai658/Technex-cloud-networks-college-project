import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewcertificate } from './viewcertificate';

describe('Viewcertificate', () => {
  let component: Viewcertificate;
  let fixture: ComponentFixture<Viewcertificate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Viewcertificate],
    }).compileComponents();

    fixture = TestBed.createComponent(Viewcertificate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
