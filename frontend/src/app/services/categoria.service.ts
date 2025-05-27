import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CategoriaDTO } from '../models/categoria.dto';

/**
 * Servicio que gestiona las operaciones CRUD relacionadas con las categorías temáticas.
 */

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private apiUrl = 'http://localhost:3000/api/categorias';

  constructor(private http: HttpClient) {}

/**
   * Obtiene todas las categorías desde el backend y las adapta al formato del DTO.
   * @returns Observable con la lista de categorías.
   */

obtenerCategorias(): Observable<CategoriaDTO[]> {
  return this.http.get<any[]>(this.apiUrl).pipe(
    map(data => data.map(item => ({
      categoria_id: item.CATEGORIA_ID,
      nombre: item.NOMBRE
    })))
  );
}

/**
   * Inserta una nueva categoría en la base de datos.
   * @param categoria Objeto con los datos de la categoría a insertar.
   * @returns Observable con la respuesta del servidor.
   */

  insertarCategoria(categoria: CategoriaDTO): Observable<any> {
    return this.http.post(this.apiUrl, categoria);
  }

/**
   * Actualiza una categoría existente.
   * @param id ID de la categoría a actualizar.
   * @param categoria Objeto con los datos actualizados.
   * @returns Observable con la respuesta del servidor.
   */

  actualizarCategoria(id: number, categoria: CategoriaDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, categoria);
  }

/**
   * Elimina una categoría por su ID.
   * @param id ID de la categoría a eliminar.
   * @returns Observable con la respuesta del servidor.
   */
  
  eliminarCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
