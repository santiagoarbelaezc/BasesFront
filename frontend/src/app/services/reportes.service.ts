import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private baseUrl = 'http://localhost:3000/api/reportes'; // Ajusta si tu backend usa otro puerto

  constructor(private http: HttpClient) {}

  // 1️⃣ Exámenes presentados
  getExamenesPresentados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/examenes`);
  }

  // 2️⃣ Estadísticas por pregunta
  getEstadisticasPorPregunta(examenId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/preguntas/${examenId}/estadisticas`);
  }

  // 3️⃣ Resumen del curso
  getResumenCurso(cursoId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/resumen/curso/${cursoId}`);
  }

  // 4️⃣ Notas por curso
  getNotasPorCurso(cursoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notas/${cursoId}`);
  }
}
