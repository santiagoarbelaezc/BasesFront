import { Component, OnInit } from '@angular/core';
import { GrupoService } from '../../../services/grupo.service';
import { EstudianteDTO } from '../../../models/estudiante.dto';
import { CommonModule } from '@angular/common';
import { NavbarProfesorComponent } from '../../shared/navbar-profesor/navbar-profesor.component';
import { GrupoDTO } from '../../../models/grupo.dto';

@Component({
  selector: 'app-grupo',
  standalone: true,
  imports: [
    CommonModule,
    NavbarProfesorComponent
  ],
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css']
})
export class GrupoComponent implements OnInit {
  grupos: (GrupoDTO & { mostrarEstudiantes: boolean; estudiantes: EstudianteDTO[] })[] = [];
  errorGrupos: string | null = null;
  errorEstudiantes: string | null = null;

  constructor(private grupoService: GrupoService) {}

  ngOnInit(): void {
    this.cargarGrupos();
  }

  cargarGrupos(): void {
    this.grupoService.obtenerGrupos().subscribe({
      next: (data) => {
        this.grupos = data.map(grupo => ({
          ...grupo,
          mostrarEstudiantes: false,
          estudiantes: []
        }));
      },
      error: (err) => {
        console.error('Error al cargar grupos:', err);
        this.errorGrupos = 'Error al cargar los grupos';
      }
    });
  }

  verEstudiantes(grupoId: number): void {
    const grupo = this.grupos.find(g => g.id === grupoId); // ✅ CAMBIO aquí
    if (!grupo) return;

    grupo.mostrarEstudiantes = !grupo.mostrarEstudiantes;

    if (grupo.mostrarEstudiantes && grupo.estudiantes.length === 0) {
      this.grupoService.obtenerEstudiantesPorGrupo(grupoId).subscribe({
        next: (estudiantes) => grupo.estudiantes = estudiantes,
        error: (err) => {
          console.error('Error al cargar estudiantes:', err);
          this.errorEstudiantes = 'No se pudieron cargar los estudiantes del grupo';
        }
      });
    }
  }

  quitarEstudiante(grupoId: number, usuarioId: number): void {
    if (!confirm('¿Deseas quitar este estudiante del grupo?')) return;

    const grupo = this.grupos.find(g => g.id === grupoId); // ✅ CAMBIO aquí
    if (!grupo) return;

    this.grupoService.quitarUsuarioDeGrupo(grupoId, usuarioId).subscribe({
      next: () => {
        grupo.estudiantes = grupo.estudiantes.filter(e => e.usuario_id !== usuarioId);
      },
      error: (err) => {
        console.error('Error al quitar estudiante:', err);
        this.errorEstudiantes = 'No se pudo quitar el estudiante del grupo';
      }
    });
  }
}
