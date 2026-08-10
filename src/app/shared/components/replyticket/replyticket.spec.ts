import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Replyticket } from './replyticket';

describe('Replyticket', () => {
  let component: Replyticket;
  let fixture: ComponentFixture<Replyticket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Replyticket],
    }).compileComponents();

    fixture = TestBed.createComponent(Replyticket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
