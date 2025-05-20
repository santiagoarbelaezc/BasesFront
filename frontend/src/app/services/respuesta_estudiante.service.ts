import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { RespuestaEstudianteDTO } from '../models/respuesta_pregunta.dto';


@Injectable({
  providedIn: 'root'
})
export class RespuestaEstudianteService {

  private baseUrl = 'http://localhost:3000/api/respuestasEstudiante';
 // Ajusta según tu backend

  constructor(private http: HttpClient) { }

  insertarRespuestaEstudiante(respuesta: RespuestaEstudianteDTO): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, respuesta);
  }

  actualizarRespuestaEstudiante(id: number, respuesta: RespuestaEstudianteDTO): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, respuesta);
  }

  eliminarRespuestaEstudiante(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  obtenerRespuestasEstudiante(): Observable<RespuestaEstudianteDTO[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(data => data.map(item => ({
        id: item.RESPUESTA_ESTUDIANTE_ID,
        esCorrecta: item.ESCORRECTA,
        examen_pres_id: item.EXAMEN_PRES_ID,
        pregunta_id: item.PREGUNTA_ID
      })))
    );
  }

  obtenerRespuestaEstudiantePorId(id: number): Observable<RespuestaEstudianteDTO> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(item => ({
        id: item.RESPUESTA_ESTUDIANTE_ID,
        esCorrecta: item.ESCORRECTA,
        examen_pres_id: item.EXAMEN_PRES_ID,
        pregunta_id: item.PREGUNTA_ID
      }))
    );
  }
}
