import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { GrupoDTO } from '../models/grupo.dto';
import { GrupoConCursoDTO } from '../models/grupo-con-curso.dto';
import { UsuarioGrupoDTO } from '../models/usuarioGrupo.dto';


@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  private apiUrl = 'http://localhost:3000/api/grupos';

  constructor(private http: HttpClient) {}

  // Obtener todos los grupos
  obtenerGrupos(): Observable<GrupoDTO[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data =>
        data.map(item => ({
          id: item.GRUPO_ID,
          nombre: item.NOMBRE,
          cursoId: item.CURSO_ID
        }))
      )
    );
  }

  // Obtener grupo por ID
  obtenerGrupoPorId(id: number): Observable<GrupoDTO> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(item => ({
        id: item.GRUPO_ID,
        nombre: item.NOMBRE,
        cursoId: item.CURSO_ID
      }))
    );
  }

  // Crear nuevo grupo
  insertarGrupo(grupo: GrupoDTO): Observable<any> {
    return this.http.post(this.apiUrl, grupo);
  }

  // Actualizar grupo
  actualizarGrupo(id: number, grupo: GrupoDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, grupo);
  }

  // Eliminar grupo
  eliminarGrupo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Obtener grupos con nombre del curso
  obtenerGruposConCurso(): Observable<GrupoConCursoDTO[]> {
    return this.http.get<any[]>(`${this.apiUrl}/con-curso`).pipe(
      map(data =>
        data.map(item => ({
          grupo_id: item.GRUPO_ID,
          nombre: item.NOMBRE,
          curso_nombre: item.CURSO_NOMBRE
        }))
      )
    );
  }

  // Obtener estudiantes por grupo
  obtenerEstudiantesPorGrupo(grupoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${grupoId}/estudiantes`);
  }


asignarEstudianteAGrupo(dto: UsuarioGrupoDTO): Observable<any> {
  return this.http.post(`${this.apiUrl}/asignar-usuario`, dto);
}


obtenerUsuarioGrupoPorGrupoId(grupoId: number): Observable<UsuarioGrupoDTO[]> {
  return this.http.get<any[]>(`${this.apiUrl}/${grupoId}/estudiantes`).pipe(
    map(data =>
      data.map(item => ({
        usuario_grupo_id: item.USUARIO_GRUPO_ID,
        usuarioId: item.USUARIO_ID,
        grupoId: item.GRUPO_ID
      }))
    )
  );
}




  // Quitar estudiante de grupo
  quitarEstudianteDeGrupo(grupoId: number, usuarioId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${grupoId}/estudiantes/${usuarioId}`);
  }
}
