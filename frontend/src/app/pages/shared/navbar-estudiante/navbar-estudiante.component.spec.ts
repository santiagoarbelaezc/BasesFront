import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarEstudianteComponent } from './navbar-estudiante.component';

describe('NavbarEstudianteComponent', () => {
  let component: NavbarEstudianteComponent;
  let fixture: ComponentFixture<NavbarEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarEstudianteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
