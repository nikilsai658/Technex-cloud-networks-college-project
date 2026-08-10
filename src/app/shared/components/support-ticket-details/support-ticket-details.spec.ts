import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportTicketDetails } from './support-ticket-details';

describe('SupportTicketDetails', () => {
  let component: SupportTicketDetails;
  let fixture: ComponentFixture<SupportTicketDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportTicketDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportTicketDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
