import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { TemaDTO } from '../models/tema.dto';

@Injectable({
  providedIn: 'root',
})
export class TemaService {
  private apiUrl = 'http://localhost:3000/api/temas'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  obtenerTemas(): Observable<TemaDTO[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data =>
        data.map(item => ({
          tema_id: item.TEMA_ID,
          nombre: item.NOMBRE,
          contenido_id: item.CONTENIDO_ID,
        }))
      )
    );
  }

  insertarTema(tema: TemaDTO): Observable<any> {
    return this.http.post(this.apiUrl, {
      nombre: tema.nombre,
      contenido_id: tema.contenido_id,
    });
  }

  actualizarTema(id: number, tema: TemaDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, {
      nombre: tema.nombre,
      contenido_id: tema.contenido_id,
    });
  }

  eliminarTema(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
