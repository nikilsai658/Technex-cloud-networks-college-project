import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rolepermission } from './rolepermission';

describe('Rolepermission', () => {
  let component: Rolepermission;
  let fixture: ComponentFixture<Rolepermission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rolepermission],
    }).compileComponents();

    fixture = TestBed.createComponent(Rolepermission);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
