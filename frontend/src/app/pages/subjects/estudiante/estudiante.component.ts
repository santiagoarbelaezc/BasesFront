import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioDTO } from '../../../models/usuario.dto';
import { NavbarProfesorComponent } from '../../shared/navbar-profesor/navbar-profesor.component';

@Component({
  selector: 'app-estudiante',
  standalone: true,
  imports: [CommonModule, NavbarProfesorComponent],
  templateUrl: './estudiante.component.html',
  styleUrl: './estudiante.component.css'
})
export class EstudianteComponent implements OnInit {
  usuariosRol3: UsuarioDTO[] = [];
  errorUsuariosRol3: string | null = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuariosPorRol();
  }

  cargarUsuariosPorRol(): void {
    console.log('[cargarUsuariosPorRol3] Llamando al servicio para obtener usuarios con rol_id = 3');
    this.usuarioService.obtenerUsuariosPorRol(3).subscribe({
      next: (usuarios) => {
        console.log('[cargarUsuariosPorRol3] Usuarios recibidos:', usuarios);
        this.usuariosRol3 = usuarios;
      },
      error: (err) => {
        console.error('[cargarUsuariosPorRol3] Error al cargar usuarios por rol:', err);
        this.errorUsuariosRol3 = 'No se pudieron cargar los usuarios con rol 3';
      }
    });
  }
}
