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
import { ExamenPresentadoDTO } from '../../../models/examenPresentado.dto';
import { ExamenPresentadoService } from '../../../services/examenPresentado.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-presentar',
  standalone: true,
  imports: [NavbarPresentandoComponent, CommonModule, FormsModule],
  templateUrl: './presentando.component.html',
  styleUrls: ['./presentando.component.css'],
})
export class PresentandoComponent implements OnInit {


  isLoading: boolean = false;
  progressValue: number = 0;

  examenId: number | null = null;
  examenTerminado: boolean = false;

  totalPreguntasRespondidas: number = 0;
  respuestasCorrectas: number = 0;

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
    private respuestaEstudianteService: RespuestaEstudianteService, // Agrega esto
    private examenPresentadoService: ExamenPresentadoService,
    private router: Router

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
      examen_pres_id: this.examenId!,
      pregunta_id: this.respuestaSeleccionada.pregunta_id
    };

    this.respuestasEstudiante.push(respuestaEstudiante);
    this.totalPreguntasRespondidas++;

    if (this.respuestaSeleccionada.esCorrecto) {
      this.respuestasCorrectas++;
    }

    console.log('Respuesta del estudiante guardada:', respuestaEstudiante);
  } else {
    console.warn('No se seleccionó ninguna respuesta para esta pregunta.');
  }

  this.respuestaSeleccionada = null;

  if (this.indicePreguntaActual < this.preguntas.length - 1) {
    this.cambiarPregunta(this.indicePreguntaActual + 1);
  } else {
    // En vez de terminar examen, solo activamos la variable para mostrar botón terminar
    this.examenTerminado = true;
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
  const usuario = this.estudianteService.getUsuario();
  if (!usuario) {
    console.error('No se pudo obtener el usuario');
    return;
  }

  // 1. Crear y guardar el examen presentado antes de todo
  const examenPresentado = this.crearExamenPresentado();

  if (examenPresentado) {
    this.examenPresentadoService.insertarExamenPresentado(examenPresentado).subscribe({
      next: (respuestaExamen) => {
        console.log('Examen presentado guardado con éxito:', respuestaExamen);

        this.examenId = respuestaExamen.id;

        // Ya no guardamos la última respuesta aquí

        // Enviar cada respuesta al backend con el examenId correcto
        for (const respuesta of this.respuestasEstudiante) {
          if (this.examenId !== null) {
            respuesta.examen_pres_id = this.examenId;
          } else {
            console.error('examenId es null, no se puede asignar a examen_pres_id');
            continue;
          }
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
        this.accionSalir();
        // Aquí podrías redirigir o mostrar mensaje al usuario
      },
      error: (err) => {
        console.error('Error al guardar el examen presentado:', err);
      }
    });
  } else {
    console.error('No se pudo crear el objeto ExamenPresentado.');
  }
}


  onRespuestaSeleccionada(): void {
  if (this.respuestaSeleccionada) {
    console.log('Respuesta seleccionada:', this.respuestaSeleccionada);
  } else {
    console.log('No se ha seleccionado ninguna respuesta');
  }
}

accionSalir(): void {
  console.log('Acción seleccionada para Salir');
  this.isLoading = true;
  this.progressValue = 0;

  const interval = setInterval(() => {
    this.progressValue += 1;
    if (this.progressValue >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        this.isLoading = false; // Oculta el indicador después del redireccionamiento
        this.router.navigate(['/presentar']);
      }, 500);
    }
  }, 30);
}


crearExamenPresentado(): ExamenPresentadoDTO | null {
  const usuario = this.estudianteService.getUsuario();
  const examenId = this.estudianteService.getExamenSeleccionadoId();

  if (!usuario || !examenId) {
    console.error('No se pudo obtener usuario o examenId');
    return null;
  }

  const ahora = new Date();

  const porcentaje = this.totalPreguntasRespondidas > 0
    ? (this.respuestasCorrectas / this.totalPreguntasRespondidas) * 100
    : 0;

  const examenPresentado: ExamenPresentadoDTO = {
    fecha: ahora,
    horaInicio: ahora,
    horaFin: new Date(), // ahora sí está finalizado
    usuarioId: usuario.id!,
    examenId: examenId,
    porcentaje: parseFloat(porcentaje.toFixed(2))  // redondear a 2 decimales
  };

  console.log('ExamenPresentadoDTO creado:', examenPresentado);
  return examenPresentado;
}

}
