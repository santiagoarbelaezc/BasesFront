import { Component, OnInit } from '@angular/core';
import { NavbarProfesorComponent } from '../../shared/navbar-profesor/navbar-profesor.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarEstudianteComponent } from '../../shared/navbar-estudiante/navbar-estudiante.component';

@Component({
  selector: 'app-calificaciones',
  standalone: true,
  imports: [NavbarEstudianteComponent, CommonModule, FormsModule],
  templateUrl: './calificaciones.component.html',
  styleUrls: ['./calificaciones.component.css']
  
})
export class CalificacionesComponent implements OnInit {

  listaCalificaciones: any[] = [];

  cargandoCalificaciones: boolean = false;
  errorCargaCalificaciones: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // Puedes llamar a listarCalificaciones() automáticamente al iniciar si lo deseas
    // this.listarCalificaciones();
  }

  listarCalificaciones(): void {
    // TODO: Implementar lógica para obtener todas las calificaciones
    console.log('Listar calificaciones');
  }

  filtrarPorCurso(): void {
    // TODO: Implementar lógica para filtrar calificaciones por curso
    console.log('Filtrar por curso');
  }

  filtrarPorTema(): void {
    // TODO: Implementar lógica para filtrar calificaciones por tema
    console.log('Filtrar por tema');
  }

  filtrarPorCategoria(): void {
    // TODO: Implementar lógica para filtrar calificaciones por categoría
    console.log('Filtrar por categoría');
  }

}
