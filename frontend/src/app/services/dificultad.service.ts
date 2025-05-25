import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DificultadDTO } from '../models/dificultad.dto';

@Injectable({
  providedIn: 'root',
})
export class DificultadService {
  private apiUrl = 'http://localhost:3000/api/dificultades'; // Ajusta URL si es necesario

  constructor(private http: HttpClient) {}

  // Obtener todas las dificultades
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

  // Insertar dificultad
  insertarDificultad(dificultad: DificultadDTO): Observable<any> {
    return this.http.post(this.apiUrl, {
      nombre: dificultad.nombre,
    });
  }

  // Actualizar dificultad
  actualizarDificultad(id: number, dificultad: DificultadDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, {
      nombre: dificultad.nombre,
    });
  }

  // Eliminar dificultad
  eliminarDificultad(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
