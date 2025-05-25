import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Curso {
  curso_id?: number;
  nombre: string;
  descripcion: string;
}

@Injectable({ providedIn: 'root' })
export class CursoService {
  private apiUrl = 'http://localhost:3000/api/cursos';

  constructor(private http: HttpClient) {}

  crearCurso(curso: Curso): Observable<any> {
    return this.http.post(this.apiUrl, curso);
  }

  obtenerCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl);
  }

  actualizarCurso(id: number, curso: Curso): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, curso);
  }

  eliminarCurso(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
