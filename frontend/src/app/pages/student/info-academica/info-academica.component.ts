import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoAcademicaService } from '../../../services/info-academica.service'; // Ajusta la ruta si es necesario
import { NavbarEstudianteComponent } from '../../shared/navbar-estudiante/navbar-estudiante.component';

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

  constructor(private infoService: InfoAcademicaService) {}

  ngOnInit(): void {
    const usuarioId = 1; // 🔁 Sustituye esto con el ID real del usuario autenticado

    this.infoService.getInfoAcademica(usuarioId).subscribe({
      next: (data) => {
        this.infoAcademica = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error al obtener información académica:', err);
        this.errorCarga = true;
        this.cargando = false;
      }
    });
  }
}
