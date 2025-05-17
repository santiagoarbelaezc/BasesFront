import { Component } from '@angular/core';
import { NavbarPresentandoComponent } from '../../shared/navbar-presentando/navbar-presentando.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-presentar',
  standalone: true,
  imports: [NavbarPresentandoComponent, CommonModule, FormsModule],
  templateUrl: './presentando.component.html',
  styleUrls: ['./presentando.component.css'],

})
export class PresentandoComponent {

  // Examen actualmente seleccionado
  examenSeleccionado: any = null;

  // Lista de exámenes disponibles
  listaExamenes: any[] = [];

  // Estado de carga y error
  cargandoExamenes: boolean = false;
  errorCargaExamenes: boolean = false;

  // Pregunta y respuestas actuales
  preguntaActual: any = null;
  respuestasActuales: any[] = [];

  // Respuesta seleccionada por el usuario
  respuestaSeleccionada: any = null;

  // Índice de la pregunta actual
  indicePreguntaActual: number = 0;

  // Determina si estamos en la última pregunta
  esUltimaPregunta: boolean = false;

  // Métodos vacíos para manejar acciones
  presentarExamen(): void {
    // Lógica pendiente
  }

  listarExamenes(): void {
    // Lógica pendiente
  }

  seleccionarExamen(examen: any): void {
    // Lógica pendiente
  }

  siguientePregunta(): void {
    // Lógica pendiente
  }

  terminarExamen(): void {
    // Lógica pendiente
  }

}
