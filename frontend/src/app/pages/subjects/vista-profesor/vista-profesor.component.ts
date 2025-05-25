import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { NavbarProfesorComponent } from '../../shared/navbar-profesor/navbar-profesor.component';

@Component({
  selector: 'app-profesor-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarProfesorComponent],
  templateUrl: './vista-profesor.component.html',
  styleUrls: ['./vista-profesor.component.css']
})
export class VistaProfesorComponent {
  isLoading = false;
  progressValue = 0;

  examenesRecientes = [
    {
      nombre: 'Examen de Álgebra Lineal',
      descripcion: 'Evaluación sobre vectores, matrices y transformaciones.',
      fecha: '2025-05-24'
    },
    {
      nombre: 'Evaluación de Estructuras de Datos',
      descripcion: 'Lista enlazada, árboles binarios y grafos básicos.',
      fecha: '2025-05-20'
    },
    {
      nombre: 'Parcial de Base de Datos',
      descripcion: 'Consultas SQL y normalización.',
      fecha: '2025-05-18'
    },
    {
      nombre: 'Examen de Arquitectura de Computadores',
      descripcion: 'Memoria, CPU, y sistemas digitales.',
      fecha: '2025-05-15'
    }
  ];

  // Método para hacer scroll en el carrusel de exámenes
  scrollCarousel(carouselId: string, direction: 'left' | 'right'): void {
    const carousel = document.querySelector(`.${carouselId}`) as HTMLElement;
    if (carousel) {
      const scrollAmount = 300;
      if (direction === 'left') {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }
}
