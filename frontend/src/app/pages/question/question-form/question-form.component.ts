import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NavbarProfesorComponent } from '../../shared/navbar-profesor/navbar-profesor.component';
import { DificultadService } from '../../../services/dificultad.service';
import { TemaService } from '../../../services/tema.service';
import { CategoriaService } from '../../../services/categoria.service';
import { BancoService } from '../../../services/banco.service';
import { ProfesorService } from '../../../services/profesor.service';
import { BancoPreguntaDTO } from '../../../models/bancoPregunta.dto';
import { ExamService } from '../../../services/exam.service';
import { PreguntaService } from '../../../services/pregunta.service';
import { PreguntaDTO } from '../../../models/pregunta.dto';
import { ExamenDTO } from '../../../models/exam.dto';
import { RespuestaDTO } from '../../../models/respuesta.dto';
import { RespuestaService } from '../../../services/respuesta.service';


@Component({
  selector: 'app-question-bank',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarProfesorComponent],
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css']
})
export class QuestionFormComponent implements OnInit {
  // Formularios
  texto: string = '';
  esPublica: boolean = false;
  revision: string = '';
  dificultadId: number | null = null;
  categoriaId: number | null = null;
  temaId: number | null = null;
  usuarioId: number | null = null;

  // Listas para selects
  dificultades: any[] = [];
  categorias: any[] = [];
  temas: any[] = [];
  usuarios: any[] = [];


  examenSeleccionado: ExamenDTO | null = null;


  // Estados y control
  preguntaSeleccionada: any = null;
  preguntasRegistradas: any[] = [];
  cargandoPreguntas: boolean = false;
  errorCargaPreguntas: string = '';
  errorRegistro: string = '';
  registroExitoso: boolean = false;
  isSubmitting: boolean = false;

  preguntas: PreguntaDTO[] = [];

  preguntasCargadas: PreguntaDTO[] = [];


  preguntaSeleccionadaId: number | null = null;
  respuestasDePregunta: RespuestaDTO[] = [];



  constructor(
  private dificultadService: DificultadService,
  private temaService: TemaService,
  private categoriaService: CategoriaService,
  private bancoService: BancoService,
  private profesorService: ProfesorService,
  private examService: ExamService,
  private preguntaService: PreguntaService,
  private respuestaService: RespuestaService

) {}


  ngOnInit(): void {
  this.cargarDificultades();
  this.cargarCategorias();
  this.cargarTemas();
  this.cargarExamenes();
  this.obtenerTodasLasPreguntas();

  const profesor = this.profesorService.getProfesor();
  if (profesor) {
    this.usuarioId = profesor.id ?? null; // Guarda el ID o null si es undefined
    if (this.usuarioId !== null) {
      this.cargarPreguntasPorUsuario(this.usuarioId);
    }
  } else {
    console.warn('No se encontró profesor actual');
  }
}


verRespuestas(preguntaId: number): void {
  if (this.preguntaSeleccionadaId === preguntaId) {
    // Si la misma pregunta está seleccionada, ocultar respuestas
    this.preguntaSeleccionadaId = null;
    this.respuestasDePregunta = [];
    return;
  }

  this.preguntaSeleccionadaId = preguntaId;
  this.respuestaService.obtenerRespuestasPorPreguntaId(preguntaId).subscribe({
    next: (data: RespuestaDTO[]) => {
      this.respuestasDePregunta = data;
      console.log(`Respuestas para la pregunta ${preguntaId}:`, data);
    },
    error: (err) => {
      console.error(`Error al obtener respuestas para la pregunta ${preguntaId}:`, err);
    }
  });
}



cargarPreguntasPorUsuario(usuarioId: number): void {
  this.cargandoPreguntas = true;
  this.bancoService.obtenerPreguntasPorUsuarioId(usuarioId).subscribe({
    next: (data) => {
      this.preguntasRegistradas = data;
      this.cargandoPreguntas = false;
    },
    error: (err) => {
      this.errorCargaPreguntas = 'Error al cargar preguntas del banco.';
      console.error(err);
      this.cargandoPreguntas = false;
    }
  });
}


cargarExamenes(): void {
  this.examService.obtenerExamenes().subscribe({
    next: (data) => {
      this.examenes = data;
    },
    error: (err) => {
      console.error('Error al cargar exámenes:', err);
    }
  });
}


  cargarDificultades(): void {
    this.dificultadService.obtenerDificultades().subscribe({
      next: (data) => this.dificultades = data,
      error: (err) => console.error('Error cargando dificultades:', err),
    });
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error cargando categorias:', err),
    });
  }

  cargarTemas(): void {
    this.temaService.obtenerTemas().subscribe({
      next: (data) => this.temas = data,
      error: (err) => console.error('Error cargando temas:', err),
    });
  }

  onRegistrarPregunta(form: NgForm): void {
  if (form.invalid || this.usuarioId === null) {
    this.errorRegistro = 'Formulario inválido o usuario no identificado.';
    return;
  }

  this.isSubmitting = true;
  this.errorRegistro = '';
  this.registroExitoso = false;

  const nuevaPregunta: BancoPreguntaDTO = {
    texto: this.texto.trim(),
    es_publica: this.esPublica,
    revision: this.revision.trim(),
    dificultad_id: this.dificultadId!,
    categoria_id: this.categoriaId!,
    tema_id: this.temaId!,
    usuario_id: this.usuarioId!
  };

  this.bancoService.insertarPregunta(nuevaPregunta).subscribe({
    next: () => {
      this.registroExitoso = true;
      this.limpiarFormulario(form);
      this.cargarPreguntasPorUsuario(this.usuarioId!); // Recarga la lista
    },
    error: (err) => {
      console.error('Error al registrar la pregunta:', err);
      this.errorRegistro = 'Error al registrar la pregunta.';
    },
    complete: () => {
      this.isSubmitting = false;
    }
  });
}
  limpiarFormulario(form: NgForm): void {
    form.resetForm();
    this.texto = '';
    this.revision = '';
    this.dificultadId = null;
    this.categoriaId = null;
    this.temaId = null;
    this.esPublica = false;
  }


  actualizarPregunta(): void {
    // Acción para actualizar una pregunta existente
  }

  seleccionarPregunta(pregunta: any): void {
  this.textoPregunta = pregunta.texto;
  this.examenId = pregunta.examen_id; // asegúrate que venga en el objeto pregunta
}


  eliminarPregunta(): void {
    // Acción para eliminar una pregunta
  }

  obtenerNombreDificultad(id: number): string {
    const dificultad = this.dificultades.find(d => d.dificultad_id === id);
    return dificultad ? dificultad.nombre : '';
  }

  obtenerNombreCategoria(id: number): string {
    const categoria = this.categorias.find(c => c.categoria_id === id);
    return categoria ? categoria.nombre : '';
  }

  obtenerNombreTema(id: number): string {
    const tema = this.temas.find(t => t.tema_id === id);
    return tema ? tema.nombre : '';
  }

  obtenerNombreUsuario(id: number): string {
    // Aquí deberías implementar similar lógica cuando tengas usuarios cargados
    return '';
  }


// Propiedades necesarias
examenId: number | null = null; // Se usa en el HTML
examenes: any[] = [];           // Por si estás cargando opciones de examen en un select
         // Lista de preguntas (si aplica)
respuestas: any[] = [];         // Lista de respuestas para una pregunta

// Propiedades auxiliares
textoPregunta: string = '';
textoRespuesta: string = '';
esCorrecto: boolean = false;



idPregunta: number | null = null;  // Puede ser null al inicio


// Método para registrar pregunta y respuestas
onRegistrarPreguntaRespuesta(): void {
  // Lógica para registrar pregunta con sus respuestas
}


agregarRespuesta(): void {
  if (this.idPregunta === null) {
    console.warn('No se ha seleccionado una pregunta para agregar la respuesta');
    return;
  }

  if (!this.textoRespuesta.trim()) {
    console.warn('El texto de la respuesta está vacío');
    return;
  }

  const nuevaRespuesta: RespuestaDTO = {
    texto: this.textoRespuesta.trim(),
    esCorrecto: this.esCorrecto ? 1 : 0,  // Si tu backend espera number (1/0)
    pregunta_id: this.idPregunta
  };

  console.log('Objeto nuevaRespuesta que se enviará al backend:', nuevaRespuesta);

  this.respuestaService.insertarRespuesta(nuevaRespuesta).subscribe({
    next: (respuestaCreada) => {
      console.log('Respuesta insertada exitosamente:', respuestaCreada);

      // Si quieres, actualiza la lista local de respuestas para mostrarla
      this.respuestasDePregunta.push(respuestaCreada);

      // Limpia los campos para nueva respuesta
      this.textoRespuesta = '';
      this.esCorrecto = false;
    },
    error: (error) => {
      console.error('Error al insertar respuesta:', error);
    }
  });
}


agregarPregunta(): void {
  console.log('=== Iniciando método agregarPregunta ===');
  console.log('Texto de la pregunta:', this.textoPregunta);
  console.log('Examen seleccionado:', this.examenSeleccionado);

  // Validación de entrada
  if (!this.textoPregunta?.trim()) {
    console.warn('El texto de la pregunta está vacío');
    return;
  }

  if (!this.examenSeleccionado || this.examenSeleccionado.id == null) {
    console.warn('No se ha seleccionado un examen válido');
    return;
  }

  const nuevaPregunta: PreguntaDTO = {
    texto: this.textoPregunta.trim(),
    examen_id: this.examenSeleccionado.id
  };

  console.log('Objeto nuevaPregunta que se enviará al backend:', nuevaPregunta);

  this.preguntaService.insertarPregunta(nuevaPregunta).subscribe({
    next: (preguntaInsertada) => {
      console.log('Pregunta insertada exitosamente:', preguntaInsertada);

      // Agregar la respuesta insertada (con ID generado) a la lista local
      this.preguntasCargadas.push(preguntaInsertada);


    },
    error: (error) => {
      console.error('Error al insertar pregunta:', error);
    }
  });
}



// Método para eliminar una respuesta por índice
eliminarRespuesta(): void {
  
}


obtenerTodasLasPreguntas(): void {
  this.preguntaService.obtenerPreguntas().subscribe({
    next: (data: PreguntaDTO[]) => {
      this.preguntasCargadas = data;  // <--- Aquí está el cambio
      console.log('Preguntas obtenidas:', this.preguntasCargadas);
    },
    error: (err) => {
      console.error('Error al obtener preguntas:', err);
    }
  });
}


eliminarPreguntaTemporal(index: number) {
  this.preguntasCargadas.splice(index, 1);
}

// Devuelve el nombre del examen a partir de su ID
obtenerNombreExamen(id: number): string {
  const examen = this.examenes.find(e => e.id === id);
  return examen ? examen.nombre : 'Desconocido';
}

}
