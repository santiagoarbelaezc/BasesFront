import { Component } from '@angular/core';
import { NavbarProfesorComponent } from '../../shared/navbar-profesor/navbar-profesor.component';

@Component({
  selector: 'app-tema',
  standalone: true,
  imports: [NavbarProfesorComponent],
  templateUrl: './tema.component.html',
  styleUrl: './tema.component.css'
})
export class TemaComponent {

}
