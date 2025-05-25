import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BancoPreguntaDTO } from '../models/bancoPregunta.dto';
 // Asegúrate de crear esta interfaz

@Injectable({
  providedIn: 'root'
})
export class BancoService {
  private apiUrl = 'http://localhost:3000/api/bancoPreguntas'; // Ajusta la URL según tu ruta

  constructor(private http: HttpClient) { }

  // Obtener todas las preguntas del banco
  obtenerBancoPreguntas(): Observable<BancoPreguntaDTO[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => data.map(item => ({
        pregunta_id: item.PREGUNTA_ID,
        texto: item.TEXTO,
        es_publica: item.ES_PUBLICA,
        revision: item.REVISION,
        dificultad_id: item.DIFICULTAD_ID,
        categoria_id: item.CATEGORIA_ID,
        tema_id: item.TEMA_ID,
        usuario_id: item.USUARIO_ID,
        fecha_creacion: item.FECHA_CREACION
      })))
    );
  }

  // Obtener una pregunta por ID
  obtenerPreguntaPorId(id: number): Observable<BancoPreguntaDTO> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(item => ({
        pregunta_id: item.PREGUNTA_ID,
        texto: item.TEXTO,
        es_publica: item.ES_PUBLICA,
        revision: item.REVISION,
        dificultad_id: item.DIFICULTAD_ID,
        categoria_id: item.CATEGORIA_ID,
        tema_id: item.TEMA_ID,
        usuario_id: item.USUARIO_ID,
        fecha_creacion: item.FECHA_CREACION
      }))
    );
  }

  // Obtener preguntas por usuario ID ordenadas por mayor ID
obtenerPreguntasPorUsuarioId(usuarioId: number): Observable<BancoPreguntaDTO[]> {
  return this.http.get<any[]>(`${this.apiUrl}/usuario/${usuarioId}`).pipe(
    map(data => 
      data.map(item => ({
        pregunta_id: item.PREGUNTA_ID,
        texto: item.TEXTO,
        es_publica: item.ES_PUBLICA,
        revision: item.REVISION,
        dificultad_id: item.DIFICULTAD_ID,
        categoria_id: item.CATEGORIA_ID,
        tema_id: item.TEMA_ID,
        usuario_id: item.USUARIO_ID,
        fecha_creacion: item.FECHA_CREACION
      }))
      .sort((a, b) => b.pregunta_id - a.pregunta_id) // Orden descendente por ID
    )
  );
}


  // Insertar nueva pregunta
  insertarPregunta(pregunta: BancoPreguntaDTO): Observable<any> {
    return this.http.post(this.apiUrl, pregunta);
  }

  // Actualizar pregunta
  actualizarPregunta(id: number, pregunta: BancoPreguntaDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, pregunta);
  }

  // Eliminar pregunta
  eliminarPregunta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}