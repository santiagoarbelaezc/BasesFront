import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { RespuestaDTO } from '../models/respuesta.dto';

@Injectable({
  providedIn: 'root'
})
export class RespuestaService {

  private baseUrl = 'http://localhost:3000/api/respuestas'; // Ajusta según tu backend

  constructor(private http: HttpClient) { }

  // Insertar respuesta
  insertarRespuesta(respuesta: RespuestaDTO): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, respuesta);
  }

  // Actualizar respuesta
  actualizarRespuesta(id: number, respuesta: RespuestaDTO): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, respuesta);
  }

  // Eliminar respuesta
  eliminarRespuesta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  // Obtener todas las respuestas
  obtenerRespuestas(): Observable<RespuestaDTO[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(data => data.map(item => ({
        id: item.RESPUESTA_ID,
        texto: item.TEXTO,
        esCorrecto: item.ESCORRECTO,
        pregunta_id: item.PREGUNTA_ID
      })))
    );
  }

  // Obtener respuesta por id
  obtenerRespuestaPorId(id: number): Observable<RespuestaDTO> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(item => ({
        id: item.RESPUESTA_ID,
        texto: item.TEXTO,
        esCorrecto: item.ESCORRECTO,
        pregunta_id: item.PREGUNTA_ID
      }))
    );
  }
}
