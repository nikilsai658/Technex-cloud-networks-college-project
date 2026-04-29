import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionForm } from './submission-form';

describe('SubmissionForm', () => {
  let component: SubmissionForm;
  let fixture: ComponentFixture<SubmissionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmissionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
