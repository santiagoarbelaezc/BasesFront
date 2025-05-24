import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [FormsModule,CommonModule, NavbarComponent], // Aquí puedes importar otros módulos si es necesario
  standalone: true,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  

  @ViewChild('examenCarousel') examenCarouselRef!: ElementRef;

   // Inicializando las listas de exámenes, respuestas y recursos generales con algunos datos de ejemplo
   examenesRecientes = [
    { nombre: 'Examen de Algebra - Primer Parcial', descripcion: 'Álgebra y cálculo básico.', fecha: '2025-05-10' },
    { nombre: 'Examen de Historia - Segundo Parcial', descripcion: 'Segunda Guerra Mundial.', fecha: '2025-05-12' },
    { nombre: 'Examen de Física - Tercer Parcial', descripcion: 'Mecánica y movimiento.', fecha: '2025-05-15' },
    { nombre: 'Examen de Química - Cuarto Parcial', descripcion: 'Tabla periódica y enlaces químicos.', fecha: '2025-05-18' },
    { nombre: 'Examen de Literatura', descripcion: 'Autores del siglo XX.', fecha: '2025-05-19' },
    { nombre: 'Examen de Geografía', descripcion: 'Regiones naturales y países.', fecha: '2025-05-20' },
    { nombre: 'Examen de Biología', descripcion: 'Célula y reproducción.', fecha: '2025-05-22' },
    { nombre: 'Examen de Filosofía', descripcion: 'Filosofía clásica.', fecha: '2025-05-23' }
  ];

  examenesPresentados = [
    { nombre: 'Examen de Algebra - Primer Parcial', descripcion: 'Álgebra y cálculo básico.', fecha: '2025-05-10' },
    { nombre: 'Examen de Historia - Segundo Parcial', descripcion: 'Segunda Guerra Mundial.', fecha: '2025-05-12' },
    { nombre: 'Examen de Física - Tercer Parcial', descripcion: 'Mecánica y movimiento.', fecha: '2025-05-15' },
    { nombre: 'Examen de Química - Cuarto Parcial', descripcion: 'Tabla periódica y enlaces químicos.', fecha: '2025-05-18' },
    { nombre: 'Examen de Literatura', descripcion: 'Autores del siglo XX.', fecha: '2025-05-19' },
    { nombre: 'Examen de Geografía', descripcion: 'Regiones naturales y países.', fecha: '2025-05-20' },
    { nombre: 'Examen de Biología', descripcion: 'Célula y reproducción.', fecha: '2025-05-22' },
    { nombre: 'Examen de Filosofía', descripcion: 'Filosofía clásica.', fecha: '2025-05-23' }
  ];

  bancoPreguntas = [
    {
      tema: 'Álgebra',
      pregunta: '¿Cuál es la fórmula para resolver una ecuación cuadrática?',
      dificultad: 'Media'
    },
    {
      tema: 'Historia Universal',
      pregunta: '¿Cuáles fueron las causas principales de la Primera Guerra Mundial?',
      dificultad: 'Alta'
    },
    {
      tema: 'Física',
      pregunta: '¿Qué establece la ley de Newton de la gravitación universal?',
      dificultad: 'Baja'
    }
  ];

  recursosGenerales = [
    {
      titulo: 'Guía de Exámenes de Matemáticas',
      descripcion: 'Un recurso completo para estudiar álgebra y cálculo.',
      fecha: '2025-05-09'
    },
    {
      titulo: 'Historia Moderna: Segunda Guerra Mundial',
      descripcion: 'Artículo detallado sobre los eventos claves de la Segunda Guerra Mundial.',
      fecha: '2025-05-08'
    },
    {
      titulo: 'Guía para Resolver Problemas de Física',
      descripcion: 'Conjunto de recursos para resolver problemas de dinámica.',
      fecha: '2025-05-07'
    }
  ];

  constructor(private router: Router) { }

  isLoading: boolean = false;
  progressValue: number = 0;

  ngOnInit(): void {
    // Cualquier lógica adicional de inicialización si es necesario.
  }
  

  scrollCarousel(carouselClass: string, direction: 'left' | 'right') {
    const element = this.examenCarouselRef.nativeElement as HTMLElement;
    const scrollAmount = 300;

    if (direction === 'left') {
      element.scrollLeft -= scrollAmount;
    } else {
      element.scrollLeft += scrollAmount;
    }
  }


  
  accionSalir() {
  console.log('Acción seleccionada para Salir');
  this.isLoading = true;
  this.progressValue = 0;

  const interval = setInterval(() => {
    this.progressValue += 1;
    if (this.progressValue >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        this.isLoading = false; // Oculta el indicador después del redireccionamiento
        this.router.navigate(['/login']);
      }, 500);
    }
  }, 30);
}

}
