import { Component, OnInit } from '@angular/core';
import { NavbarEstudianteComponent } from '../../shared/navbar-estudiante/navbar-estudiante.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { forkJoin, map } from 'rxjs';
import { UsuarioDTO } from '../../../models/usuario.dto';
import { ExamenPresentadoVistaDTO } from '../../../models/examenPresentadoVista.dto';
import { ExamenPresentadoService } from '../../../services/examenPresentado.service';
import { ExamService } from '../../../services/exam.service';
import { ExamenPresentadoDTO } from '../../../models/examenPresentado.dto';

@Component({
  selector: 'app-calificaciones',
  standalone: true,
  imports: [NavbarEstudianteComponent, CommonModule, FormsModule],
  templateUrl: './calificaciones.component.html',
  styleUrls: ['./calificaciones.component.css']
})
export class CalificacionesComponent implements OnInit {

  usuario?: UsuarioDTO;
  examenesPresentados: ExamenPresentadoVistaDTO[] = [];

  cargandoCalificaciones: boolean = false;
  errorCargaCalificaciones: boolean = false;

  listaCalificaciones: any[] = [];

  constructor(
    private examenPresentadoService: ExamenPresentadoService,
    private examenService: ExamService
  ) {}

  ngOnInit(): void {
    // Aquí puedes cargar el usuario desde donde lo tengas guardado (ej: localStorage)
    const usuarioJson = localStorage.getItem('usuario');
    if (usuarioJson) {
      this.usuario = JSON.parse(usuarioJson);
      this.cargarExamenesPresentados();
    } else {
      console.warn('Usuario no encontrado en localStorage');
    }
  }

  cargarExamenesPresentados(): void {
    if (!this.usuario?.id) {
      console.warn('Usuario no cargado todavía');
      return;
    }

    this.cargandoCalificaciones = true;
    this.errorCargaCalificaciones = false;

    this.examenPresentadoService.obtenerExamenesPresentados().subscribe({
      next: (examenes: ExamenPresentadoDTO[]) => {
        // Filtrar los exámenes del usuario actual
        const exPresentadosUsuario = examenes.filter(
          examen => examen.usuarioId === this.usuario?.id
        );

        // Obtener todos los ExamenDTO asociados por examenId
        const observables = exPresentadosUsuario.map(examenPresentado =>
          this.examenService.obtenerExamenPorId(examenPresentado.examenId!).pipe(
            map(examenDTO => ({
              id: examenPresentado.id,
              fecha: examenPresentado.fecha,
              horaInicio: examenPresentado.horaInicio,
              horaFin: examenPresentado.horaFin,
              porcentaje: examenPresentado.porcentaje,
              usuario: this.usuario!,         // Usuario completo
              examen: examenDTO               // ExamenDTO obtenido
            }))
          )
        );

        forkJoin(observables).subscribe({
          next: (resultadoConExamenes) => {
            console.log('Resultado con exámenes detallados:', resultadoConExamenes); // 👈 Verifica la estructura recibida
            this.examenesPresentados = resultadoConExamenes;

            this.transformarExamenesAListaCalificaciones(resultadoConExamenes); // 👈 Aquí se genera la lista de calificaciones

            this.cargandoCalificaciones = false;
          },
          error: (err) => {
            console.error('Error al cargar exámenes detallados:', err);
            this.cargandoCalificaciones = false;
            this.errorCargaCalificaciones = true;
          }
        });


      },
      error: (err) => {
        console.error('Error al cargar exámenes presentados:', err);
        this.cargandoCalificaciones = false;
        this.errorCargaCalificaciones = true;
      }
    });
  }

  // Métodos de filtrado (puedes implementarlos luego)
  filtrarPorCurso(): void {
    console.log('Filtrar por curso');
  }

  filtrarPorTema(): void {
    console.log('Filtrar por tema');
  }

  listarCalificaciones(): void {
    // TODO: Implementar lógica para obtener todas las calificaciones
    console.log('Listar calificaciones');
  }

  filtrarPorCategoria(): void {
    console.log('Filtrar por categoría');
  }


  private transformarExamenesAListaCalificaciones(examenes: ExamenPresentadoVistaDTO[]): void {
  this.listaCalificaciones = examenes.map(ex => ({
    fecha: ex.fecha,
    horaInicio: ex.horaInicio,
    horaFin: ex.horaFin,
    porcentaje: ex.porcentaje,
    examen: ex.examen,
    nota: this.convertirPorcentajeANota(ex.porcentaje ?? 0)
  }));
  console.log('Lista Calificaciones:', this.listaCalificaciones);
}



  private convertirPorcentajeANota(porcentaje: number): number {
  // Convierte porcentaje (0-100) a nota (0.0 - 5.0) con 1 decimal
  const nota = (porcentaje / 100) * 5;
  return Math.round(nota * 10) / 10;
}

calcularTiempoEnMinutos(inicio?: Date | string, fin?: Date | string): number {
  if (!inicio || !fin) return 0;
  const inicioMs = Date.parse(inicio.toString());
  const finMs = Date.parse(fin.toString());
  const diffMs = finMs - inicioMs;
  return Math.round(diffMs / 60000); // milisegundos a minutos, redondeando correctamente
}




}
