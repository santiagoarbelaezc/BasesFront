import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-profesor.component.html',
  styleUrls: ['./navbar-profesor.component.css']
})
export class NavbarProfesorComponent {
  showExamen = false;
  showPreguntas = false;
  showContenidoEducativo = false;
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

    } else if (menu === 'contenidoEducativo') {
      this.showContenidoEducativo = !this.showContenidoEducativo;
      this.showExamen = false;

    } else if (menu === 'perfil') {
      this.showPerfiles = !this.showPerfiles;
      this.showPreguntas = false;
    }
  }

  accionExamen(accion: string) {
    console.log(`Acción seleccionada para Examen: ${accion}`);

    switch (accion) {
      case 'crear':
        this.router.navigate(['/exam-create']);
        break;
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

  accionContenidoEducativo(accion: string) {
    console.log(`Acción seleccionada para Examen: ${accion}`);

    switch (accion) {
      case 'grupo':
        this.router.navigate(['/grupo']);
        break;
      case 'curso':
        this.router.navigate(['/curso']);
        break;
      case 'Gestionar Contenido':
        this.router.navigate(['/exam-create']);
        break;
      case 'Gestionar Unidad':
        this.router.navigate(['/exam-detail']);
        break;
      case 'Gestionar Tema':
        this.router.navigate(['/exam-list']);
        break;
      case 'Gestionar Categoria':
        this.router.navigate(['/exam-presentation']);
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
    case 'contenido':
      this.router.navigate(['/contenido']);
      break;
    case 'unidad':
      this.router.navigate(['/unidad']);
      break;
    case 'tema':
      this.router.navigate(['/tema']);
      break;
    case 'categoria':
      this.router.navigate(['/categoria']);
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

  accionEstudiantes() {
    console.log('Acción seleccionada para Reportes');
    this.router.navigate(['/estudiantes']);
  }

  accionRoles() {
    console.log('Acción seleccionada para Reportes');
    this.router.navigate(['/rol']);
  }

  accionUsuarios() {
    console.log('Acción seleccionada para Reportes');
    this.router.navigate(['/register']);
  }

  accionPerfil(accion: string) {
  console.log(`Acción seleccionada para Preguntas: ${accion}`);

  switch (accion) {
    case 'perfiles':
      this.router.navigate(['/profile']);
      break;
    case 'roles':
      this.router.navigate(['/rol']);
      break;
    
    default:
      console.warn('Acción de preguntas no reconocida:', accion);
      break;
  }
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
        this.isLoading = false; // Oculta el indicador después del redireccionamiento
        this.router.navigate(['/login']);
      }, 500);
    }
  }, 30);
}

}
