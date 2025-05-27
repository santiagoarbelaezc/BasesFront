import { ExamenDTO } from "./exam.dto";
import { UsuarioDTO } from "./usuario.dto";

// Representa la calificación obtenida
//  por un usuario en un examen, incluyendo fecha, nota y tiempos de ejecución.
export interface CalificacionDTO {
  fecha?: Date;
  horaInicio?: Date;
  horaFin?: Date;
  porcentaje?: number;
  examen: ExamenDTO;
  nota: number;
}

