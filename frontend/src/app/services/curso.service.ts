import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CursoDTO } from '../models/curso.dto';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private baseUrl = 'http://localhost:3000/api/cursos'; // Ajusta si tu puerto/backend cambia

  constructor(private http: HttpClient) {}

  // Obtener todos los cursos
  obtenerCursos(): Observable<CursoDTO[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(items => items.map(item => ({
        id: item.CURSO_ID,
        nombre: item.NOMBRE,
        descripcion: item.DESCRIPCION
      })))
    );
  }

  // Obtener curso por ID (opcional si tu backend lo permite)
  obtenerCursoPorId(id: number): Observable<CursoDTO> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(item => ({
        id: item.CURSO_ID,
        nombre: item.NOMBRE,
        descripcion: item.DESCRIPCION
      }))
    );
  }

  // Crear un curso
  insertarCurso(curso: CursoDTO): Observable<any> {
    return this.http.post(this.baseUrl, curso);
  }

  // Actualizar curso
  actualizarCurso(id: number, curso: CursoDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, curso);
  }

  // Eliminar curso
  eliminarCurso(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
