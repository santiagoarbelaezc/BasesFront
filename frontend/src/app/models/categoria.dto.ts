// Representa una categoría temática utilizada 
// para agrupar preguntas o exámenes dentro del sistema.
export interface CategoriaDTO {
  categoria_id?: number; // opcional si es autogenerado por la BD
  nombre: string;
}

