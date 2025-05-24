import { Component } from '@angular/core';
import { NavbarProfesorComponent } from '../../shared/navbar-profesor/navbar-profesor.component';

@Component({
  selector: 'app-vista-profesor',
  standalone: true,
  imports: [NavbarProfesorComponent],
  templateUrl: './vista-profesor.component.html',
  styleUrl: './vista-profesor.component.css'
})
export class VistaProfesorComponent {

}
