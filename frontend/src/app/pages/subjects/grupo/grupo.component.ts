import { Component, OnInit } from '@angular/core';
import { GrupoService } from '../../../services/grupo.service';
import { EstudianteDTO } from '../../../models/estudiante.dto';
import { CommonModule } from '@angular/common';
import { NavbarProfesorComponent } from '../../shared/navbar-profesor/navbar-profesor.component';
import { GrupoDTO } from '../../../models/grupo.dto';
import { UsuarioService } from '../../../services/usuario.service';

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


  usuariosRol3: any[] = [];
  errorUsuariosRol3: string | null = null;


  constructor(private grupoService: GrupoService, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    console.log('[ngOnInit] Cargando grupos...');
    this.cargarGrupos();
    this.cargarUsuariosPorRol();
  }

  cargarGrupos(): void {
    console.log('[cargarGrupos] Llamando al servicio para obtener grupos');
    this.grupoService.obtenerGrupos().subscribe({
      next: (data) => {
        console.log('[cargarGrupos] Grupos recibidos:', data);
        this.grupos = data.map(grupo => ({
          ...grupo,
          mostrarEstudiantes: false,
          estudiantes: []
        }));
      },
      error: (err) => {
        console.error('[cargarGrupos] Error al cargar grupos:', err);
        this.errorGrupos = 'Error al cargar los grupos';
      }
    });
  }

  verEstudiantes(grupoId: number): void {
    console.log(`[verEstudiantes] Grupo ID: ${grupoId}`);
    const grupo = this.grupos.find(g => g.id === grupoId);
    if (!grupo) {
      console.warn(`[verEstudiantes] No se encontró el grupo con ID: ${grupoId}`);
      return;
    }

    grupo.mostrarEstudiantes = !grupo.mostrarEstudiantes;
    console.log(`[verEstudiantes] Toggle mostrarEstudiantes a ${grupo.mostrarEstudiantes} para grupo ID ${grupoId}`);

    if (grupo.mostrarEstudiantes && grupo.estudiantes.length === 0) {
      console.log(`[verEstudiantes] Cargando estudiantes para grupo ID ${grupoId}`);
      this.grupoService.obtenerEstudiantesPorGrupo(grupoId).subscribe({
        next: (estudiantes) => {
          console.log(`[verEstudiantes] Estudiantes recibidos para grupo ${grupoId}:`, estudiantes);
          grupo.estudiantes = estudiantes;
        },
        error: (err) => {
          console.error(`[verEstudiantes] Error al cargar estudiantes del grupo ${grupoId}:`, err);
          this.errorEstudiantes = 'No se pudieron cargar los estudiantes del grupo';
        }
      });
    }
  }

  cargarUsuariosPorRol(): void {
  console.log('[cargarUsuariosPorRol3] Llamando al servicio para obtener usuarios con rol_id = 3');
  this.usuarioService.obtenerUsuariosPorRol(3).subscribe({
    next: (usuarios) => {
      console.log('[cargarUsuariosPorRol3] Usuarios recibidos:', usuarios);
      this.usuariosRol3 = usuarios;
    },
    error: (err) => {
      console.error('[cargarUsuariosPorRol3] Error al cargar usuarios por rol:', err);
      this.errorUsuariosRol3 = 'No se pudieron cargar los usuarios con rol 3';
    }
  });
}


  quitarEstudiante(grupoId: number, usuarioId: number): void {
    console.log(`[quitarEstudiante] Grupo ID: ${grupoId}, Usuario ID: ${usuarioId}`);
    if (!confirm('¿Deseas quitar este estudiante del grupo?')) {
      console.log('[quitarEstudiante] Operación cancelada por el usuario.');
      return;
    }

    const grupo = this.grupos.find(g => g.id === grupoId);
    if (!grupo) {
      console.warn(`[quitarEstudiante] No se encontró el grupo con ID: ${grupoId}`);
      return;
    }

    this.grupoService.quitarEstudianteDeGrupo(grupoId, usuarioId).subscribe({
      next: () => {
        console.log(`[quitarEstudiante] Estudiante ${usuarioId} removido del grupo ${grupoId}`);
        grupo.estudiantes = grupo.estudiantes.filter(e => e.usuario_id !== usuarioId);
        console.log(`[quitarEstudiante] Estudiantes restantes:`, grupo.estudiantes);
      },
      error: (err) => {
        console.error(`[quitarEstudiante] Error al quitar estudiante ${usuarioId} del grupo ${grupoId}:`, err);
        this.errorEstudiantes = 'No se pudo quitar el estudiante del grupo';
      }
    });
  }


  asignarEstudiante() {
  // Lógica para asignar un estudiante a un grupo
}

quitarEstudianteSeleccionado() {
  // Lógica para quitar un estudiante seleccionado
}

crearNuevoGrupo() {
  // Lógica para quitar un estudiante seleccionado
}

}
