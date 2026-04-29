import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDailog } from './confirm-dailog';

describe('ConfirmDailog', () => {
  let component: ConfirmDailog;
  let fixture: ComponentFixture<ConfirmDailog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDailog],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDailog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
