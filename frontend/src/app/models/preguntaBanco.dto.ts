// Representa una pregunta del banco, incluyendo 
// su visibilidad, estado de revisión y relaciones temáticas.
export interface PreguntaBancoDTO {
  id?: number;
  texto: string;
  esPublica: boolean;
  revision: string;
  dificultadId: number;
  categoriaId: number;
  temaId: number;
  usuarioId: number;
}
