import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showExamen = false;
  showPreguntas = false;

  constructor(private router: Router) {}

  toggleSubMenu(menu: string) {
    if (menu === 'examen') {
      this.showExamen = !this.showExamen;
      this.showPreguntas = false;
    } else if (menu === 'preguntas') {
      this.showPreguntas = !this.showPreguntas;
      this.showExamen = false;
    }
  }

  accionExamen(accion: string) {
    console.log(`Acción seleccionada para Examen: ${accion}`);

    switch (accion) {
      case 'detalles':
        this.router.navigate(['/exam-detail']);
        break;
      case 'lista':
        this.router.navigate(['/exam-list']);
        break;
      case 'presentados':
        this.router.navigate(['/exam-presentation']);
        break;
      case 'resultados':
        this.router.navigate(['/exam-result']);
        break;
      default:
        console.warn('Acción de examen no reconocida:', accion);
        break;
    }
  }

  accionPreguntas(accion: string) {
  console.log(`Acción seleccionada para Preguntas: ${accion}`);

  switch (accion) {
    case 'banco':
      this.router.navigate(['/ques-bank']);
      break;
    case 'crear':
      this.router.navigate(['/ques-create']);
      break;
    case 'vista':
      this.router.navigate(['/ques-prev']);
      break;
    default:
      console.warn('Acción de preguntas no reconocida:', accion);
      break;
  }
}

  accionReportes() {
    console.log('Acción seleccionada para Reportes');
    this.router.navigate(['/reports']);
  }

  accionPerfil() {
    console.log('Acción seleccionada para Perfil');
  }

  accionSalir() {
    console.log('Acción seleccionada para Salir');
    // Aquí podrías redirigir a login y limpiar sesión
    this.router.navigate(['/login']);
  }
}
