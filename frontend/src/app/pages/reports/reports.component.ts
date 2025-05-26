import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReportesService } from '../../services/reportes.service';
import { ChartData } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
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

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  // 📋 Lista de exámenes (para selector)
  listaExamenes: { id: number, nombre: string }[] = [];
  examenSeleccionadoId: number | null = null;

  // 1️⃣ Exámenes filtrados o presentados
  examenesFiltrados: any[] = [];
  graficoExamenes: ChartData<'bar'> = { labels: [], datasets: [] };

  // 2️⃣ Estadísticas por Pregunta
  examenIdSeleccionado: number | null = null;
  estadisticasPregunta: any[] = [];
  graficoEstadisticas: ChartData<'doughnut'> = { labels: [], datasets: [] };

  // 3️⃣ Resumen por curso
  cursoIdResumen: number | null = null;
  resumenCurso: any = null;

  // 4️⃣ Notas por curso
  cursoIdNotas: number | null = null;
  notasCurso: any[] = [];

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    this.cargarListaExamenes();
  }

  // 🔍 Obtener lista de exámenes únicos para selector
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

  // 1️⃣ Cargar exámenes filtrados por examenId y actualizar gráfico con retraso para evitar problemas con canvas
  cargarExamenFiltrado(): void {
    if (this.examenSeleccionadoId === null || isNaN(this.examenSeleccionadoId)) return;

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

      setTimeout(() => {
        this.chart?.update();
      }, 300);  // Tiempo de espera para que canvas se cargue bien
    });
  }

  // 📥 Exportar a PDF (tabla + gráfico)
  generarPDF(): void {
    const contenedorTabla = document.getElementById('reporteExamenes');
    const canvasGrafico = document.querySelector('canvas');

    if (!contenedorTabla || !canvasGrafico) {
      alert('No se puede generar el reporte. Asegúrate de tener datos cargados.');
      return;
    }

    setTimeout(() => {
      html2canvas(contenedorTabla, {
        ignoreElements: (element) => element.tagName === 'CANVAS',
        scale: 2,
        useCORS: true
      }).then(canvasContenido => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();

        const imgDataContenido = canvasContenido.toDataURL('image/png');
        const imgWidthContenido = pageWidth - 20;
        const imgHeightContenido = (canvasContenido.height * imgWidthContenido) / canvasContenido.width;

        pdf.addImage(imgDataContenido, 'PNG', 10, 10, imgWidthContenido, imgHeightContenido);

        html2canvas(canvasGrafico as HTMLElement, {
          scale: 2,
          useCORS: true
        }).then(canvasGraficoImg => {
          const imgDataGrafico = canvasGraficoImg.toDataURL('image/png');
          const imgWidthGrafico = pageWidth - 20;
          const imgHeightGrafico = (canvasGraficoImg.height * imgWidthGrafico) / canvasGraficoImg.width;

          const currentHeight = 10 + imgHeightContenido + 10;
          const maxHeight = pdf.internal.pageSize.getHeight();

          if (currentHeight + imgHeightGrafico > maxHeight) {
            pdf.addPage();
            pdf.addImage(imgDataGrafico, 'PNG', 10, 20, imgWidthGrafico, imgHeightGrafico);
          } else {
            pdf.addImage(imgDataGrafico, 'PNG', 10, currentHeight, imgWidthGrafico, imgHeightGrafico);
          }

          const nombre = this.listaExamenes.find(e => e.id === this.examenSeleccionadoId)?.nombre || 'reporte';
          const fecha = new Date().toLocaleDateString();

          pdf.setFontSize(10);
          pdf.text(`Generado el ${fecha}`, 10, pdf.internal.pageSize.getHeight() - 10);

          pdf.save(`reporte_${nombre}.pdf`);
        }).catch(err => {
          console.error('Error al capturar gráfico:', err);
          alert('Ocurrió un error al capturar el gráfico. Intenta nuevamente.');
        });

      }).catch(err => {
        console.error('Error al capturar contenido:', err);
        alert('Ocurrió un error al generar el reporte.');
      });

    }, 800);
  }

  // 2️⃣ Estadísticas por pregunta con actualización diferida para evitar problemas de render
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

      setTimeout(() => this.chart?.update(), 300);  // Espera para que canvas renderice bien
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
