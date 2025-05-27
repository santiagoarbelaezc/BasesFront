// Representa una posible respuesta a una pregunta, 
// indicando si es la opción correcta.
export interface RespuestaDTO {
  id?: number;       // id opcional
  texto: string;
  esCorrecto: number;  // o boolean, según cómo uses en Angular
  pregunta_id: number;
}

