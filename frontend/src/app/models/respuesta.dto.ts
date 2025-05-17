export interface RespuestaDTO {
  id?: number;       // id opcional
  texto: string;
  esCorrecto: number;  // o boolean, según cómo uses en Angular
  pregunta_id: number;
}
