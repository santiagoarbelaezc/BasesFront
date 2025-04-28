import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [FormsModule,CommonModule], // Aquí puedes importar otros módulos si es necesario
  standalone: true,
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // Variables para controlar la visibilidad de los submenús
  showExamen = false;
  showPreguntas = false;

  // Función para mostrar u ocultar submenú
  toggleSubMenu(menu: string) {
    if (menu === 'examen') {
      this.showExamen = !this.showExamen;
      this.showPreguntas = false; // Ocultar el submenú de preguntas si se abre el de examen
    } else if (menu === 'preguntas') {
      this.showPreguntas = !this.showPreguntas;
      this.showExamen = false; // Ocultar el submenú de examen si se abre el de preguntas
    }
  }

  // Acciones específicas para cada botón
  accionExamen(accion: string) {
    console.log(`Acción seleccionada para Examen: ${accion}`);
    // Lógica específica para cada acción de examen
  }

  accionPreguntas(accion: string) {
    console.log(`Acción seleccionada para Preguntas: ${accion}`);
    // Lógica específica para cada acción de preguntas
  }

  accionReportes() {
    console.log('Acción seleccionada para Reportes');
    // Lógica para los reportes
  }

  accionPerfil() {
    console.log('Acción seleccionada para Perfil');
    // Lógica para el perfil
  }

  accionSalir() {
    console.log('Acción seleccionada para Salir');
    // Lógica para cerrar sesión o salir
  }
}
