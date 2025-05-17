import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ContenidoDTO } from '../models/contenido.dto';


@Injectable({
  providedIn: 'root'
})
export class ContenidoService {
  private baseUrl = 'http://localhost:8080/api/contenidos';

  constructor(private http: HttpClient) {}

  obtenerContenidos(): Observable<ContenidoDTO[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(items => items.map(item => ({
        id: item.ID,           // asumo que el campo PK se llama ID o similar
        nombre: item.NOMBRE,
        unidad_id: item.UNIDAD_ID
      })))
    );
  }

  obtenerContenidoPorId(id: number): Observable<ContenidoDTO> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(item => ({
        id: item.ID,
        nombre: item.NOMBRE,
        unidad_id: item.UNIDAD_ID
      }))
    );
  }

  insertarContenido(contenido: ContenidoDTO): Observable<any> {
    return this.http.post(this.baseUrl, contenido);
  }

  actualizarContenido(id: number, contenido: ContenidoDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, contenido);
  }

  eliminarContenido(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
