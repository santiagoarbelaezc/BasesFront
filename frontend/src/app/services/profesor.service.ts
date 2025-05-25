import { Injectable } from '@angular/core';
import { UsuarioDTO } from '../models/usuario.dto';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {

  private readonly STORAGE_KEY = 'profesorActual';

  // Establecer profesor y guardar en localStorage
  setProfesor(profesor: UsuarioDTO): void {
    this.profesorActual = profesor;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profesor));
  }

  // Obtener profesor del servicio o de localStorage si no está en memoria
  getProfesor(): UsuarioDTO | undefined {
    if (!this.profesorActual) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.profesorActual = JSON.parse(stored);
      }
    }
    return this.profesorActual;
  }

  // Limpiar profesor tanto de la memoria como del localStorage
  limpiarProfesor(): void {
    this.profesorActual = undefined;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private profesorActual?: UsuarioDTO;
}
