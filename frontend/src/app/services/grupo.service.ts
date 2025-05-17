import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GrupoDTO } from '../models/grupo.dto';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  private baseUrl = 'http://localhost:8080/api/grupos';

  constructor(private http: HttpClient) {}

  obtenerGrupos(): Observable<GrupoDTO[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(items => items.map(item => ({
        id: item.ID,
        nombre: item.NOMBRE,
        cursoId: item.CURSO_ID
      })))
    );
  }

  obtenerGrupoPorId(id: number): Observable<GrupoDTO> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(item => ({
        id: item.ID,
        nombre: item.NOMBRE,
        cursoId: item.CURSO_ID
      }))
    );
  }

  insertarGrupo(grupo: GrupoDTO): Observable<any> {
    return this.http.post(this.baseUrl, grupo);
  }

  actualizarGrupo(id: number, grupo: GrupoDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, grupo);
  }

  eliminarGrupo(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
