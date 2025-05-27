import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HorarioDTO } from '../../../models/horario.dto';
import { GrupoDTO } from '../../../models/grupo.dto';
import { HorarioService } from '../../../services/horario.service';
import { CommonModule } from '@angular/common';
import { NavbarEstudianteComponent } from '../../shared/navbar-estudiante/navbar-estudiante.component';
import { FormsModule } from '@angular/forms';
import { NavbarProfesorComponent } from '../../shared/navbar-profesor/navbar-profesor.component';

@Component({
  selector: 'app-horario-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarProfesorComponent],
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent implements OnInit {
  dias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  horas: string[] = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];
  horarios: HorarioDTO[] = [];
  grupos: GrupoDTO[] = [];


  horario: HorarioDTO = {
    grupo_id: 0,
    dia: '',
    hora_inicio: '',
    hora_fin: '',
    aula: ''
  };

  constructor(private horarioService: HorarioService, private http: HttpClient) {}

  ngOnInit(): void {
    console.log('[ngOnInit] Componente inicializado');

    this.cargarHorarios();

    console.log('[ngOnInit] Cargando grupos...');
    this.http.get<any[]>('http://localhost:3000/api/grupos')
  .subscribe({
    next: data => {
      this.grupos = data.map(grupo => ({
        id: grupo.GRUPO_ID,
        nombre: grupo.NOMBRE,
        cursoId: grupo.CURSO_ID
      }));
      console.log('[ngOnInit] Grupos cargados:', this.grupos);
    },
    error: err => {
      console.error('[ngOnInit] Error cargando grupos:', err);
    }
  });

  }


  grupoSeleccionadoId: number = 0;

cargarHorariosPorGrupo() {
  if (!this.grupoSeleccionadoId) return;

  this.horarioService.obtenerHorariosPorGrupo(this.grupoSeleccionadoId).subscribe({
    next: (data: any[]) => {
      this.horarios = data.map(h => ({
        grupo_id: h[1],
        dia: h[2],
        hora_inicio: h[3],
        hora_fin: h[4],
        aula: h[5]
      }));
    },
    error: err => {
      console.error('[cargarHorariosPorGrupo] Error:', err);
    }
  });
}


  cargarHorarios() {
  console.log('[cargarHorarios] Solicitando todos los horarios...');
  this.horarioService.obtenerTodosLosHorarios().subscribe({
    next: (data: any[]) => {
      this.horarios = data.map(h => ({
        grupo_id: h[1],       // ID del grupo
        dia: h[2],            // Día
        hora_inicio: h[3],    // Hora inicio
        hora_fin: h[4],       // Hora fin
        aula: h[5]            // Aula
      }));
      console.log('[cargarHorarios] Horarios recibidos (formato mapeado):', this.horarios);
    },
    error: err => {
      console.error('[cargarHorarios] Error obteniendo horarios:', err);
    }
  });
}

  onSubmit() {
    console.log('[onSubmit] Datos del formulario antes de procesar:', this.horario);

    const inicio = this.horario.hora_inicio;
    const finIndex = this.horas.indexOf(inicio) + 1;
    this.horario.hora_fin = this.horas[finIndex] || '14:00';

    console.log('[onSubmit] Datos a enviar (con hora_fin calculada):', this.horario);

    this.horarioService.crearHorario(this.horario).subscribe({
      next: () => {
        alert('Horario creado correctamente');
        console.log('[onSubmit] Horario registrado exitosamente.');
        this.cargarHorarios();
      },
      error: err => {
        console.error('[onSubmit] Error al crear horario:', err);
        alert('Error: ' + err.error);
      }
    });
  }
}