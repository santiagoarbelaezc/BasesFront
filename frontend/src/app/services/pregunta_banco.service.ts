import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PreguntaBancoDTO } from '../models/preguntaBanco.dto';


@Injectable({
  providedIn: 'root'
})
export class PreguntaBancoService {
  private baseUrl = 'http://localhost:8080/api/preguntas';

  constructor(private http: HttpClient) {}

  obtenerPreguntas(): Observable<PreguntaBancoDTO[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(items => items.map(item => ({
        id: item.ID,
        texto: item.TEXTO,
        esPublica: item.ES_PUBLICA,
        revision: item.REVISION,
        dificultadId: item.DIFICULTAD_ID,
        categoriaId: item.CATEGORIA_ID,
        temaId: item.TEMA_ID,
        usuarioId: item.USUARIO_ID
      })))
    );
  }

  obtenerPreguntaPorId(id: number): Observable<PreguntaBancoDTO> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(item => ({
        id: item.ID,
        texto: item.TEXTO,
        esPublica: item.ES_PUBLICA,
        revision: item.REVISION,
        dificultadId: item.DIFICULTAD_ID,
        categoriaId: item.CATEGORIA_ID,
        temaId: item.TEMA_ID,
        usuarioId: item.USUARIO_ID
      }))
    );
  }

  insertarPregunta(pregunta: PreguntaBancoDTO): Observable<any> {
    return this.http.post(this.baseUrl, pregunta);
  }

  actualizarPregunta(id: number, pregunta: PreguntaBancoDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, pregunta);
  }

  eliminarPregunta(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
