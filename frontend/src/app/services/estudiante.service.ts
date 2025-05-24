import { Injectable } from '@angular/core';
import { UsuarioDTO } from '../models/usuario.dto';


@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  private readonly STORAGE_KEY = 'examenSeleccionadoId';

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

  // Usuario quemado
  private usuarioHardcodeado: UsuarioDTO = {
    id: 27,
    nombre: 'Steven',
    apellido: 'Morales',
    correo: 'steven@correo.com',
    contrasena: '1234',
    rol_id: 3
  };

  getUsuario(): UsuarioDTO {
    return this.usuarioHardcodeado;
  }
}
