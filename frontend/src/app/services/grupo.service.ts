import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GrupoDTO } from '../models/grupo.dto';
import { GrupoConCursoDTO } from '../models/grupo-con-curso.dto';
import { EstudianteDTO } from '../models/estudiante.dto';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  private baseUrl = 'http://localhost:3000/api/grupos';

  constructor(private http: HttpClient) {}

  // 1. Obtener todos los grupos
  obtenerGrupos(): Observable<GrupoDTO[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(items => items.map(item => ({
        id: item.ID,
        nombre: item.NOMBRE,
        cursoId: item.CURSO_ID
      })))
    );
  }

  // 2. Obtener grupo por ID
  obtenerGrupoPorId(id: number): Observable<GrupoDTO> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(item => ({
        id: item.ID,
        nombre: item.NOMBRE,
        cursoId: item.CURSO_ID
      }))
    );
  }

  // 3. Crear grupo
  insertarGrupo(grupo: GrupoDTO): Observable<any> {
    return this.http.post(this.baseUrl, grupo);
  }

  // 4. Actualizar grupo
  actualizarGrupo(id: number, grupo: GrupoDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, grupo);
  }

  // 5. Eliminar grupo
  eliminarGrupo(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // 6. Obtener grupos con su curso (para vista de estudiantes)
  obtenerGruposConCurso(): Observable<GrupoConCursoDTO[]> {
    return this.http.get<GrupoConCursoDTO[]>(`${this.baseUrl}/con-curso`);
  }

  // 7. Obtener estudiantes asignados a un grupo
  obtenerEstudiantesPorGrupo(grupoId: number): Observable<EstudianteDTO[]> {
    return this.http.get<EstudianteDTO[]>(`${this.baseUrl}/${grupoId}/estudiantes`);
  }

  // 8. Quitar estudiante de un grupo
  quitarUsuarioDeGrupo(grupoId: number, usuarioId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${grupoId}/estudiantes/${usuarioId}`);
  }

  // 9. Asignar estudiante a grupo (nuevo método)
  asignarUsuarioAGrupo(data: { usuarioId: number, grupoId: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/asignar-usuario`, data);
  }
}
