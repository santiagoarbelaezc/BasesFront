import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalificacionesService {
  private apiUrl = 'http://localhost:3000/api/calificaciones';

  constructor(private http: HttpClient) {}

  obtenerNotaFinal(usuarioId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/nota-final/${usuarioId}`);
  }
}
