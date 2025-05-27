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

  constructor(
  private dificultadService: DificultadService,
  private temaService: TemaService,
  private categoriaService: CategoriaService,
  private bancoService: BancoService,
  private profesorService: ProfesorService,
  private examService: ExamService,
  private preguntaService: PreguntaService

) {}


  ngOnInit(): void {
  this.cargarDificultades();
  this.cargarCategorias();
  this.cargarTemas();
  this.cargarExamenes();

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
preguntas: any[] = [];          // Lista de preguntas (si aplica)
respuestas: any[] = [];         // Lista de respuestas para una pregunta

// Propiedades auxiliares
textoPregunta: string = '';
textoRespuesta: string = '';
esCorrecto: boolean = false;

// Método para registrar pregunta y respuestas
onRegistrarPreguntaRespuesta(): void {
  // Lógica para registrar pregunta con sus respuestas
}


agregarRespuesta(): void {
}


agregarPregunta(): void {
  console.log('=== Iniciando método agregarPregunta ===');
  console.log('Texto de la pregunta:', this.textoPregunta);
  console.log('Examen seleccionado:', this.examenSeleccionado);

  if (!this.textoPregunta.trim() || !this.examenSeleccionado || this.examenSeleccionado.id == null) {
    console.warn('Texto de la pregunta o examen no proporcionado');
    return;
  }

  const nuevaPregunta: PreguntaDTO = {
    texto: this.textoPregunta.trim(),
    examen_id: this.examenSeleccionado.id
  };

  console.log('Objeto nuevaPregunta que se enviará al backend:', nuevaPregunta);

  this.preguntaService.insertarPregunta(nuevaPregunta).subscribe({
    next: (response) => {
      console.log('Pregunta insertada exitosamente:', response);

      // Opcional: actualiza lista local
      this.preguntas.push(nuevaPregunta);
      console.log('Pregunta agregada localmente a la lista:', nuevaPregunta);

      // Limpiar campos
      this.textoPregunta = '';
      this.examenSeleccionado = null;
    },
    error: (err) => {
      console.error('Error al insertar pregunta:', err);
    }
  });
}


// Método para eliminar una respuesta por índice
eliminarRespuesta(): void {
  
}




}
