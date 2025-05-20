import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamenDTO } from '../../../models/exam.dto';
import { ExamService } from '../../../services/exam.service';
import { CategoriaDTO } from '../../../models/categoria.dto';
import { CategoriaService } from '../../../services/categoria.service';
import { TemaDTO } from '../../../models/tema.dto';
import { TemaService } from '../../../services/tema.service';
import { NavbarEstudianteComponent } from '../../shared/navbar-estudiante/navbar-estudiante.component';
import { Router } from '@angular/router';
import { EstudianteService } from '../../../services/estudiante.service';

@Component({
  selector: 'app-exam-create',
  standalone: true,
  imports: [NavbarEstudianteComponent, FormsModule, CommonModule],
  templateUrl: './presentar.component.html',
  styleUrls: ['./presentar.component.css'],
})
export class PresentarComponent {
  id?: number;
  examen: string = '';
  nombre: string = '';
  cantidad_preguntas?: number;
  fecha: string = '';
  tiempo?: number;
  pesoCurso?: number;
  umbralDeAprobacion?: number;
  asignacion: string = '';
  tema_id?: number;
  categoria_id?: number;

  isSubmitting = false;
  mensajeError = '';
  mensajeExito = false;

  listaExamenes: ExamenDTO[] = [];

  listaCategorias: CategoriaDTO[] = [];

  temas: TemaDTO[] = [];


  cargandoExamenes = false;
  errorCargaExamenes = false;

  examenSeleccionado: ExamenDTO | null = null;

  constructor(
  private examenService: ExamService,
  private categoriaService: CategoriaService,
  private temaService: TemaService,
  private router: Router,
  private estudianteService: EstudianteService // <<--- Agregado
) {
  this.cargarExamenes();
  this.cargarCategorias();
  this.cargarTemas(); 
}


cargarCategorias(): void {
  this.categoriaService.obtenerCategorias().subscribe({
    next: (categorias) => {
      this.listaCategorias = categorias;
      console.log('Categorías cargadas', categorias);
    },
    error: (err) => {
      console.error('Error al cargar categorías:', err);
    }
  });
}


 cargarTemas(): void {
    this.temaService.obtenerTemas().subscribe({
      next: (temas) => {
        this.temas = temas;
        console.log('Temas cargados', temas);
      },
      error: (err) => {
        console.error('Error al cargar temas:', err);
      }
    });
  }

  cargarExamenes(): void {
    this.cargandoExamenes = true;
    this.errorCargaExamenes = false;

    this.examenService.obtenerExamenes().subscribe({
      next: (examenes) => {
        this.listaExamenes = examenes;
        this.cargandoExamenes = false;
        console.log('Exámenes cargados', examenes);
      },
      error: (err) => {
        this.errorCargaExamenes = true;
        this.cargandoExamenes = false;
        console.error('Error al cargar exámenes:', err);
      }
    });
  }

  guardarExamen(form: NgForm): void {
    if (form.invalid) {
      this.mensajeError = 'Por favor completa todos los campos.';
      this.mensajeExito = false;
      return;
    }

    if (
      this.cantidad_preguntas === undefined || this.tiempo === undefined ||
      this.pesoCurso === undefined || this.umbralDeAprobacion === undefined ||
      this.tema_id === undefined || this.categoria_id === undefined
    ) {
      this.mensajeError = 'Por favor completa todos los campos numéricos.';
      this.mensajeExito = false;
      return;
    }

    this.isSubmitting = true;
    this.mensajeError = '';
    this.mensajeExito = false;

    const nuevoExamen: ExamenDTO = {
      id: this.id,
      examen: this.examen,
      nombre: this.nombre,
      cantidad_preguntas: this.cantidad_preguntas,
      fecha: this.fecha,
      tiempo: this.tiempo,
      pesoCurso: this.pesoCurso,
      umbralDeAprobacion: this.umbralDeAprobacion,
      asignacion: this.asignacion,
      tema_id: this.tema_id,
      categoria_id: this.categoria_id,
    };

    this.examenService.insertarExamen(nuevoExamen).subscribe({
      next: (examenCreado) => {
        this.listaExamenes.push(examenCreado);
        this.mensajeExito = true;
        this.isSubmitting = false;
        form.resetForm();
      },
      error: (err) => {
        this.mensajeError = 'Error al guardar el examen.';
        this.isSubmitting = false;
        console.error('Error al crear examen:', err);
      }
    });
  }

  editarExamen(): void {
    if (!this.examenSeleccionado || this.id == null) return;

    const examenActualizado: ExamenDTO = {
      id: this.id,
      examen: this.examen,
      nombre: this.nombre,
      cantidad_preguntas: this.cantidad_preguntas!,
      fecha: this.fecha,
      tiempo: this.tiempo!,
      pesoCurso: this.pesoCurso!,
      umbralDeAprobacion: this.umbralDeAprobacion!,
      asignacion: this.asignacion,
      tema_id: this.tema_id!,
      categoria_id: this.categoria_id!
    };

    this.isSubmitting = true;
    this.mensajeError = '';
    this.mensajeExito = false;

    this.examenService.actualizarExamen(this.id, examenActualizado).subscribe({
      next: (examen) => {
        const index = this.listaExamenes.findIndex(e => e.id === this.id);
        if (index > -1) {
          this.listaExamenes[index] = examen;
        }
        this.examenSeleccionado = null;
        this.mensajeExito = true;
        this.isSubmitting = false;
      },
      error: (err) => {
        this.mensajeError = 'Error al actualizar el examen.';
        this.isSubmitting = false;
        console.error('Error al actualizar examen:', err);
      }
    });
  }

  eliminarExamen(): void {
    if (!this.examenSeleccionado?.id) return;

    const id = this.examenSeleccionado.id;

    this.examenService.eliminarExamen(id).subscribe({
      next: () => {
        this.listaExamenes = this.listaExamenes.filter(e => e.id !== id);
        this.examenSeleccionado = null;
        this.mensajeExito = false;
      },
      error: (err) => {
        this.mensajeError = 'Error al eliminar el examen.';
        console.error('Error al eliminar examen:', err);
      }
    });
  }

  seleccionarExamen(examen: ExamenDTO): void {
    this.examenSeleccionado = examen;

    this.id = examen.id;
    this.examen = examen.examen;
    this.nombre = examen.nombre;
    this.cantidad_preguntas = examen.cantidad_preguntas;
    this.fecha = examen.fecha;
    this.tiempo = examen.tiempo;
    this.pesoCurso = examen.pesoCurso;
    this.umbralDeAprobacion = examen.umbralDeAprobacion;
    this.asignacion = examen.asignacion;
    this.tema_id = examen.tema_id;
    this.categoria_id = examen.categoria_id;
  }



  presentarExamen() {
  if (!this.examenSeleccionado?.id) {
    console.error('No se ha seleccionado un examen válido.');
    return;
  }

  // Guardar el id del examen seleccionado en el servicio
  this.estudianteService.setExamenSeleccionadoId(this.examenSeleccionado.id);

  // Redireccionar a la vista donde se presentará el examen
  this.router.navigate(['/presentando']);
}

listarExamenes() {
  // lógica para cargar o mostrar lista de exámenes
}

}
