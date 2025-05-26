import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReportesService } from '../../services/reportes.service';
import { ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

  // 📋 Lista de exámenes (para el <select>)
  listaExamenes: { id: number, nombre: string }[] = [];
  examenSeleccionadoId: number | null = null;

  // 1️⃣ Exámenes Presentados (filtrados)
  examenesFiltrados: any[] = [];
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
    this.cargarListaExamenes();
  }

  // 🔍 Lista de exámenes disponibles (para el select)
  cargarListaExamenes(): void {
    this.reportesService.getExamenesPresentados().subscribe(data => {
      const mapa = new Map();
      data.forEach((e: any) => {
        if (!mapa.has(e.examen)) {
          mapa.set(e.examen, e.examenId);
        }
      });
      this.listaExamenes = Array.from(mapa.entries()).map(([nombre, id]) => ({ nombre, id }));
    });
  }

  // 1️⃣ Filtrar exámenes presentados por ID
  cargarExamenFiltrado(): void {
    if (!this.examenSeleccionadoId) return;

    this.reportesService.getExamenesPorExamenId(this.examenSeleccionadoId).subscribe(data => {
      this.examenesFiltrados = data;

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

  // 📥 Generar informe PDF
  generarPDF(): void {
    const contenido = document.getElementById('reporteExamenes');
    if (!contenido) return;

    html2canvas(contenido).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

      const nombre = this.listaExamenes.find(e => e.id === this.examenSeleccionadoId)?.nombre || 'reporte';
      const fecha = new Date().toLocaleDateString();
      pdf.setFontSize(10);
      pdf.text(`Generado el ${fecha}`, 10, pdf.internal.pageSize.getHeight() - 10);

      pdf.save(`reporte_${nombre}.pdf`);
    });
  }

  // 2️⃣ Estadísticas por pregunta
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

  // 3️⃣ Resumen por curso
  cargarResumenCurso(): void {
    if (!this.cursoIdResumen) return;

    this.reportesService.getResumenCurso(this.cursoIdResumen).subscribe(data => {
      this.resumenCurso = data;
    });
  }

  // 4️⃣ Notas por curso
  cargarNotasCurso(): void {
    if (!this.cursoIdNotas) return;

    this.reportesService.getNotasPorCurso(this.cursoIdNotas).subscribe(data => {
      this.notasCurso = data;
    });
  }
}
