import { Component, OnInit } from '@angular/core';
import { NavbarEstudianteComponent } from '../../shared/navbar-estudiante/navbar-estudiante.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin, map } from 'rxjs';
import { UsuarioDTO } from '../../../models/usuario.dto';
import { ExamenPresentadoVistaDTO } from '../../../models/examenPresentadoVista.dto';
import { ExamenPresentadoService } from '../../../services/examenPresentado.service';
import { ExamService } from '../../../services/exam.service';
import { CursoService } from '../../../services/curso.service';
import { ExamenPresentadoDTO } from '../../../models/examenPresentado.dto';
import { ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CalificacionesService } from '../../../services/calificaciones.service';

@Component({
  selector: 'app-calificaciones',
  standalone: true,
  imports: [NavbarEstudianteComponent, CommonModule, FormsModule, NgChartsModule],
  templateUrl: './calificaciones.component.html',
  styleUrls: ['./calificaciones.component.css']
})
export class CalificacionesComponent implements OnInit {

  usuario?: UsuarioDTO;
  examenesPresentados: ExamenPresentadoVistaDTO[] = [];

  cargandoCalificaciones: boolean = false;
  errorCargaCalificaciones: boolean = false;

  listaCalificaciones: any[] = [];
  listaCalificacionesOriginal: any[] = [];

  graficoCalificaciones: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  notaFinal: number = 0;

  constructor(
    private examenPresentadoService: ExamenPresentadoService,
    private examenService: ExamService,
    private cursoService: CursoService,
    private calificacionesService: CalificacionesService
  ) {}

  ngOnInit(): void {
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
        const exPresentadosUsuario = examenes.filter(
          examen => examen.usuarioId === this.usuario?.id
        );

        const observables = exPresentadosUsuario.map(examenPresentado =>
          this.examenService.obtenerExamenPorId(examenPresentado.examenId!).pipe(
            map(examenDTO => ({
              id: examenPresentado.id,
              fecha: examenPresentado.fecha,
              horaInicio: examenPresentado.horaInicio,
              horaFin: examenPresentado.horaFin,
              porcentaje: examenPresentado.porcentaje,
              usuario: this.usuario!,
              examen: examenDTO
            }))
          )
        );

        forkJoin(observables).subscribe({
          next: (resultadoConExamenes) => {
            this.examenesPresentados = resultadoConExamenes;
            this.transformarExamenesAListaCalificaciones(resultadoConExamenes);
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

  private transformarExamenesAListaCalificaciones(examenes: ExamenPresentadoVistaDTO[]): void {
    const observables = examenes.map(ex =>
      this.cursoService.obtenerCursoPorTemaId(ex.examen.tema_id).pipe(
        map(cursoNombre => ({
          fecha: ex.fecha,
          horaInicio: ex.horaInicio,
          horaFin: ex.horaFin,
          porcentaje: ex.porcentaje,
          examen: {
            ...ex.examen,
            cursoNombre: cursoNombre
          },
          nota: this.convertirPorcentajeANota(ex.porcentaje ?? 0)
        }))
      )
    );

    forkJoin(observables).subscribe({
      next: (resultados) => {
        this.listaCalificacionesOriginal = resultados;
        this.listaCalificaciones = [...resultados];
        this.cargandoCalificaciones = false;

        this.graficoCalificaciones = {
          labels: this.listaCalificaciones.map(c => c.examen.nombre),
          datasets: [
            {
              label: 'Nota (0-5)',
              data: this.listaCalificaciones.map(c => c.nota),
              backgroundColor: '#4CAF50'
            }
          ]
        };

        console.log('Lista Calificaciones con curso:', this.listaCalificaciones);
        this.obtenerNotaFinalDesdeBackend();
      },
      error: (err) => {
        console.error('Error al obtener cursos por tema:', err);
        this.cargandoCalificaciones = false;
        this.errorCargaCalificaciones = true;
      }
    });
  }

  obtenerNotaFinalDesdeBackend(): void {
    if (!this.usuario?.id) return;

    this.calificacionesService.obtenerNotaFinal(this.usuario.id).subscribe({
      next: (data) => {
        this.notaFinal = data.NOTAFINAL || 0;
      },
      error: (error) => {
        console.error('Error al obtener nota final desde backend:', error);
      }
    });
  }

  filtrarPorCurso(): void {
    const cursos = this.listaCalificacionesOriginal.map(c =>
      c.examen?.cursoNombre
    ).filter(Boolean);

    const cursosUnicos = [...new Set(cursos)];
    const cursoElegido = prompt(`Seleccione curso:\n${cursosUnicos.join('\n')}`);

    if (cursoElegido) {
      this.listaCalificaciones = this.listaCalificacionesOriginal.filter(c =>
        c.examen?.cursoNombre === cursoElegido
      );
    }
  }

  filtrarPorTema(): void {
    console.log('Filtrar por tema');
  }

  listarCalificaciones(): void {
    this.listaCalificaciones = [...this.listaCalificacionesOriginal];
  }

  filtrarPorCategoria(): void {
    console.log('Filtrar por categoría');
  }

  private convertirPorcentajeANota(porcentaje: number): number {
    const nota = (porcentaje / 100) * 5;
    return Math.round(nota * 10) / 10;
  }

  calcularTiempoEnMinutos(inicio?: Date | string, fin?: Date | string): number {
    if (!inicio || !fin) return 0;
    const inicioMs = Date.parse(inicio.toString());
    const finMs = Date.parse(fin.toString());
    const diffMs = finMs - inicioMs;
    return Math.round(diffMs / 60000);
  }
}
