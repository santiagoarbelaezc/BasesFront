import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-estudiante.component.html',
  styleUrls: ['./navbar-estudiante.component.css']
})
export class NavbarEstudianteComponent {
  showExamen = false;
  showPreguntas = false;
  showPerfiles = false;

  isLoading: boolean = false;
  progressValue: number = 0;

  constructor(private router: Router) {}

  toggleSubMenu(menu: string) {
    if (menu === 'examen') {
      this.showExamen = !this.showExamen;
      this.showPreguntas = false;
    } else if (menu === 'preguntas') {
      this.showPreguntas = !this.showPreguntas;
      this.showExamen = false;
    } else if (menu === 'perfil') {
      this.showPerfiles = !this.showPerfiles;
      this.showPreguntas = false;
    }
  }

  accionInfo() {
    console.log('Acción seleccionada para Información Académica');
    this.router.navigate(['/info-academica']);
  }

  accionCalificaciones() {
    console.log('Acción seleccionada para Calificaciones');
    this.router.navigate(['/calificaciones']);
  }

  accionPresentar() {
    console.log('Acción seleccionada para Presentar Examen');
    this.router.navigate(['/presentar']);
  }

  accionSalir() {
    console.log('Acción seleccionada para Salir');
    this.isLoading = true;
    this.progressValue = 0;

    const interval = setInterval(() => {
      this.progressValue += 1;
      if (this.progressValue >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          this.isLoading = false;
          this.router.navigate(['/login']);
        }, 500);
      }
    }, 30);
  }
}
