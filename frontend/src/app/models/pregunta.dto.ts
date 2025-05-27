// Representa una pregunta asociada a un examen
// dentro del sistema.
export interface PreguntaDTO {
  id?: number;        // id opcional
  texto: string;
  examen_id: number;
}
