import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ExamenDTO } from '../models/exam.dto';


@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private baseUrl = 'http://localhost:3000/api/examenes'; // Ajusta el puerto y path según tu backend

  constructor(private http: HttpClient) { }

  // Insertar examen
  insertarExamen(examen: ExamenDTO): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, examen);
  }

  // Actualizar examen
  actualizarExamen(id: number, examen: ExamenDTO): Observable<any> {
    
    return this.http.put<any>(`${this.baseUrl}/${id}`, examen);
  }

  // Eliminar examen
  eliminarExamen(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  // Opcional: obtener todos los examenes
  obtenerExamenes(): Observable<ExamenDTO[]> {
  return this.http.get<any[]>(this.baseUrl).pipe(
    map(data => data.map(item => ({
      id: item.EXAMEN_ID,
      examen: item.EXAMEN,
      nombre: item.NOMBRE,
      cantidad_preguntas: item.CANTIDAD_PREGUNTAS,
      fecha: item.FECHA,
      tiempo: item.TIEMPO,
      pesoCurso: item.PESOCURSO,
      umbralDeAprobacion: item.UMBRALDEAPROBACION,
      asignacion: item.ASIGNACION,
      tema_id: item.TEMA_ID,
      categoria_id: item.CATEGORIA_ID
    })))
  );
}

  obtenerExamenPorId(id: number): Observable<ExamenDTO> {
  return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
    map(item => ({
      id: item.EXAMEN_ID,
      examen: item.EXAMEN,
      nombre: item.NOMBRE,
      cantidad_preguntas: item.CANTIDAD_PREGUNTAS,
      fecha: item.FECHA,
      tiempo: item.TIEMPO,
      pesoCurso: item.PESOCURSO,
      umbralDeAprobacion: item.UMBRALDEAPROBACION,
      asignacion: item.ASIGNACION,
      tema_id: item.TEMA_ID,
      categoria_id: item.CATEGORIA_ID
    }))
  );
}

}
