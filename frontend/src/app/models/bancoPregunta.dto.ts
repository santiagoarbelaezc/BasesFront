// Representa una pregunta del banco de preguntas 
// utilizada para crear, consultar o editar preguntas en el sistema.
export interface BancoPreguntaDTO {
  pregunta_id?: number;
  texto: string;
  es_publica: boolean;
  revision: string;
  dificultad_id: number;
  categoria_id: number;
  tema_id: number;
  usuario_id: number;
}
