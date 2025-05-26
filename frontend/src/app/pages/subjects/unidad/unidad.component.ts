import { Component, OnInit } from '@angular/core';
import { ContenidoService } from "../../../services/contenido.service";
import { TemaService } from "../../../services/tema.service";
import { UnidadService } from "../../../services/unidad.service";
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-unidad',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './unidad.component.html',
  styleUrls: ['./unidad.component.css']
})
export class UnidadComponent implements OnInit {
  unidades: UnidadConContenidosYTemas[] = [];

  nombreUnidad = '';
  nombreContenido = '';
  nombreTema = '';

  unidadSeleccionadaId: number | null = null;
  unidadSeleccionadaParaTema: number | null = null;
  contenidoSeleccionadoId: number | null = null;

  contenidos: {
    contenido_id: number;
    nombre: string;
  }[] = [];

  constructor(
    private unidadService: UnidadService,
    private contenidoService: ContenidoService,
    private temaService: TemaService
  ) {}

  ngOnInit(): void {
    this.cargarUnidadesConTodo();
  }

  cargarUnidadesConTodo(): void {
    this.unidadService.obtenerUnidadesConContenidosYTemas().subscribe((data: any[]) => {
      this.unidades = data.map((unidad: any): UnidadConContenidosYTemas => ({
        unidad_id: unidad.UNIDAD_ID,
        nombre: unidad.NOMBRE,
        contenidos: (unidad.contenidos || []).map((contenido: any) => ({
          contenido_id: contenido.CONTENIDO_ID,
          nombre: contenido.NOMBRE,
          temas: (contenido.temas || []).map((tema: any) => ({
            tema_id: tema.TEMA_ID,
            nombre: tema.NOMBRE
          }))
        }))
      }));
    });
  }

  crearUnidad(): void {
    const nueva = { nombre: this.nombreUnidad, cursoId: 1 }; // Ajusta si cursoId es dinámico
    this.unidadService.insertarUnidad(nueva).subscribe(() => {
      this.nombreUnidad = '';
      this.cargarUnidadesConTodo();
    });
  }

  crearContenido(): void {
    if (!this.unidadSeleccionadaId) return;
    const nuevo = { nombre: this.nombreContenido, unidad_id: this.unidadSeleccionadaId };
    this.contenidoService.insertarContenido(nuevo).subscribe(() => {
      this.nombreContenido = '';
      this.cargarUnidadesConTodo();
    });
  }

  crearTema(): void {
    if (!this.contenidoSeleccionadoId) return;
    const nuevo = { nombre: this.nombreTema, contenido_id: this.contenidoSeleccionadoId };
    this.temaService.insertarTema(nuevo).subscribe(() => {
      this.nombreTema = '';
      this.cargarUnidadesConTodo();
    });
  }

  cargarContenidosPorUnidad(): void {
    if (!this.unidadSeleccionadaParaTema) {
      this.contenidos = [];
      return;
    }

    const unidad = this.unidades.find(u => u.unidad_id === this.unidadSeleccionadaParaTema);
    this.contenidos = unidad ? unidad.contenidos : [];
  }
}

// Tipado auxiliar completo para evitar 'any'
interface UnidadConContenidosYTemas {
  unidad_id: number;
  nombre: string;
  contenidos: {
    contenido_id: number;
    nombre: string;
    temas: {
      tema_id: number;
      nombre: string;
    }[];
  }[];
}
