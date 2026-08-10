import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Alltickets } from './alltickets';

describe('Alltickets', () => {
  let component: Alltickets;
  let fixture: ComponentFixture<Alltickets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alltickets],
    }).compileComponents();

    fixture = TestBed.createComponent(Alltickets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
