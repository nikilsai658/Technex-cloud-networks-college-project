import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveClasses } from './live-classes';

describe('LiveClasses', () => {
  let component: LiveClasses;
  let fixture: ComponentFixture<LiveClasses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveClasses],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveClasses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
