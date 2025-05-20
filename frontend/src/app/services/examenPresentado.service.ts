import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ExamenPresentadoDTO } from '../models/examenPresentado.dto';


@Injectable({
  providedIn: 'root'
})
export class ExamenPresentadoService {

  private baseUrl = 'http://localhost:3000/api/examenesPresentados';

  constructor(private http: HttpClient) { }

  insertarExamenPresentado(examenPresentado: ExamenPresentadoDTO): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, examenPresentado);
  }

  actualizarExamenPresentado(id: number, examenPresentado: ExamenPresentadoDTO): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, examenPresentado);
  }

  eliminarExamenPresentado(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  obtenerExamenesPresentados(): Observable<ExamenPresentadoDTO[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(data => data.map(item => ({
        id: item.EXAMEN_PRESENTADO_ID,
        fecha: item.FECHA,
        horaInicio: item.HORA_INICIO,
        horaFin: item.HORA_FIN,
        porcentaje: item.PORCENTAJE,
        usuarioId: item.USUARIO_ID,
        examenId: item.EXAMEN_ID
      })))
    );
  }

  obtenerExamenPresentadoPorId(id: number): Observable<ExamenPresentadoDTO> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(item => ({
        id: item.EXAMEN_PRESENTADO_ID,
        fecha: item.FECHA,
        horaInicio: item.HORA_INICIO,
        horaFin: item.HORA_FIN,
        porcentaje: item.PORCENTAJE,
        usuarioId: item.USUARIO_ID,
        examenId: item.EXAMEN_ID
      }))
    );
  }

}
