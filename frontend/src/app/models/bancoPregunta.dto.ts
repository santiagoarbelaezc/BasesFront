export interface BancoPreguntaDTO {
  pregunta_id?: number;
  texto: string;
  es_publica: boolean;
  revision: string;
  dificultad_id: number;
  categoria_id: number;
  tema_id: number;
  usuario_id: number;
  fecha_creacion?: string;
}