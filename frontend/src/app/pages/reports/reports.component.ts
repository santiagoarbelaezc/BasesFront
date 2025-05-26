import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReportesService } from '../../services/reportes.service';
import { ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';


@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, NgChartsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  // 🔘 Pestaña activa
  tabActiva: string = 'examenes';

  // 1️⃣ Exámenes Presentados
  examenesPresentados: any[] = [];
  graficoExamenes: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  // 2️⃣ Estadísticas por Pregunta
  examenIdSeleccionado: number | null = null;
  estadisticasPregunta: any[] = [];
  graficoEstadisticas: ChartData<'doughnut'> = {
    labels: [],
    datasets: []
  };

  // 3️⃣ Resumen del Curso
  cursoIdResumen: number | null = null;
  resumenCurso: any = null;

  // 4️⃣ Notas por Curso
  cursoIdNotas: number | null = null;
  notasCurso: any[] = [];

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    this.cargarExamenesPresentados();
  }

  // 1️⃣ Cargar exámenes presentados
  cargarExamenesPresentados(): void {
    this.reportesService.getExamenesPresentados().subscribe(data => {
      this.examenesPresentados = data;

      this.graficoExamenes = {
        labels: data.map((d: any) => d.estudiante),
        datasets: [
          {
            label: 'Puntaje (%)',
            data: data.map((d: any) => d.puntaje),
            backgroundColor: '#4CAF50'
          }
        ]
      };
    });
  }

  // 2️⃣ Cargar estadísticas por pregunta
  cargarEstadisticas(): void {
    if (!this.examenIdSeleccionado) return;

    this.reportesService.getEstadisticasPorPregunta(this.examenIdSeleccionado).subscribe(data => {
      this.estadisticasPregunta = data;

      this.graficoEstadisticas = {
        labels: data.map((d: any) => d.pregunta.slice(0, 30) + '...'),
        datasets: [
          {
            label: 'Correctas',
            data: data.map((d: any) => d.correctas),
            backgroundColor: '#2ecc71'
          },
          {
            label: 'Incorrectas',
            data: data.map((d: any) => d.incorrectas),
            backgroundColor: '#e74c3c'
          }
        ]
      };
    });
  }

  // 3️⃣ Cargar resumen de curso
  cargarResumenCurso(): void {
    if (!this.cursoIdResumen) return;

    this.reportesService.getResumenCurso(this.cursoIdResumen).subscribe(data => {
      this.resumenCurso = data;
    });
  }

  // 4️⃣ Cargar notas por curso
  cargarNotasCurso(): void {
    if (!this.cursoIdNotas) return;

    this.reportesService.getNotasPorCurso(this.cursoIdNotas).subscribe(data => {
      this.notasCurso = data;
    });
  }
}
