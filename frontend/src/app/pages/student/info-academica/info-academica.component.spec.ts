import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAcademicaComponent } from './info-academica.component';

describe('InfoAcademicaComponent', () => {
  let component: InfoAcademicaComponent;
  let fixture: ComponentFixture<InfoAcademicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoAcademicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
