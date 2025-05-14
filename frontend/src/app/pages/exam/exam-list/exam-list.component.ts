import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './exam-list.component.html',
  styleUrl: './exam-list.component.css'
})
export class ExamListComponent {
  // Este componente se limita a mostrar contenido relacionado a la lista de exámenes.
  // Las acciones del navbar ya están unificadas y controladas en otro componente global.
}
