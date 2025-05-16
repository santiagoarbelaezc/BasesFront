import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentandoComponent } from './presentando.component';

describe('PresentandoComponent', () => {
  let component: PresentandoComponent;
  let fixture: ComponentFixture<PresentandoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresentandoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentandoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
