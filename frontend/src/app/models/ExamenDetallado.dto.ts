// Representa un examen con todos sus atributos, 
// incluyendo detalles adicionales como el nombre del curso asociado.
export interface ExamenDetalladoDTO {
  id?: number;
  examen: string;
  nombre: string;
  cantidad_preguntas: number;
  fecha: string;
  tiempo: number;
  pesoCurso: number;
  umbralDeAprobacion: number;
  asignacion: string;
  tema_id: number;
  categoria_id: number;

  // Detalles adicionales agregados manualmente
  cursoNombre?: string;
}

