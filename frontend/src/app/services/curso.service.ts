import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CursoDTO } from '../models/curso.dto';

/**
 * Servicio que gestiona las operaciones relacionadas con los cursos académicos,
 * incluyendo su creación, edición, eliminación y consulta por ID o tema.
 */

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private baseUrl = 'http://localhost:3000/api/cursos'; // Ajusta si tu puerto/backend cambia

  constructor(private http: HttpClient) {}

/**
   * Obtiene la lista de todos los cursos registrados en el sistema.
   * @returns Observable con el arreglo de cursos en formato CursoDTO.
   */

  obtenerCursos(): Observable<CursoDTO[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(items => items.map(item => ({
        id: item.CURSO_ID,
        nombre: item.NOMBRE,
        descripcion: item.DESCRIPCION
      })))
    );
  }

  /**
   * Obtiene los datos de un curso específico por su ID.
   * @param id ID del curso a consultar.
   * @returns Observable con el curso correspondiente.
   */

  obtenerCursoPorId(id: number): Observable<CursoDTO> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(item => ({
        id: item.CURSO_ID,
        nombre: item.NOMBRE,
        descripcion: item.DESCRIPCION
      }))
    );
  }

/**
   * Registra un nuevo curso en la base de datos.
   * @param curso Objeto con los datos del curso a insertar.
   * @returns Observable con la respuesta del servidor.
   */

  insertarCurso(curso: CursoDTO): Observable<any> {
    return this.http.post(this.baseUrl, curso);
  }

/**
   * Actualiza los datos de un curso existente.
   * @param id ID del curso a modificar.
   * @param curso Datos actualizados del curso.
   * @returns Observable con la respuesta del servidor.
   */

  actualizarCurso(id: number, curso: CursoDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, curso);
  }

 /**
   * Elimina un curso del sistema por su ID.
   * @param id ID del curso a eliminar.
   * @returns Observable con la respuesta del servidor.
   */

  eliminarCurso(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

/**
   * Obtiene el nombre del curso asociado a un tema dado.
   * @param temaId ID del tema.
   * @returns Observable con el nombre del curso correspondiente, o 'Desconocido' si no se encuentra.
   */
  
  obtenerCursoPorTemaId(temaId: number): Observable<string> {
  return this.http.get<any>(`${this.baseUrl}/por-tema/${temaId}`).pipe(
    map(item => item?.NOMBRE || 'Desconocido')
  );
}
}
