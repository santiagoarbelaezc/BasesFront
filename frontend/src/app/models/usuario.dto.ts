// Representa un usuario registrado en el sistema
// con sus datos personales y rol asignado.
export interface UsuarioDTO {
  id?: number;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  rol_id: number;
}

