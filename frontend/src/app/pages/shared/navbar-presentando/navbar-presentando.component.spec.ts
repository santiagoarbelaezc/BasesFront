import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPresentandoComponent } from './navbar-presentando.component';

describe('NavbarPresentandoComponent', () => {
  let component: NavbarPresentandoComponent;
  let fixture: ComponentFixture<NavbarPresentandoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarPresentandoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarPresentandoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
