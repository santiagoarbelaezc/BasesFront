import { ExamenDTO } from "./exam.dto";
import { UsuarioDTO } from "./usuario.dto";

export interface CalificacionDTO {
  
  fecha?: Date;
  horaInicio?: Date;
  horaFin?: Date;
  porcentaje?: number;
  examen: ExamenDTO;
  nota: number;
  
}
