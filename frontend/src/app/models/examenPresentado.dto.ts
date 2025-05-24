export interface ExamenPresentadoDTO {
  id?: number;
  fecha?: Date;
  horaInicio?: Date;
  horaFin?: Date;
  porcentaje?: number;
  usuarioId: number;
  examenId?: number;
}
