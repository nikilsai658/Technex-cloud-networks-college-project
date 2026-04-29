import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentCreatePage } from './assignment-create-page';

describe('AssignmentCreatePage', () => {
  let component: AssignmentCreatePage;
  let fixture: ComponentFixture<AssignmentCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentCreatePage],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignmentCreatePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
