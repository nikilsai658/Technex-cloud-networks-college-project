import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradingPage } from './grading-page';

describe('GradingPage', () => {
  let component: GradingPage;
  let fixture: ComponentFixture<GradingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradingPage],
    }).compileComponents();

    fixture = TestBed.createComponent(GradingPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
