import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NavbarProfesorComponent } from '../../shared/navbar-profesor/navbar-profesor.component';
import { CursoService } from '../../../services/curso.service';
import { CursoDTO } from '../../../models/curso.dto';  // ✅ Usar DTO correcto

@Component({
  selector: 'app-curso',
  standalone: true,
  imports: [
    FormsModule,
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

  constructor(private cursoService: CursoService) {}

  // Método para manejar el envío del formulario
  onCrearCurso(form: NgForm): void {
    if (form.invalid) {
      this.errorCurso = 'Por favor, complete todos los campos obligatorios.';
      return;
    }

    this.isSubmittingCurso = true;
    this.errorCurso = null;

    const nuevoCurso: CursoDTO = {
      nombre: this.nombreCurso,
      descripcion: this.descripcionCurso
    };

    this.cursoService.insertarCurso(nuevoCurso).subscribe({  // ✅ Método correcto
      next: () => {
        this.cursoCreado = true;
        this.isSubmittingCurso = false;
        form.resetForm();
      },
      error: (err) => {
        this.errorCurso = 'Hubo un error al crear el curso.';
        this.isSubmittingCurso = false;
        console.error(err);
      }
    });
  }
}
