import { Component, OnInit } from '@angular/core';
import { GrupoService } from '../../../services/grupo.service';
import { EstudianteDTO } from '../../../models/estudiante.dto';
import { CommonModule } from '@angular/common';
import { NavbarProfesorComponent } from '../../shared/navbar-profesor/navbar-profesor.component';
import { GrupoDTO } from '../../../models/grupo.dto';
import { UsuarioService } from '../../../services/usuario.service';
import { CursoDTO } from '../../../models/curso.dto';
import { CursoService } from '../../../services/curso.service';
import { FormsModule } from '@angular/forms';
import { UsuarioGrupoDTO } from '../../../models/usuarioGrupo.dto';

@Component({
  selector: 'app-grupo',
  standalone: true,
  imports: [
    CommonModule,
    NavbarProfesorComponent, FormsModule
  ],
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css']
})
export class GrupoComponent implements OnInit {
  grupos: (GrupoDTO & { mostrarEstudiantes: boolean; estudiantes: EstudianteDTO[] })[] = [];
  errorGrupos: string | null = null;
  errorEstudiantes: string | null = null;

  nombreGrupo: string = '';

  cursoSeleccionado: CursoDTO | null = null;

  cursos: CursoDTO[] = [];
  errorCursos: string | null = null;


  usuariosRol3: any[] = [];
  errorUsuariosRol3: string | null = null;


  estudianteSeleccionadoId: number | null = null;
  grupoSeleccionadoId: number | null = null;



  constructor(private grupoService: GrupoService, private usuarioService: UsuarioService,
    private cursoService: CursoService
  ) {}

  ngOnInit(): void {
    console.log('[ngOnInit] Cargando grupos...');
    this.cargarGrupos();
    this.cargarUsuariosPorRol();
    this.cargarCursos();

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


  cargarCursos(): void {
  console.log('[cargarCursos] Llamando al servicio para obtener cursos');
  this.cursoService.obtenerCursos().subscribe({
    next: (data) => {
      console.log('[cargarCursos] Cursos recibidos:', data);
      this.cursos = data.map((curso: any) => ({
        curso_id: curso.id,
        nombre: curso.nombre,
        descripcion: curso.descripcion
      }));
    },
    error: (err) => {
      console.error('[cargarCursos] Error al cargar cursos:', err);
      this.errorCursos = 'Error al cargar los cursos';
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

  // Alternar visibilidad
  grupo.mostrarEstudiantes = !grupo.mostrarEstudiantes;
  console.log(`[verEstudiantes] Toggle mostrarEstudiantes a ${grupo.mostrarEstudiantes} para grupo ID ${grupoId}`);

  // Si se va a mostrar y aún no tiene estudiantes cargados
  if (grupo.mostrarEstudiantes && (!grupo.estudiantes || grupo.estudiantes.length === 0)) {
    console.log(`[verEstudiantes] Cargando estudiantes para grupo ID ${grupoId}`);

    this.grupoService.obtenerEstudiantesPorGrupo(grupoId).subscribe({
      next: (estudiantesRaw) => {
        console.log(`[verEstudiantes] Estudiantes recibidos para grupo ${grupoId}:`, estudiantesRaw);
        
        // Transformar claves a camelCase
        const estudiantes = estudiantesRaw.map(e => ({
          usuario_id: e.USUARIO_ID,
          nombre: e.NOMBRE,
          apellido: e.APELLIDO,
          correo: e.CORREO
        }));

        grupo.estudiantes = estudiantes;
      },
      error: (err) => {
        console.error(`[verEstudiantes] Error al cargar estudiantes del grupo ${grupoId}:`, err);
        this.errorEstudiantes = 'No se pudieron cargar los estudiantes del grupo';
        grupo.mostrarEstudiantes = false; // Ocultar tabla si falla la carga
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


asignarEstudiante(): void {
  if (!this.estudianteSeleccionadoId || !this.grupoSeleccionadoId) {
    alert('Debe seleccionar un estudiante y un grupo');
    return;
  }

  const grupoDTO: UsuarioGrupoDTO = {
    usuarioId: +this.estudianteSeleccionadoId,
    grupoId: +this.grupoSeleccionadoId
  };

  console.log('Datos a enviar para asignar estudiante:', grupoDTO);

  this.grupoService.asignarEstudianteAGrupo(grupoDTO).subscribe({
    next: () => {
      console.log(`[asignarEstudiante] Estudiante ${grupoDTO.usuarioId} asignado al grupo ${grupoDTO.grupoId}`);
      alert('Estudiante asignado exitosamente.');
      const grupo = this.grupos.find(g => g.id === grupoDTO.grupoId);
      if (grupo) {
        grupo.mostrarEstudiantes = true;
        this.verEstudiantes(grupoDTO.grupoId);
      }
    },
    error: (err) => {
      console.error('[asignarEstudiante] Error al asignar estudiante:', err);
      alert('Error al asignar estudiante al grupo');
    }
  });
}



quitarEstudianteSeleccionado() {
  // Lógica para quitar un estudiante seleccionado
}

crearNuevoGrupo(): void {
  console.log('[crearNuevoGrupo] Iniciando creación de nuevo grupo');

  if (!this.cursoSeleccionado) {
    alert('Debe seleccionar un curso para crear el grupo.');
    return;
  }
  const nuevoGrupo: GrupoDTO = {
    nombre: this.nombreGrupo,
    cursoId: this.cursoSeleccionado!.curso_id!
  };

  console.log('[crearNuevoGrupo] Datos del grupo a enviar:', nuevoGrupo);

  this.grupoService.insertarGrupo(nuevoGrupo).subscribe({
    next: () => {
      console.log('[crearNuevoGrupo] Grupo creado exitosamente');
      alert('Grupo creado exitosamente.');
      this.nombreGrupo = '';
      this.cursoSeleccionado = null;
      console.log('[crearNuevoGrupo] Valores reseteados. Cargando grupos...');
      this.cargarGrupos();
    },
    error: (err) => {
      console.error('[crearNuevoGrupo] Error al crear grupo:', err);
      alert('Hubo un error al crear el grupo.');
    }
  });
}



onEstudianteSeleccionado(): void {
  console.log('[onEstudianteSeleccionado] ID seleccionado (original):', this.estudianteSeleccionadoId);
  console.log('[onEstudianteSeleccionado] Array usuariosRol3:', this.usuariosRol3);

  if (this.estudianteSeleccionadoId === null) {
    console.warn('[onEstudianteSeleccionado] ID es null');
    return;
  }

  // Convertir a número
  const estudianteIdNum = +this.estudianteSeleccionadoId;
  console.log('[onEstudianteSeleccionado] ID seleccionado (convertido a number):', estudianteIdNum);

  const estudiante = this.usuariosRol3.find(e => e.id === estudianteIdNum);
  console.log('[onEstudianteSeleccionado] Estudiante seleccionado:', estudiante);
}



onGrupoSeleccionado(): void {
  console.log('[onGrupoSeleccionado] ID del grupo seleccionado:', this.grupoSeleccionadoId);
}

cargarUsuarioGrupoPorGrupoId(grupoId: number): void {
  console.log(`[cargarUsuarioGrupoPorGrupoId] Grupo ID: ${grupoId}`);

  this.grupoService.obtenerUsuarioGrupoPorGrupoId(grupoId).subscribe({
    next: (data) => {
      console.log(`[cargarUsuarioGrupoPorGrupoId] Datos recibidos para grupo ${grupoId}:`, data);

      // Mapear las propiedades mayúsculas del backend al DTO con propiedades minúsculas
      const estudiantesMapeados = data.map((item: any) => ({
        usuario_id: item.USUARIO_ID,
        nombre: item.NOMBRE,
        apellido: item.APELLIDO,
        correo: item.CORREO
      }));

      // Buscar el grupo correspondiente en el array 'grupos'
      const grupo = this.grupos.find(g => g.id === grupoId);
      if (grupo) {
        grupo.estudiantes = estudiantesMapeados; // Asignar los estudiantes mapeados
        grupo.mostrarEstudiantes = true; // Mostrar tabla
      }
    },
    error: (err) => {
      console.error(`[cargarUsuarioGrupoPorGrupoId] Error al cargar usuario_grupo:`, err);
      alert('No se pudo obtener la información de los estudiantes.');
    }
  });
}

}
