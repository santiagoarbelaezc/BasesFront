import { Injectable } from '@angular/core';
import { ExamenPresentadoVistaDTO } from '../models/examenPresentadoVista.dto';
import { ExamenPresentadoDTO } from '../models/examenPresentado.dto';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ExamenPresentadoService } from './examenPresentado.service';
import { RespuestaEstudianteService } from './respuesta_estudiante.service';
import { ExamenActualizarPresentDTO } from '../models/examenActualizar.dto';

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {

  constructor(
    private respuestaEstudianteService: RespuestaEstudianteService,
    private examenPresentadoService: ExamenPresentadoService
  ) { }
calcularYActualizarCalificacion(examenPresentadoVista: ExamenPresentadoVistaDTO): Observable<ExamenPresentadoVistaDTO> {
  const examenPresId = examenPresentadoVista.id;

  if (!examenPresId) {
    throw new Error('Examen presentado no tiene ID definido');
  }

  return this.respuestaEstudianteService.obtenerRespuestasEstudiante().pipe(
    map(respuestas => {
      const respuestasDelExamen = respuestas.filter(
        r => r.examen_pres_id === examenPresId
      );

      const total = respuestasDelExamen.length;
      const correctas = respuestasDelExamen.filter(r => r.esCorrecta === 1).length;
      const porcentaje = total > 0 ? (correctas / total) * 100 : 0;

      // Convertimos a los campos que espera el backend
      const examenActualizado: ExamenActualizarPresentDTO = {
        fecha: examenPresentadoVista.fecha ? new Date(examenPresentadoVista.fecha).toISOString().slice(0, 19) : undefined,
        horaInicio: examenPresentadoVista.horaInicio ? new Date(examenPresentadoVista.horaInicio).toISOString().slice(0, 19) : undefined,
        horaFin: examenPresentadoVista.horaFin ? new Date(examenPresentadoVista.horaFin).toISOString().slice(0, 19) : undefined,
        porcentaje: porcentaje,
        usuarioId: examenPresentadoVista.usuario.id!,
        examenId: examenPresentadoVista.examen.id!
        };



      console.log('Examen actualizado:', examenActualizado);

      return { examenActualizado, porcentaje };
    }),
    switchMap(({ examenActualizado, porcentaje }) =>
      this.examenPresentadoService.actualizarExamenPresentado(
        examenPresentadoVista.id!,
        examenActualizado
      ).pipe(
        map(() => {
          const examenActualizadoVista: ExamenPresentadoVistaDTO = {
            ...examenPresentadoVista,
            porcentaje: porcentaje
          };
          return examenActualizadoVista;
        })
      )
    )
  );
}
}
