// Representa el horario asignado a un grupo, 
// incluyendo día, hora y aula correspondiente.
export interface HorarioDTO {
  horario_id?: number;
  grupo_id: number;
  dia: string;
  hora_inicio: string;
  hora_fin: string;
  aula: string;
}
