import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Collegedepartment } from './collegedepartment';

describe('Collegedepartment', () => {
  let component: Collegedepartment;
  let fixture: ComponentFixture<Collegedepartment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Collegedepartment],
    }).compileComponents();

    fixture = TestBed.createComponent(Collegedepartment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
