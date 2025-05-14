import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component'; // Ruta real a tu navbar

@Component({
  selector: 'app-exam-detail',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './exam-detail.component.html',
  styleUrl: './exam-detail.component.css'
})
export class ExamDetailComponent {
  // Aquí solo va la lógica específica de exam-detail si la necesitas
}
