export interface ExamenDTO {
  id?: number; // opcional para cuando creas un examen nuevo (aún no tiene id)
  examen: string;
  nombre: string;
  cantidad_preguntas: number;
  fecha: string;          // formato ISO string, e.g. "2025-05-14T00:00:00Z"
  tiempo: number;         // minutos o segundos, según tu lógica
  pesoCurso: number;      // peso o valor numérico del curso
  umbralDeAprobacion: number; // porcentaje o nota mínima para aprobar
  asignacion: string;     // puede ser un string, según tu modelo
  tema_id: number;
  categoria_id: number;
}
