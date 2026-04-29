import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentListPage } from './assignment-list-page';

describe('AssignmentListPage', () => {
  let component: AssignmentListPage;
  let fixture: ComponentFixture<AssignmentListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignmentListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
