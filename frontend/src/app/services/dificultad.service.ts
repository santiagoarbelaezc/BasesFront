import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DificultadDTO } from '../models/dificultad.dto';

/**
 * Servicio que gestiona las operaciones CRUD relacionadas con los niveles de dificultad
 * asociados a preguntas o exámenes en el sistema.
 */

@Injectable({
  providedIn: 'root',
})
export class DificultadService {
  private apiUrl = 'http://localhost:3000/api/dificultades'; // Ajusta URL si es necesario

  constructor(private http: HttpClient) {}

/**
   * Obtiene la lista de niveles de dificultad disponibles.
   * @returns Observable con el arreglo de dificultades adaptado a DificultadDTO.
   */

  obtenerDificultades(): Observable<DificultadDTO[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data =>
        data.map(item => ({
          dificultad_id: item.DIFICULTAD_ID,
          nombre: item.NOMBRE,
        }))
      )
    );
  }

/**
   * Inserta un nuevo nivel de dificultad en el sistema.
   * @param dificultad Objeto con el nombre del nivel de dificultad a registrar.
   * @returns Observable con la respuesta del servidor.
   */

  insertarDificultad(dificultad: DificultadDTO): Observable<any> {
    return this.http.post(this.apiUrl, {
      nombre: dificultad.nombre,
    });
  }

  /**
   * Actualiza un nivel de dificultad existente.
   * @param id ID del nivel a actualizar.
   * @param dificultad Datos actualizados del nivel.
   * @returns Observable con la respuesta del servidor.
   */

  actualizarDificultad(id: number, dificultad: DificultadDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, {
      nombre: dificultad.nombre,
    });
  }

  /**
   * Elimina un nivel de dificultad por su ID.
   * @param id ID del nivel a eliminar.
   * @returns Observable con la respuesta del servidor.
   */
  
  eliminarDificultad(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
