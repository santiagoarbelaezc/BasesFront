import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NavbarProfesorComponent } from '../../shared/navbar-profesor/navbar-profesor.component';

@Component({
  selector: 'app-curso',
  standalone: true,
  imports: [FormsModule,
            CommonModule,
            NavbarProfesorComponent
  ],
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css']
})
export class CursoComponent {
  // Propiedades del formulario
  nombreCurso: string = '';
  descripcionCurso: string = '';

  // Estado del formulario
  isSubmittingCurso: boolean = false;
  cursoCreado: boolean = false;
  errorCurso: string | null = null;

  // Método para manejar el envío del formulario
  onCrearCurso(form: NgForm): void {
    if (form.invalid) {
      this.errorCurso = 'Por favor, complete todos los campos obligatorios.';
      return;
    }

    this.isSubmittingCurso = true;
    this.errorCurso = null;

    // Aquí implementarías la lógica para crear el curso (ej. llamada HTTP)
    console.log('Creando curso:', this.nombreCurso, this.descripcionCurso);

    // Simulación de éxito (lógica real pendiente)
    setTimeout(() => {
      this.cursoCreado = true;
      this.isSubmittingCurso = false;
      form.resetForm(); // Limpia el formulario
    }, 1000);
  }
}
