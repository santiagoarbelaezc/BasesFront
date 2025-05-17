export interface RespuestaEstudianteDTO {
  id?: number;
  esCorrecta: number;       // o boolean, según cómo manejes el valor
  examen_pres_id: number;
  pregunta_id: number;
}
