import { Injectable } from '@angular/core';
import { UsuarioDTO } from '../models/usuario.dto';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  private readonly STORAGE_KEY = 'examenSeleccionadoId';

  private usuarioActual?: UsuarioDTO; // <-- variable para guardar el usuario dinámico

  setExamenSeleccionadoId(id: number): void {
    localStorage.setItem(this.STORAGE_KEY, id.toString());
  }

  getExamenSeleccionadoId(): number | null {
    const id = localStorage.getItem(this.STORAGE_KEY);
    return id ? parseInt(id, 10) : null;
  }

  limpiarExamenSeleccionado(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Método para establecer el usuario actual
  setUsuario(usuario: UsuarioDTO): void {
    this.usuarioActual = usuario;
  }

  // Método para obtener el usuario actual
  getUsuario(): UsuarioDTO | undefined {
    return this.usuarioActual;
  }
}
