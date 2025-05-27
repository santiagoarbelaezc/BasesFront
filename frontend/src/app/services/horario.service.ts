import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HorarioDTO } from '../models/horario.dto';



@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  private apiUrl = 'http://localhost:3000/api/horarios'; // Ajusta el puerto según tu backend

  constructor(private http: HttpClient) {}

  crearHorario(horario: HorarioDTO): Observable<any> {
    return this.http.post(this.apiUrl, horario);
  }

  obtenerHorariosPorGrupo(grupo_id: number): Observable<HorarioDTO[]> {
    return this.http.get<HorarioDTO[]>(`${this.apiUrl}/${grupo_id}`);
  }

  actualizarHorario(id: number, horario: Partial<HorarioDTO>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, horario);
  }

  eliminarHorario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

obtenerTodosLosHorarios(): Observable<HorarioDTO[]> {
  return this.http.get<HorarioDTO[]>(`${this.apiUrl}`);
}


}