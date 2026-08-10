import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mytickets } from './mytickets';

describe('Mytickets', () => {
  let component: Mytickets;
  let fixture: ComponentFixture<Mytickets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mytickets],
    }).compileComponents();

    fixture = TestBed.createComponent(Mytickets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
