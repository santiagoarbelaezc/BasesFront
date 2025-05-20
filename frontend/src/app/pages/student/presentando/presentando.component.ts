import { Component, OnInit } from '@angular/core';
import { NavbarPresentandoComponent } from '../../shared/navbar-presentando/navbar-presentando.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstudianteService } from '../../../services/estudiante.service';
import { PreguntaService } from '../../../services/pregunta.service';
import { RespuestaService } from '../../../services/respuesta.service';  // <-- Importa el servicio
import { PreguntaDTO } from '../../../models/pregunta.dto';
import { RespuestaDTO } from '../../../models/respuesta.dto';  // <-- Importa la interfaz RespuestaDTO
import { RespuestaEstudianteDTO } from '../../../models/respuesta_pregunta.dto';
import { RespuestaEstudianteService } from '../../../services/respuesta_estudiante.service';

@Component({
  selector: 'app-presentar',
  standalone: true,
  imports: [NavbarPresentandoComponent, CommonModule, FormsModule],
  templateUrl: './presentando.component.html',
  styleUrls: ['./presentando.component.css'],
})
export class PresentandoComponent implements OnInit {

  examenId: number | null = null;

  preguntas: PreguntaDTO[] = [];

  preguntaActual: PreguntaDTO | null = null;
  indicePreguntaActual: number = 0;
  esUltimaPregunta: boolean = false;

  respuestasActuales: RespuestaDTO[] = [];  // Aquí guardarás las respuestas actuales

  respuestasEstudiante: RespuestaEstudianteDTO[] = [];


  respuestaSeleccionada: RespuestaDTO | null = null;

  constructor(
    private estudianteService: EstudianteService,
    private preguntaService: PreguntaService,
    private respuestaService: RespuestaService,   // Inyecta el servicio respuestas
    private respuestaEstudianteService: RespuestaEstudianteService // Agrega esto

  ) {}

 ngOnInit(): void {
  this.obtenerExamenIdDesdeServicio();
}



  obtenerExamenIdDesdeServicio(): void {
  this.examenId = this.estudianteService.getExamenSeleccionadoId();
  console.log('Examen ID desde servicio o localStorage:', this.examenId);

  if (this.examenId !== null) {
    this.cargarPreguntas(this.examenId);
  } else {
    console.error('No hay examenId guardado');
  }
}


  cargarPreguntas(examenId: number): void {
    this.preguntaService.obtenerPreguntasPorExamenId(examenId).subscribe({
      next: (preguntas: PreguntaDTO[]) => {
        this.preguntas = preguntas;
        console.log('Preguntas cargadas:', this.preguntas);
        if (this.preguntas.length > 0) {
          this.cambiarPregunta(0);  // Para inicializar pregunta y respuestas
        }
      },
      error: (err) => {
        console.error('Error cargando preguntas:', err);
      }
    });
  }

  // Cambiar pregunta actual y cargar sus respuestas
  cambiarPregunta(indice: number): void {
    if (indice >= 0 && indice < this.preguntas.length) {
      this.indicePreguntaActual = indice;
      this.preguntaActual = this.preguntas[indice];
      this.esUltimaPregunta = (indice === this.preguntas.length - 1);
      this.cargarRespuestas(this.preguntaActual.id!);  // Carga respuestas para esta pregunta
    }
  }

  cargarRespuestas(preguntaId: number): void {
    this.respuestaService.obtenerRespuestasPorPreguntaId(preguntaId).subscribe({
      next: (respuestas: RespuestaDTO[]) => {
        this.respuestasActuales = respuestas;
        console.log(`Respuestas cargadas para pregunta ${preguntaId}:`, this.respuestasActuales);
      },
      error: (err) => {
        console.error('Error cargando respuestas:', err);
        this.respuestasActuales = [];
      }
    });
  }

  siguientePregunta(): void {
  if (this.respuestaSeleccionada) {
    const respuestaEstudiante: RespuestaEstudianteDTO = {
      esCorrecta: this.respuestaSeleccionada.esCorrecto,
      examen_pres_id: this.examenId!, // ya está cargado en ngOnInit
      pregunta_id: this.respuestaSeleccionada.pregunta_id
    };

    // Guardamos la respuesta
    this.respuestasEstudiante.push(respuestaEstudiante);
    console.log('Respuesta del estudiante guardada:', respuestaEstudiante);
  } else {
    console.warn('No se seleccionó ninguna respuesta para esta pregunta.');
  }

  // Continuamos a la siguiente pregunta
  this.respuestaSeleccionada = null; // limpiar la selección
  if (this.indicePreguntaActual < this.preguntas.length - 1) {
    this.cambiarPregunta(this.indicePreguntaActual + 1);
  } else {
    console.log('Examen terminado. Respuestas del estudiante:', this.respuestasEstudiante);
    // Aquí podrías llamar a `terminarExamen()` para enviar las respuestas al backend
  }
}


  // Examen actualmente seleccionado
  examenSeleccionado: any = null;

  // Lista de exámenes disponibles
  listaExamenes: any[] = [];

  // Estado de carga y error
  cargandoExamenes: boolean = false;
  errorCargaExamenes: boolean = false;



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

 

 terminarExamen(): void {
  // Primero guardamos la última respuesta si existe
  if (this.respuestaSeleccionada && this.examenId && this.preguntaActual) {
    const ultimaRespuesta: RespuestaEstudianteDTO = {
      esCorrecta: this.respuestaSeleccionada.esCorrecto,
      examen_pres_id: this.examenId,
      pregunta_id: this.preguntaActual.id!
    };
    this.respuestasEstudiante.push(ultimaRespuesta);
  }

  // Enviar cada respuesta al backend
  for (const respuesta of this.respuestasEstudiante) {
    this.respuestaEstudianteService.insertarRespuestaEstudiante(respuesta).subscribe({
      next: () => {
        console.log('Respuesta enviada:', respuesta);
      },
      error: (err) => {
        console.error('Error al enviar respuesta:', err);
      }
    });
  }

  console.log('Examen finalizado. Respuestas enviadas.');
  // Aquí podrías redirigir o mostrar mensaje al usuario
}



  onRespuestaSeleccionada(): void {
  if (this.respuestaSeleccionada) {
    console.log('Respuesta seleccionada:', this.respuestaSeleccionada);
  } else {
    console.log('No se ha seleccionado ninguna respuesta');
  }
}


}
