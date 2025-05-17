import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CategoriaDTO } from '../models/categoria.dto';
 // ajusta el path según tu estructura

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private apiUrl = 'http://localhost:3000/api/categorias';

  constructor(private http: HttpClient) {}

  // Obtener todas las categorías
obtenerCategorias(): Observable<CategoriaDTO[]> {
  return this.http.get<any[]>(this.apiUrl).pipe(
    map(data => data.map(item => ({
      categoria_id: item.CATEGORIA_ID,
      nombre: item.NOMBRE
    })))
  );
}


  // Insertar nueva categoría
  insertarCategoria(categoria: CategoriaDTO): Observable<any> {
    return this.http.post(this.apiUrl, categoria);
  }

  // Actualizar categoría
  actualizarCategoria(id: number, categoria: CategoriaDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, categoria);
  }

  // Eliminar categoría
  eliminarCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
