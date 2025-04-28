import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamPresentationComponent } from './exam-presentation.component';

describe('ExamPresentationComponent', () => {
  let component: ExamPresentationComponent;
  let fixture: ComponentFixture<ExamPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamPresentationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
