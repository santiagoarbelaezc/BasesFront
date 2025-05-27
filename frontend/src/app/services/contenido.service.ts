import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ContenidoDTO } from '../models/contenido.dto';

/**
 * Servicio que gestiona las operaciones CRUD relacionadas con los contenidos académicos.
 */

@Injectable({
  providedIn: 'root'
})
export class ContenidoService {
  private baseUrl = 'http://localhost:3000/api/contenidos';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los contenidos registrados en el sistema.
   * @returns Observable con la lista de contenidos adaptados al modelo ContenidoDTO.
   */

  obtenerContenidos(): Observable<ContenidoDTO[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(items => items.map(item => ({
        id: item.ID,           // asumo que el campo PK se llama ID o similar
        nombre: item.NOMBRE,
        unidad_id: item.UNIDAD_ID
      })))
    );
  }

  /**
   * Obtiene un contenido específico por su ID.
   * @param id ID del contenido a consultar.
   * @returns Observable con el contenido correspondiente adaptado a ContenidoDTO.
   */

  obtenerContenidoPorId(id: number): Observable<ContenidoDTO> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(item => ({
        id: item.ID,
        nombre: item.NOMBRE,
        unidad_id: item.UNIDAD_ID
      }))
    );
  }

  /**
   * Inserta un nuevo contenido en la base de datos.
   * @param contenido Datos del contenido a registrar.
   * @returns Observable con la respuesta del servidor.
   */

  insertarContenido(contenido: ContenidoDTO): Observable<any> {
    return this.http.post(this.baseUrl, contenido);
  }

  /**
   * Actualiza un contenido existente.
   * @param id ID del contenido a modificar.
   * @param contenido Objeto con los datos actualizados.
   * @returns Observable con la respuesta del servidor.
   */

  actualizarContenido(id: number, contenido: ContenidoDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, contenido);
  }

  /**
   * Elimina un contenido por su ID.
   * @param id ID del contenido a eliminar.
   * @returns Observable con la respuesta del servidor.
   */

  eliminarContenido(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
