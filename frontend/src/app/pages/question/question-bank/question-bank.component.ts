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


@Component({
  selector: 'app-question-bank',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarProfesorComponent],
  templateUrl: './question-bank.component.html',
  styleUrls: ['./question-bank.component.css']
})
export class QuestionBankComponent implements OnInit {
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
  private profesorService: ProfesorService
) {}


  ngOnInit(): void {
  this.cargarDificultades();
  this.cargarCategorias();
  this.cargarTemas();

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
    // Acción para registrar una nueva pregunta
  }

  actualizarPregunta(): void {
    // Acción para actualizar una pregunta existente
  }

  seleccionarPregunta(pregunta: any): void {
    // Acción para seleccionar una pregunta del listado
  }

  eliminarPregunta(preguntaId: number): void {
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
}
