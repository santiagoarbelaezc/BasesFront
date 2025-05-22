import { ExamenDTO } from "./exam.dto";
import { UsuarioDTO } from "./usuario.dto";

export interface ExamenPresentadoVistaDTO {
  id?: number;
  fecha?: Date;
  horaInicio?: Date;
  horaFin?: Date;
  porcentaje?: number;
  usuario: UsuarioDTO;
  examen: ExamenDTO;
}
