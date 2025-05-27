// Representa los datos necesarios para 
// registrar un nuevo usuario en el sistema.
export interface CrearUsuarioDTO {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  rol_id: number;
}

