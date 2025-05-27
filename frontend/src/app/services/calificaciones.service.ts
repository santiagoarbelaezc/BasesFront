import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


/**
 * Servicio encargado de consultar las calificaciones finales de los usuarios desde el backend.
 */

@Injectable({
  providedIn: 'root'
})
export class CalificacionesService {
  private apiUrl = 'http://localhost:3000/api/calificaciones';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la nota final acumulada de un usuario específico.
   * @param usuarioId ID del usuario del cual se desea consultar la nota.
   * @returns Observable con la nota final del usuario.
   */
  
  obtenerNotaFinal(usuarioId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/nota-final/${usuarioId}`);
  }
}
