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

  // 1️⃣ Exámenes Presentados
  listaExamenesUnicos: string[] = [];
  examenSeleccionadoId: string | null = null;
  examenesPresentados: any[] = [];
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
  listaCursosUnicos: { id: number, nombre: string }[] = [];
  cursoSeleccionadoId: number | null = null;
  resumenCurso: any = null;
  graficoResumenCurso: ChartData<'bar'> = {
    labels: ['Aprobados', 'Reprobados'],
    datasets: []
  };

  // 4️⃣ Notas por Curso
  cursoIdNotas: number | null = null;
  notasCurso: any[] = [];

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    this.cargarExamenesPresentados();
    this.cargarCursosUnicos();
  }

  // 📥 Exámenes Presentados
  cargarExamenesPresentados(): void {
    this.reportesService.getExamenesPresentados().subscribe(data => {
      this.examenesPresentados = data;
      this.listaExamenesUnicos = [...new Set(data.map((d: any) => d.examen))];
      this.actualizarExamenesFiltrados();
    });
  }

  actualizarExamenesFiltrados(): void {
    if (!this.examenSeleccionadoId) {
      this.examenesFiltrados = this.examenesPresentados;
    } else {
      this.examenesFiltrados = this.examenesPresentados.filter(
        ex => ex.examen === this.examenSeleccionadoId
      );
    }

    this.graficoExamenes = {
      labels: this.examenesFiltrados.map((d: any) => d.estudiante),
      datasets: [
        {
          label: 'Puntaje (%)',
          data: this.examenesFiltrados.map((d: any) => d.puntaje),
          backgroundColor: '#4CAF50'
        }
      ]
    };
  }

  // 📊 Estadísticas por Pregunta
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

  // 📚 Cursos únicos para resumen
  cargarCursosUnicos(): void {
    this.reportesService.getExamenesPresentados().subscribe(data => {
      const cursos = new Map();
      data.forEach((item: any) => {
        if (item.CURSO_ID && item.CURSO) {
          cursos.set(item.CURSO_ID, item.CURSO);
        }
      });
      this.listaCursosUnicos = Array.from(cursos.entries()).map(([id, nombre]) => ({ id, nombre }));
    });
  }

  // 📚 Resumen del Curso
  cargarResumenCurso(): void {
    if (!this.cursoSeleccionadoId) return;

    this.reportesService.getResumenCurso(this.cursoSeleccionadoId).subscribe(data => {
      this.resumenCurso = data;

      this.graficoResumenCurso = {
        labels: ['Aprobados', 'Reprobados'],
        datasets: [
          {
            label: 'Cantidad de estudiantes',
            data: [data.APROBADOS, data.REPROBADOS],
            backgroundColor: ['#2ecc71', '#e74c3c']
          }
        ]
      };
    });
  }

  // 📝 Notas por Curso
  cargarNotasCurso(): void {
    if (!this.cursoIdNotas) return;

    this.reportesService.getNotasPorCurso(this.cursoIdNotas).subscribe(data => {
      this.notasCurso = data;
    });
  }

  // 📥 Exportar Exámenes Presentados
  generarPDF(): void {
    const contenido = document.getElementById('reporteExamenes');
    if (!contenido) return;

    setTimeout(() => {
      html2canvas(contenido).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        const fecha = new Date().toLocaleDateString();
        pdf.setFontSize(10);
        pdf.text(`Generado el ${fecha}`, 10, pdf.internal.pageSize.getHeight() - 10);
        pdf.save('reporte_examenes_presentados.pdf');
      });
    }, 500);
  }

  // 📥 Exportar Resumen del Curso
  generarPDFResumen(): void {
    const contenido = document.getElementById('reporteResumenCurso');
    if (!contenido) return;

    setTimeout(() => {
      html2canvas(contenido).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        const fecha = new Date().toLocaleDateString();
        pdf.setFontSize(10);
        pdf.text(`Generado el ${fecha}`, 10, pdf.internal.pageSize.getHeight() - 10);
        pdf.save('resumen_curso.pdf');
      });
    }, 500);
  }
}
