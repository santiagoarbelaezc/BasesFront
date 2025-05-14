import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  // Login de usuario
  login(username: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  // Registro de usuario (solo para administrador)
  register(data: {
    nombre: string;
    apellido: string;
    correo: string;
    contrasena: string;
    rol_id: number;
  }) {
    return this.http.post(`${this.apiUrl}/register`, data, this.getAuthHeaders());
  }

  // Obtener todos los usuarios (solo para administrador)
  obtenerUsuarios(): Observable<any[][]> {
    return this.http.get<any[][]>(`${this.apiUrl}/`, this.getAuthHeaders());
  }

  // Actualizar usuario (solo administrador)
  actualizarUsuario(id: number, data: {
    nombre: string;
    apellido: string;
    correo: string;
    contrasena: string;
    rol_id: number;
  }) {
    return this.http.put(`${this.apiUrl}/${id}`, data, this.getAuthHeaders());
  }

  // Eliminar usuario (solo administrador)
  eliminarUsuario(id: number): Observable<any> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de usuario inválido'));
    }

    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders()).pipe(
      catchError(error => {
        console.error('Error en servicio eliminarUsuario:', error);
        return throwError(() => error);
      })
    );
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }
}
