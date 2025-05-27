import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Horario {
  horario_id?: number;
  grupo_id: number;
  dia: string;
  hora_inicio: string;
  hora_fin: string;
  aula: string;
}

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private apiUrl = 'http://localhost:3000/api/horarios'; // Ajusta el puerto según tu backend

  constructor(private http: HttpClient) {}

  crearHorario(horario: Horario): Observable<any> {
    return this.http.post(this.apiUrl, horario);
  }

  obtenerHorariosPorGrupo(grupo_id: number): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/${grupo_id}`);
  }

  actualizarHorario(id: number, horario: Partial<Horario>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, horario);
  }

  eliminarHorario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
