import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaProfesorComponent } from './vista-profesor.component';

describe('VistaProfesorComponent', () => {
  let component: VistaProfesorComponent;
  let fixture: ComponentFixture<VistaProfesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaProfesorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
