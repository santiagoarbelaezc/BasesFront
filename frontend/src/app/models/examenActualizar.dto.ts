// Representa los datos necesarios para actualizar 
// el registro de un examen presentado por un usuario.
export interface ExamenActualizarPresentDTO {
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  porcentaje?: number;
  usuarioId: number;
  examenId?: number;
}

