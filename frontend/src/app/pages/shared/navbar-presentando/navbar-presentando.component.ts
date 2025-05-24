import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-presentando.component.html',
  styleUrls: ['./navbar-presentando.component.css'],
})
export class NavbarPresentandoComponent {
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
        this.router.navigate(['/presentar']);
      }, 500);
    }
  }, 30);
}

}
