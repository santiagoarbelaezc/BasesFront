import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 // Ajusta la ruta según tu estructura

interface UsuarioDTO {
  nombre: string;
  rol: string;
  fechaRegistro: string;
}

@Component({
  selector: 'app-home',
  imports: [NavbarComponent,CommonModule,FormsModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuariosRecientes: UsuarioDTO[] = [];
  isLoading = false;
  progressValue = 0;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuariosRecientes();
  }

  cargarUsuariosRecientes(): void {
    this.isLoading = true;
    this.progressValue = 20;

    this.usuarioService.obtenerUsuarios().subscribe({
      next: (data) => {
        this.progressValue = 70;
        // Asumiendo que tu API devuelve un arreglo de arreglos (any[][]), 
        // aquí mapeamos a nuestro DTO con las propiedades necesarias.
        this.usuariosRecientes = data.map(usuarioArr => ({
          nombre: usuarioArr[1],           // ejemplo: posición 1 nombre
          rol: usuarioArr[5],              // ejemplo: posición 5 rol
          fechaRegistro: usuarioArr[6]    // ejemplo: posición 6 fechaRegistro
        }));
        this.progressValue = 100;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios recientes:', err);
        this.isLoading = false;
        this.progressValue = 0;
      }
    });
  }

  // Método para scroll del carrusel (si lo usas)
  scrollCarousel(carouselId: string, direction: 'left' | 'right'): void {
    const carousel = document.querySelector(`.${carouselId}`) as HTMLElement;
    if (!carousel) return;

    const scrollAmount = 300; // pixeles a mover
    if (direction === 'left') {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
}
