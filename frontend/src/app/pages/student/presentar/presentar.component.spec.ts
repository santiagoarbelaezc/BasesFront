import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentarComponent } from './presentar.component';

describe('PresentarComponent', () => {
  let component: PresentarComponent;
  let fixture: ComponentFixture<PresentarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresentarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
