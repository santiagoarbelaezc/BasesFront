import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoAcademicaService } from '../../../services/info-academica.service';
import { NavbarEstudianteComponent } from '../../shared/navbar-estudiante/navbar-estudiante.component';
import { EstudianteService } from '../../../services/estudiante.service'; // Asegúrate que la ruta sea correcta
import { UsuarioDTO } from '../../../models/usuario.dto';


@Component({
  selector: 'app-info-academica',
  standalone: true,
  imports: [CommonModule, NavbarEstudianteComponent],
  templateUrl: './info-academica.component.html',
  styleUrl: './info-academica.component.css'
})
export class InfoAcademicaComponent implements OnInit {
  infoAcademica: any[] = [];
  cargando: boolean = true;
  errorCarga: boolean = false;

  constructor(
    private infoService: InfoAcademicaService,
    private estudianteService: EstudianteService
  ) {}

  ngOnInit(): void {
    const usuario: UsuarioDTO | undefined = this.estudianteService.getUsuario();

    if (!usuario || !usuario.id) {
      console.error('❌ No se encontró el usuario o su ID en EstudianteService.');
      this.errorCarga = true;
      this.cargando = false;
      return;
    }

    const usuarioId = usuario.id;
    console.log('📌 ngOnInit iniciado. ID del usuario desde EstudianteService:', usuarioId);
    this.cargando = true;

    this.infoService.getInfoAcademica(usuarioId).subscribe({
      next: (data) => {
        console.log('✅ Datos recibidos desde el backend:', data);
        this.infoAcademica = data;
        this.cargando = false;
        console.log('📦 Información académica almacenada en la variable: infoAcademica');
      },
      error: (err) => {
        console.error('❌ Error al obtener información académica:', err);
        this.errorCarga = true;
        this.cargando = false;
        console.log('🚫 Se activó errorCarga y se detuvo cargando.');
      }
    });
  }
}
