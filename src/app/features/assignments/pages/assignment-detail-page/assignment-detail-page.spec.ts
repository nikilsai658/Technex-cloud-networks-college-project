import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentDetailPage } from './assignment-detail-page';

describe('AssignmentDetailPage', () => {
  let component: AssignmentDetailPage;
  let fixture: ComponentFixture<AssignmentDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignmentDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
