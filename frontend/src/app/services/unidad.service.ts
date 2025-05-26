import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UnidadDTO } from '../models/unidad.dto';


@Injectable({
  providedIn: 'root'
})
export class UnidadService {
  private baseUrl = 'http://localhost:3000/api/unidades';

  constructor(private http: HttpClient) {}

  obtenerUnidades(): Observable<UnidadDTO[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(items => items.map(item => ({
        id: item.ID,
        nombre: item.NOMBRE,
        cursoId: item.CURSO_ID
      })))
    );
  }

  obtenerUnidadPorId(id: number): Observable<UnidadDTO> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(item => ({
        id: item.ID,
        nombre: item.NOMBRE,
        cursoId: item.CURSO_ID
      }))
    );
  }

  insertarUnidad(unidad: UnidadDTO): Observable<any> {
    return this.http.post(this.baseUrl, unidad);
  }

  actualizarUnidad(id: number, unidad: UnidadDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, unidad);
  }

  eliminarUnidad(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  // Obtener unidades con contenidos y temas anidados
  obtenerUnidadesConContenidosYTemas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/completo`);
  }
}