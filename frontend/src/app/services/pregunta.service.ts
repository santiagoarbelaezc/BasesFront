import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PreguntaDTO } from '../models/pregunta.dto';

@Injectable({
  providedIn: 'root'
})
export class PreguntaService {

  private baseUrl = 'http://localhost:3000/api/preguntas'; // Ajusta el puerto y path según tu backend

  constructor(private http: HttpClient) { }

  // Insertar pregunta
  insertarPregunta(pregunta: PreguntaDTO): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, pregunta);
  }

  // Actualizar pregunta
  actualizarPregunta(id: number, pregunta: PreguntaDTO): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, pregunta);
  }

  // Eliminar pregunta
  eliminarPregunta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  // Obtener todas las preguntas
  obtenerPreguntas(): Observable<PreguntaDTO[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(data => data.map(item => ({
        id: item.PREGUNTA_ID,
        texto: item.TEXTO,
        examen_id: item.EXAMEN_ID
      })))
    );
  }

  // Obtener pregunta por id
  obtenerPreguntaPorId(id: number): Observable<PreguntaDTO> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(item => ({
        id: item.PREGUNTA_ID,
        texto: item.TEXTO,
        examen_id: item.EXAMEN_ID
      }))
    );
  }

  obtenerPreguntasPorExamenId(examenId: number): Observable<PreguntaDTO[]> {
  return this.http.get<any[]>(`${this.baseUrl}/examen/${examenId}`).pipe(
    map(data => data.map(item => ({
      id: item.PREGUNTA_ID,
      texto: item.TEXTO,
      examen_id: item.EXAMEN_ID
    })))
  );
}

}
