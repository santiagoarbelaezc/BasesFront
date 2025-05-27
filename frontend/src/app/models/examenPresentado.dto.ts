// Representa un examen que ha sido presentado 
// por un usuario, incluyendo información de tiempo y resultado.
export interface ExamenPresentadoDTO {
  id?: number;
  fecha?: Date;
  horaInicio?: Date;
  horaFin?: Date;
  porcentaje?: number;
  usuarioId: number;
  examenId?: number;
}

