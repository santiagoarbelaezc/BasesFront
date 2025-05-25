import { Injectable } from '@angular/core';
import { UsuarioDTO } from '../models/usuario.dto';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {

  private profesorActual?: UsuarioDTO; // Guarda el profesor actual

  // Método para establecer el profesor actual
  setProfesor(profesor: UsuarioDTO): void {
    this.profesorActual = profesor;
  }

  // Método para obtener el profesor actual
  getProfesor(): UsuarioDTO | undefined {
    return this.profesorActual;
  }

  // Opcional: método para limpiar el profesor actual
  limpiarProfesor(): void {
    this.profesorActual = undefined;
  }
}
