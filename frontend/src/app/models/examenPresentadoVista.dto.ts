import { ExamenDTO } from "./exam.dto";
import { UsuarioDTO } from "./usuario.dto";

// Representa un examen presentado por un usuario 
// con los datos completos del examen y del usuario asociado.
export interface ExamenPresentadoVistaDTO {
  id?: number;
  fecha?: Date;
  horaInicio?: Date;
  horaFin?: Date;
  porcentaje?: number;
  usuario: UsuarioDTO;
  examen: ExamenDTO;
}

